import { AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

type Registro = {
  id: number;
  tag: string;
  nombre?: string;
  categoria?: string | null;
  fecha_hora?: string | null;
  created_at?: string | null;
};

type EstadoTag = 'taller' | 'fuera';
interface TagMeta {
  nombre?: string;
  categoria?: string | null;
  lastId?: number;
  lastTs: number;
  estado: EstadoTag;
}

type Asignacion = {
  id: number;
  persona_tag: string;
  persona_nombre?: string | null;
  item_tag: string;
  item_nombre?: string | null;
  asignado_en: string;
  devuelto_en?: string | null;
  activo: boolean;
};

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  panolId?: number;
  seccionActiva: string | null = null;

  opcionesMenu: string[] = [
    'Interfaz Visual',
    'Inventario',
    'Empleados',
    'Personalización'
  ];

  registros: Registro[] = [];
  tagsTaller: Registro[] = [];
  tagsFuera:  Registro[] = [];
  tagsEstado: { [tag: string]: EstadoTag } = {};

  loading = false;
  error?: string;
  qVisual: string = '';
  qInventario: string = '';
  qEmpleados: string = '';

  private sub?: Subscription;

  private API = 'http://192.168.111.218:5000/api/v1/register/tag/list/';
  private API_EDIT = 'http://192.168.111.218:5000/api/v1/register/tag';
  private API_ASSIGN = 'http://192.168.111.218:5000/api/v1/assignments';
  private API_ASSIGN_AUTO = 'http://192.168.111.218:5000/api/v1/assignments/auto/';

  // Estado local/meta
  private tagMeta: Record<string, TagMeta> = {};
  private lastSeen: Record<string, { id: number; ts: number }> = {};
  private STORAGE_KEY = 'sicap_ui_estado';

  private pollingMs = 2000;
  private reqInFlight = false;
  private visHandler?: () => void;

  private cooldownPersonaTag: string | null = null;
  private cooldownHasta = 0;
  private cooldownMs = 3000; 

  //  SESIÓN DE PERSONA + CARRITO DE INSUMOS
  currentPersona: { tag: string; nombre?: string|null } | null = null;
  carritoSesion = new Map<string, { tag: string; nombre?: string|null; lastTs: number }>();
  ultimoPingPersonaTs = 0;

  expanded: Set<string> = new Set();
  asigCache: Record<string, Asignacion[]> = {};
  asigLoading: Record<string, boolean> = {};
  asigError: Record<string, string | undefined> = {};

  constructor(
    private toast: ToastController,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(p => {
      this.panolId = +(p.get('panolId') || 0) || undefined;
    });
  }

  private catKey(cat: string | null | undefined): string {
    return (cat ?? '').toString().trim().toLowerCase();
  }

  private normCat(cat: string | null | undefined): ''|'persona'|'insumo' {
    const k = (cat ?? '').toString().trim().toLowerCase();
    if (k === 'objeto') return 'insumo';
    if (k === 'persona' || k === 'insumo') return k;
    return '';
  }

  private normTxt(s?: string | null): string {
    return (s ?? '').toString().normalize('NFD').replace(/\p{Diacritic}/gu,'').toLowerCase().trim();
  }

  private matchQuery(reg: Registro, q: string): boolean {
    const qq = this.normTxt(q);
    if (!qq) return true;
    const n = this.normTxt(reg.nombre);
    const t = this.normTxt(reg.tag);
    const tokens = qq.split(/\s+/).filter(Boolean);
    const fields = [n, t];
    return tokens.every(tok =>
      fields.some(f => f.split(/\s+/).some(word => word.startsWith(tok)))
    );
  }

  private fetchActivosCount(personaTag: string): Promise<number> {
    return new Promise((resolve) => {
      this.http
        .get<Asignacion[]>(`${this.API_ASSIGN}/?activo=1&persona_tag=${encodeURIComponent(personaTag)}`)
        .subscribe({
          next: rows => resolve((rows || []).length),
          error: _ => resolve(0),
        });
    });
  }

  isPersona(cat: string | null | undefined)      { return this.normCat(cat) === 'persona'; }
  isInsumo(cat: string | null | undefined)       { return this.normCat(cat) === 'insumo'; }
  isSinCategoria(cat: string | null | undefined) { return this.normCat(cat) === ''; }

  editOpen = false;
  modeloEdicion: { id: number|null; nombre: string; categoria: 'persona'|'insumo'|'' } = {
    id: null, nombre: '', categoria: ''
  };

  friendlyCategoria(cat: string | null | undefined): string {
    const n = this.normCat(cat);
    if (n === 'persona') return 'Persona';
    if (n === 'insumo')  return 'Insumo';
    return '—';
  }

  get inventarioItems()   { return this.tagsUnicos.filter(r => this.isInsumo(r.categoria)); }
  get empleadosItems()    { return this.tagsUnicos.filter(r => this.isPersona(r.categoria)); }
  get sinCategoriaItems() { return this.tagsUnicos.filter(r => this.isSinCategoria(r.categoria)); }

  setCategoria(reg: Registro, categoria: 'persona'|'insumo'|null) {
    const url = `${this.API_EDIT}/${reg.id}/editar/`;
    this.http.put(url, { categoria }).subscribe({
      next: () => {
        this.patchEverywhereByTag(reg.tag, { categoria: categoria as any });

        const m = this.tagMeta[reg.tag] ?? { lastTs: this.ts(reg), lastId: reg.id, estado: this.tagsEstado[reg.tag] ?? 'taller' };
        m.categoria = categoria as any;
        this.tagMeta[reg.tag] = m;
        this.saveState();

        if (categoria === 'persona') this.seccionActiva = 'Empleados';
        if (categoria === 'persona' && this.expanded.has(reg.tag)) {
          this.cargarAsignacionesPersona(reg.tag);
        }
        if (categoria === 'insumo')  this.seccionActiva = 'Inventario';
      },
      error: (e) => console.error(e)
    });
  }

  async editarNombreInline(reg: Registro, ev?: Event) {
    ev?.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Editar nombre',
      inputs: [{ name: 'nombre', type: 'text', value: reg.nombre || '', placeholder: 'Nombre…' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: ({ nombre }) => this.editarSoloNombre(reg, (nombre ?? '').trim())
        }
      ]
    });
    await alert.present();
  }

  onAsignarCategoria(reg: Registro, ev: any) {
    const value = (ev?.detail?.value ?? '').toString();
    this.setCategoria(reg, value);
  }

  private editarSoloNombre(reg: Registro, nuevoNombre: string) {
    const url = `${this.API_EDIT}/${reg.id}/editar/`;
    this.http.put(url, { nombre: nuevoNombre || null }).subscribe({
      next: () => {
        this.patchEverywhereByTag(reg.tag, { nombre: nuevoNombre || undefined });

        const m = this.tagMeta[reg.tag] ?? { lastTs: this.ts(reg), lastId: reg.id, estado: this.tagsEstado[reg.tag] ?? 'taller' };
        m.nombre = nuevoNombre || undefined;
        this.tagMeta[reg.tag] = m;
        this.saveState();
        this.ok('Nombre actualizado');
      },
      error: (e) => console.error('No se pudo actualizar el nombre', e)
    });
  }

  private cargarAsignacionesPersona(tag: string) {
    this.asigLoading[tag] = true;
    this.asigError[tag] = undefined;

    this.http
      .get<Asignacion[]>(`${this.API_ASSIGN}/?activo=1&persona_tag=${encodeURIComponent(tag)}`)
      .subscribe({
        next: rows => {
          this.asigCache[tag] = rows || [];
          this.asigLoading[tag] = false;
        },
        error: err => {
          console.error(err);
          this.asigError[tag] = 'No pude cargar asignaciones';
          this.asigLoading[tag] = false;
        },
      });
  }

  toggleAsignados(reg: Registro, ev?: Event) {
    ev?.stopPropagation();
    const tag = reg.tag;

    if (this.expanded.has(tag)) {
      this.expanded.delete(tag);
    } else {
      this.expanded.add(tag);
      if (!this.asigCache[tag]) this.cargarAsignacionesPersona(tag);
    }
  }

  devolverAsignacion(a: Asignacion) {
    this.http.put<Asignacion>(`${this.API_ASSIGN}/${a.id}/devolver/`, {}).subscribe({
      next: () => {
        const list = this.asigCache[a.persona_tag] || [];
        this.asigCache[a.persona_tag] = list.filter(x => x.id !== a.id);
        this.ok('Devuelto');
      },
      error: e => console.error('No se pudo devolver', e),
    });
  }

  private abrirSesionPersona(r: Registro) {
    this.currentPersona = { tag: r.tag, nombre: r.nombre ?? null };
    this.carritoSesion.clear();
    this.ultimoPingPersonaTs = this.ts(r);

    this.seccionActiva = 'Empleados';
    this.expanded.add(r.tag);
    this.cargarAsignacionesPersona(r.tag);

    this.ok(`Sesión iniciada: ${r.nombre || r.tag}`);
  }

  private async cerrarSesionPersona(): Promise<void> {
    if (!this.currentPersona) return;

    const persona = this.currentPersona;
    const items = Array.from(this.carritoSesion.values()).map(x => ({
      tag: x.tag,
      nombre: x.nombre ?? null
    }));

    if (!items.length) {
      const activos = await this.fetchActivosCount(persona.tag);
      if (activos > 0) {
        // Mantener sesión abierta
        this.ok(`Aún quedan ${activos} insumo(s) activos: la sesión sigue abierta`);
        return;
      }
      this.currentPersona = null;
      this.carritoSesion.clear();
      this.cooldownPersonaTag = persona.tag;
      this.cooldownHasta = Date.now() + this.cooldownMs;
      this.ok('Sesión cerrada');
      return;
    }
  
     const payload = {
        persona_tag: persona.tag,
        persona_nombre: persona.nombre ?? null,
        items
      };

      try {
        await this.http.post(this.API_ASSIGN_AUTO, payload).toPromise();
        this.ok('Insumos asignados');

        this.cargarAsignacionesPersona(persona.tag);

        this.carritoSesion.clear();

        const restantes = await this.fetchActivosCount(persona.tag);
        if (restantes > 0) {
          this.ok(`Quedan ${restantes} activo(s). La sesión sigue abierta.`);
          return;
        }

        this.currentPersona = null;
        this.cooldownPersonaTag = persona.tag;
        this.cooldownHasta = Date.now() + this.cooldownMs;
        this.ok('Sesión cerrada');
      } catch (e) {
        console.error('Fallo assignments/auto', e);
        this.asigError[persona.tag] = 'No se pudieron asignar los insumos';
      }
    }
  private sumarAlCarritoSiCorresponde(r: Registro) {
    if (!this.currentPersona) return;
    if (!this.isInsumo(r.categoria)) return;

    const existia = this.carritoSesion.has(r.tag);
    this.carritoSesion.set(r.tag, {
      tag: r.tag,
      nombre: r.nombre ?? null,
      lastTs: this.ts(r)
    });
    if (!existia) {
      this.ok(`+ ${r.nombre || r.tag} agregado a la sesión`);
    }
  }

  private ts(r: Registro): number {
    const f = r.fecha_hora || r.created_at;
    return f ? new Date(f).getTime() : 0;
  }

  private async ok(msg: string) {
    const toast = await this.toast.create({
      message: msg,
      duration: 1800,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  private aplicarMeta(r: Registro): Registro {
    const m = this.tagMeta[r.tag];
    const nombre = r.nombre ?? m?.nombre ?? undefined;
    const catNorm = this.normCat(r.categoria ?? m?.categoria ?? null) || null;
    return { ...r, nombre, categoria: catNorm };
  }

  private patchEverywhereByTag(tag: string, patch: Partial<Registro>) {
    const apply = (arr: Registro[]) =>
      arr.map(x => x.tag === tag ? ({ ...x, ...patch }) : x);

    this.registros  = apply(this.registros);
    this.tagsTaller = apply(this.tagsTaller);
    this.tagsFuera  = apply(this.tagsFuera);
  }

  private esEstrictamenteMasNuevo(nuevo: Registro): boolean {
    const prev = this.lastSeen[nuevo.tag];
    const t = this.ts(nuevo);

    if (!prev) return true; // primera vez que vemos el tag
    if (t && prev.ts) return t > prev.ts;
    if (typeof nuevo.id === 'number' && typeof prev.id === 'number') {
      return nuevo.id > prev.id;
    }
    return false;
  }

  private marcarVisto(r: Registro) {
    this.lastSeen[r.tag] = { id: Number(r.id) || 0, ts: this.ts(r) };
  }

  private upsertEnLista(lista: Registro[], r: Registro) {
    const i = lista.findIndex(x => x.tag === r.tag);
    if (i >= 0) lista.splice(i, 1);
    lista.unshift(r);
  }

  abrirEdicion(reg: Registro, ev?: Event) {
    ev?.stopPropagation();
    this.modeloEdicion = {
      id: reg.id,
      nombre: reg.nombre || '',
      categoria: this.normCat(reg.categoria)
    };
    this.editOpen = true;
  }

  guardarEdicion() {
    if (this.modeloEdicion.id == null) return;

    const id = this.modeloEdicion.id;
    const categoriaPayload = this.modeloEdicion.categoria === '' ? null : this.modeloEdicion.categoria;

    const url = `${this.API_EDIT}/${id}/editar/`;
    this.http.put(url, {
      nombre: this.modeloEdicion.nombre,
      categoria: categoriaPayload
    }).subscribe({
      next: () => {
        const row = [...this.registros, ...this.tagsTaller, ...this.tagsFuera].find(x => x.id === id);
        const tag = row?.tag;

        if (tag) {
          this.patchEverywhereByTag(tag, {
            nombre: this.modeloEdicion.nombre,
            categoria: categoriaPayload as any
          });

          const meta = this.tagMeta[tag] ?? { lastTs: this.ts(row!), lastId: id, estado: this.tagsEstado[tag] ?? 'taller' };
          meta.nombre = this.modeloEdicion.nombre || undefined;
          meta.categoria = (categoriaPayload ?? null);
          this.tagMeta[tag] = meta;
          this.saveState();
        }

        if (categoriaPayload === 'persona')      this.seccionActiva = 'Empleados';
        else if (categoriaPayload === 'insumo')  this.seccionActiva = 'Inventario';
        else                                     this.seccionActiva = 'Personalización';

        this.editOpen = false;

        const persona = [...this.registros, ...this.tagsTaller, ...this.tagsFuera].find(x => x.id === id);
        if (persona && this.isPersona(categoriaPayload) && this.expanded.has(persona.tag)) {
          this.cargarAsignacionesPersona(persona.tag);
        }
      },
      error: (err) => console.error('No se pudo guardar', err)
    });
  }

  ngOnInit() {
    this.loadState();
    this.cargarRegistros(); 

    this.visHandler = () => {
      if (document.hidden) {
        this.sub?.unsubscribe();
      } else if (this.seccionActiva) {
        this.sub?.unsubscribe();
        this.sub = interval(this.pollingMs).subscribe(() => this.cargarRegistros());
      }
    };
    document.addEventListener('visibilitychange', this.visHandler);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
    if (this.visHandler) {
      document.removeEventListener('visibilitychange', this.visHandler);
    }
  }

  activarSeccion(nombre: string) {
    this.seccionActiva = nombre;

    const necesitaDatos =
      nombre === 'Interfaz Visual' ||
      nombre === 'Inventario' ||
      nombre === 'Empleados' ||
      nombre === 'Personalización';

    this.sub?.unsubscribe();

    if (necesitaDatos) {
      this.cargarRegistros(); 
      this.sub = interval(this.pollingMs).subscribe(() => this.cargarRegistros());
    }
  }

  volverAlMenuCentral() {
    this.seccionActiva = null;
    this.sub?.unsubscribe();
  }

  procesarRegistro(nuevo: Registro) {
    const reg = this.aplicarMeta(nuevo);
    const tag = reg.tag;
    const ts  = this.ts(reg);
    const idNum = Number(reg.id) || 0;
    const cat = this.normCat(reg.categoria); // '' | 'persona' | 'insumo'

    this.lastSeen[tag] = { id: idNum, ts };

    if (this.isPersona(cat)) {
      if (this.cooldownPersonaTag === tag && Date.now() < this.cooldownHasta) {
        return;
      }
    }

    if (this.isSinCategoria(cat)) {
      const m = this.tagMeta[tag] ?? { lastTs: ts, lastId: idNum, estado: 'taller' as EstadoTag };
      m.lastTs = ts;
      m.lastId = idNum;
      if (reg.nombre) m.nombre = reg.nombre;
      m.categoria = null;
      this.tagMeta[tag] = m;
      this.saveState();
      return;
    }

    if (this.isPersona(cat)) {
      const m = this.tagMeta[tag] ?? { lastTs: ts, lastId: idNum, estado: 'taller' as EstadoTag };
      m.lastTs = ts;
      m.lastId = idNum;
      if (reg.nombre) m.nombre = reg.nombre;
      m.categoria = 'persona';
      this.tagMeta[tag] = m;
      this.saveState();

      if (this.currentPersona && this.currentPersona.tag === tag) {
        this.cerrarSesionPersona(); 
        return;
      }

      // si hay otra persona con sesión abierta -> intentar cerrar y luego ver si abrimos esta
      if (this.currentPersona && this.currentPersona.tag !== tag) {
        this.cerrarSesionPersona().then(() => {
          // si la anterior quedó abierta (por activos), no abrir nueva
          if (this.currentPersona && this.currentPersona.tag !== tag) return;
          // respetar cooldown antes de abrir
          if (!(this.cooldownPersonaTag === tag && Date.now() < this.cooldownHasta)) {
            this.abrirSesionPersona(reg);
          }
        });
        return;
      }

      // no había sesión abierta: abrir si no está en cooldown
      if (!(this.cooldownPersonaTag === tag && Date.now() < this.cooldownHasta)) {
        this.abrirSesionPersona(reg);
      }
      return;
    }

    if (!this.tagMeta[tag]) {
      this.tagMeta[tag] = {
        lastTs: ts, lastId: idNum, estado: 'taller',
        nombre: reg.nombre, categoria: 'insumo'
      };
      this.tagsTaller = this.tagsTaller.filter(x => x.tag !== tag);
      this.upsertEnLista(this.tagsTaller, reg);
      this.tagsEstado[tag] = 'taller';
      this.saveState();
      this.sumarAlCarritoSiCorresponde(reg);
      return;
    }

    const m = this.tagMeta[tag];
    if (m.estado === 'taller') {
      this.tagsTaller = this.tagsTaller.filter(x => x.tag !== tag);
      this.upsertEnLista(this.tagsFuera, reg);
      m.estado = 'fuera';
      this.tagsEstado[tag] = 'fuera';
    } else {
      this.tagsFuera = this.tagsFuera.filter(x => x.tag !== tag);
      this.upsertEnLista(this.tagsTaller, reg);
      m.estado = 'taller';
      this.tagsEstado[tag] = 'taller';
    }

    m.lastTs = ts;
    m.lastId = idNum;
    if (reg.nombre) m.nombre = reg.nombre;
    m.categoria = 'insumo';
    this.saveState();

    this.sumarAlCarritoSiCorresponde(reg);
  }

  cargarRegistros() {
    if (this.reqInFlight) return;
    this.reqInFlight = true;

    const showSpinner = this.registros.length === 0 && !this.loading;
    if (showSpinner) this.loading = true;
    this.error = undefined;

    this.http.get<Registro[]>(this.API).subscribe({
      next: (rows) => {
        this.registros = rows;

        const latest: Record<string, Registro> = {};
        for (const r of rows) {
          const t = r.tag;
          const ts = this.ts(r);
          const prev = latest[t];
          if (
            !prev ||
            ts > this.ts(prev) ||
            (ts === this.ts(prev) && (Number(r.id) || 0) > (Number(prev.id) || 0))
          ) {
            latest[t] = r;
          }
        }

        for (const r of Object.values(latest)) {
          const ls = this.lastSeen[r.tag];
          const ts = this.ts(r);
          const id = Number(r.id) || 0;
          const isNewer = !ls || ts > ls.ts || (ts === ls.ts && id > ls.id);
          if (isNewer) this.procesarRegistro(r);
        }

        this.loading = false;
        this.reqInFlight = false;
      },
      error: () => {
        this.error = 'No pude cargar los registros';
        this.loading = false;
        this.reqInFlight = false;
      }
    });
  }

  get tagsUnicos(): Registro[] {
    const ult: Record<string, Registro> = {};
    for (const r of this.registros) {
      const t = r.tag;
      const prev = ult[t];
      const ts = this.ts(r);
      if (!prev || ts > this.ts(prev) || (ts === this.ts(prev) && (Number(r.id)||0) > (Number(prev.id)||0))) {
        ult[t] = r;
      }
    }

    for (const [t, m] of Object.entries(this.tagMeta)) {
      if (!ult[t]) {
        ult[t] = {
          id: m.lastId ?? 0,
          tag: t,
          nombre: m.nombre,
          categoria: m.categoria ?? null,
          fecha_hora: m.lastTs ? new Date(m.lastTs).toISOString() : null,
          created_at: null
        };
      } else {
        const r = ult[t];
        if (m.nombre && !r.nombre) r.nombre = m.nombre;
        r.categoria = (this.normCat(r.categoria ?? m.categoria ?? null) || null);
      }
    }

    const lista = Object.values(ult).map(r => this.aplicarMeta(r));
    lista.sort((a, b) => this.ts(b) - this.ts(a) || ((Number(b.id)||0) - (Number(a.id)||0)));
    return lista;
  }

  get tagsTallerSoloInsumo() { return this.tagsTaller.filter(r => this.isInsumo(r.categoria)); }
  get tagsFueraSoloInsumo()  { return this.tagsFuera.filter(r => this.isInsumo(r.categoria)); }

  // Interfaz Visual
  get tagsTallerFiltrados(): Registro[] {
    return this.tagsTaller.filter(r => this.matchQuery(r, this.qVisual));
  }
  get tagsFueraFiltrados(): Registro[] {
    return this.tagsFuera.filter(r => this.matchQuery(r, this.qVisual));
  }

  // Inventario
  get inventarioFiltrado(): Registro[] {
    return this.inventarioItems.filter(r => this.matchQuery(r, this.qInventario));
  }

  // Empleados
  get empleadosFiltrados(): Registro[] {
    return this.empleadosItems.filter(r => this.matchQuery(r, this.qEmpleados));
  }

  limpiarTags() {
    this.tagsTaller = [];
    this.tagsFuera  = [];
    this.tagsEstado = {};
    this.registros  = [];
    this.lastSeen   = {};
    this.tagMeta    = {};
    localStorage.removeItem(this.STORAGE_KEY);
  }

  private saveState() {
    const snapshot = {
      tagsEstado: this.tagsEstado,
      lastSeen: this.lastSeen,
      tagMeta: this.tagMeta,
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snapshot));
  }

  private loadState() {
    const raw = localStorage.getItem(this.STORAGE_KEY);
    if (!raw) return;
    try {
      const s = JSON.parse(raw);
      this.tagsEstado = s.tagsEstado || {};
      this.lastSeen   = s.lastSeen   || {};
      this.tagMeta    = s.tagMeta    || {};

      this.tagsTaller = [];
      this.tagsFuera  = [];
      for (const [tag, meta] of Object.entries(this.tagMeta)) {
        const base: Registro = {
          tag, id: meta.lastId ?? 0,
          nombre: meta.nombre,
          categoria: meta.categoria,
          fecha_hora: meta.lastTs ? new Date(meta.lastTs).toISOString() : null,
          created_at: null
        };
        const r = this.aplicarMeta(base);
        if (!this.isInsumo(r.categoria)) continue; // filtrar solo insumos

        if (meta.estado === 'taller') this.upsertEnLista(this.tagsTaller, r);
        else                          this.upsertEnLista(this.tagsFuera,  r);
      }
    } catch {}
  }

  trackById(index: number, item: any) {
    return item?.id ?? item?.tag ?? index;
  }

  trackByTexto(index: number, item: string) {
    return item;
  }
}
