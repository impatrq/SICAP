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
  private sub?: Subscription;

  private API = 'http://192.168.111.218:5000/api/v1/register/tag/list/';
  private API_EDIT = 'http://192.168.111.218:5000/api/v1/register/tag';

  private tagMeta: Record<string, TagMeta> = {};
  private lastSeen: Record<string, { id: number; ts: number }> = {};
  private STORAGE_KEY = 'sicap_ui_estado';
  
  private catKey(cat: string | null | undefined): string {
  return (cat ?? '').toString().trim().toLowerCase();
  }

  private normCat(cat: string | null | undefined): ''|'persona'|'insumo' {
    const k = (cat ?? '').toString().trim().toLowerCase();
    if (k === 'objeto') return 'insumo';
    if (k === 'persona' || k === 'insumo') return k;
    return '';
  }


  isPersona(cat: string | null | undefined)      { return this.normCat(cat) === 'persona'; }
  isInsumo(cat: string | null | undefined)       { return this.normCat(cat) === 'insumo'; }
  isSinCategoria(cat: string | null | undefined) { return this.normCat(cat) === ''; }

  editOpen = false;
  modeloEdicion: { id: number|null; nombre: string; categoria: 'persona'|'insumo'|'' } = {
    id: null, nombre: '', categoria: ''
  };

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
          tag,
          id: meta.lastId ?? 0,
          nombre: meta.nombre,
          categoria: meta.categoria,
          fecha_hora: meta.lastTs ? new Date(meta.lastTs).toISOString() : null,
          created_at: null
        };
        const r = this.aplicarMeta(base);
        if (meta.estado === 'taller') this.upsertEnLista(this.tagsTaller, r);
        else                          this.upsertEnLista(this.tagsFuera,  r);
      }
    } catch {
      
    }
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

  private esMasNuevo(nuevo: Registro): boolean {
    const ts = this.ts(nuevo);
    const prev = this.lastSeen[nuevo.tag];
    if (!prev) return true;
    if (ts && ts !== prev.ts) return ts > prev.ts;
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
    },
    error: (err) => console.error('No se pudo guardar', err)
  });
}

  ngOnInit() {
    this.loadState(); 
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  activarSeccion(nombre: string) {
    this.seccionActiva = nombre;

    if (nombre === 'Interfaz Visual') {
      this.cargarRegistros();
      if (!this.sub || this.sub.closed) {
        this.sub = interval(1000).subscribe(() => this.cargarRegistros()); 
      }
    } else {
      this.sub?.unsubscribe();
    }
  }

  volverAlMenuCentral() {
    this.seccionActiva = null;
    this.sub?.unsubscribe();
  }

  procesarRegistro(nuevo: Registro) {
    if (!this.esMasNuevo(nuevo)) return;

    const reg = this.aplicarMeta(nuevo);
    const tag = reg.tag;
    const ts  = this.ts(reg);

    if (!this.tagMeta[tag]) {
      this.tagMeta[tag] = { lastTs: ts, lastId: reg.id, estado: 'taller' };
      this.tagsTaller = this.tagsTaller.filter(x => x.tag !== tag);
      this.upsertEnLista(this.tagsTaller, reg);
      this.tagsEstado[tag] = 'taller';
      this.marcarVisto(reg);
      this.saveState();
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
    m.lastId = reg.id;
    if (reg.nombre)    m.nombre = reg.nombre;
    if (reg.categoria) m.categoria = reg.categoria;

    this.marcarVisto(reg);
    this.saveState();
  }

  
  cargarRegistros() {
    this.loading = true;
    this.error = undefined;
    this.http.get<Registro[]>(this.API).subscribe({
      next: (rows) => {
        this.registros = rows;

        
        const ordenados = [...rows].sort((a, b) => this.ts(a) - this.ts(b));

        for (const reg of ordenados) {
          if (this.esMasNuevo(reg)) this.procesarRegistro(reg);
        }
        this.loading = false;
      },
      error: () => {
        this.error = 'No pude cargar los registros';
        this.loading = false;
      }
    });
  }

  get tagsUnicos(): Registro[] {
    const ultimos: Record<string, Registro> = {};
    for (const r of this.registros) {
      const prev = ultimos[r.tag];
      if (!prev) ultimos[r.tag] = r;
      else {
        const t1 = this.ts(prev), t2 = this.ts(r);
        if (t2 > t1 || (t2 === t1 && (r.id > prev.id))) ultimos[r.tag] = r;
      }
    }
    const lista = Object.values(ultimos).map(r => this.aplicarMeta(r));
    lista.sort((a, b) => this.ts(b) - this.ts(a) || (b.id - a.id));
    return lista;
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

  trackById(index: number, item: any) {
    return item?.id ?? item?.tag ?? index;
  }

  trackByTexto(index: number, item: string) {
    return item;
  }
}
