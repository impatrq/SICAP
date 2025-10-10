import { AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe(p => {
      this.panolId = +(p.get('panolId') || 0) || undefined;
    });
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

  private ts(r: Registro): number {
    const f = r.fecha_hora || r.created_at;
    return f ? new Date(f).getTime() : 0;
  }

  private aplicarMeta(r: Registro): Registro {
    const m = this.tagMeta[r.tag];
    if (!m) return r;
    return {
      ...r,
      nombre: r.nombre ?? m.nombre ?? undefined,
      categoria: r.categoria ?? m.categoria ?? null,
    };
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


  async abrirEdicion(reg: Registro) {
    const alert = await this.alertCtrl.create({
      header: 'Editar Tag',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: reg.nombre,
          placeholder: 'Nombre a la persona o al insumo'
        },
        {
          name: 'categoria',
          type: 'text',
          value: reg.categoria || '',
          placeholder: 'Categoría correspondiente'
        }
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            this.editarTag(reg, data.nombre, data.categoria);
          }
        }
      ],
    });
    await alert.present();
  }

  editarTag(reg: Registro, nuevoNombre: string, nuevaCategoria: string) {
    const tag = reg.tag;

    const m: TagMeta = this.tagMeta[tag] ?? {
      lastTs: this.ts(reg),
      lastId: reg.id,
      estado: this.tagsEstado[tag] ?? 'taller'
    };
    m.nombre    = (nuevoNombre ?? '').trim() || undefined;
    m.categoria = (nuevaCategoria ?? '').trim() || null;
    this.tagMeta[tag] = m;

    const aplicar = (x: Registro) =>
      x.tag === tag ? { ...x, nombre: m.nombre, categoria: m.categoria } : x;

    this.tagsTaller = this.tagsTaller.map(aplicar);
    this.tagsFuera  = this.tagsFuera.map(aplicar);
    this.registros  = this.registros.map(aplicar);

    this.saveState();

    const url = `${this.API_EDIT}/${reg.id}/editar/`;
    this.http.put(url, { nombre: m.nombre, categoria: m.categoria }).subscribe({
      next: () => {},
      error: (err) => { console.error(err); alert('No se pudo guardar el cambio'); }
    });
  }
  
  cambiarCategoria(reg: any, categoria: 'persona'|'objeto') {
  const url = `/api/v1/register/tag/${reg.id}/editar/`; // ajustá al path real
  this.http.put(url, { categoria }).subscribe({
    next: () => reg.categoria = categoria,
    error: err => console.error('No se pudo actualizar categoría', err)
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
