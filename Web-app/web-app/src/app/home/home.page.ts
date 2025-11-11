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

  // Estado solo backend-driven
   private API_BULK_DELETE = 'http://192.168.111.218:5000/api/v1/register/tag/bulk_delete/';

  private pollingMs = 2000;
  private reqInFlight = false;
  private visHandler?: () => void;

  private cooldownPersonaTag: string | null = null;
  private cooldownHasta = 0;
  private cooldownMs = 3000; 

  currentPersona: { tag: string; nombre?: string|null } | null = null;
  carritoSesion = new Map<string, { tag: string; nombre?: string|null; lastTs: number }>();
  ultimoPingPersonaTs = 0;

  selectMode = false;
  selectedTags = new Set<string>();   
  selectAllActive = false;
  purgeLoading = false;

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

  // Eliminado: lógica local de tagMeta

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

  // Eliminado: lógica local de tagMeta
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
        this.cargarRegistros();
      },
      error: e => console.error('No se pudo devolver', e),
    });
  }

  private abrirSesionPersona(r: Registro) {
  this.currentPersona = { tag: r.tag, nombre: r.nombre ?? null };
  this.carritoSesion.clear();
  this.seccionActiva = 'Empleados';
  this.expanded.add(r.tag);
  this.cargarAsignacionesPersona(r.tag);
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
        // Lógica backend-driven: mantener sesión abierta si hay activos
        return;
      }
      this.currentPersona = null;
      this.carritoSesion.clear();
      this.cooldownPersonaTag = persona.tag;
      this.cooldownHasta = Date.now() + this.cooldownMs;
      return;
    }
    // Lógica backend-driven: aquí puedes agregar lógica para cerrar sesión y limpiar
  }

  // Métodos de almacenamiento local eliminados. Solo lógica backend-driven.

  toggleSelectTag(tag: string) {
    if (this.selectedTags.has(tag)) this.selectedTags.delete(tag);
    else this.selectedTags.add(tag);
    this.recomputeSelectAllSinCat();
  }

  toggleSelectAllSinCat() {
    if (this.selectAllActive) {
      this.selectedTags.clear();
      this.selectAllActive = false;
      return;
    }
    const visibles = this.sinCategoriaItems.map(x => x.tag);
    this.selectedTags = new Set(visibles);
    this.selectAllActive = true;
  }

  private recomputeSelectAllSinCat() {
    const visibles = new Set(this.sinCategoriaItems.map(x => x.tag));
    let selVisibles = 0;
    for (const t of this.selectedTags) if (visibles.has(t)) selVisibles++;
    this.selectAllActive = visibles.size > 0 && selVisibles === visibles.size;
  }

  borrarSeleccionadosSinCat() {
    if (this.selectedTags.size === 0 || this.purgeLoading) return;

    const toDelete = [...this.selectedTags].filter(t =>
      this.sinCategoriaItems.some(x => x.tag === t)
    );
    if (!toDelete.length) return;

    this.purgeLoading = true;

    this.http.post(this.API_BULK_DELETE, { tags: toDelete }).subscribe({
      next: (_res: any) => {
        const kill = new Set(toDelete);

        const filtra = (arr: Registro[]) => arr.filter(x => !kill.has(x.tag));
        this.registros  = filtra(this.registros);
        this.tagsTaller = filtra(this.tagsTaller);
        this.tagsFuera  = filtra(this.tagsFuera);

        for (const t of kill) {
          this.selectedTags.delete(t);
        }
        this.recomputeSelectAllSinCat();

        this.purgeLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.purgeLoading = false;
      }
    });
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
  // Eliminado: lógica local de loadState
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

  // Lógica local eliminada: solo backend-driven

  cargarRegistros() {
    if (this.reqInFlight) return;
    this.reqInFlight = true;

    const showSpinner = this.registros.length === 0 && !this.loading;
    if (showSpinner) this.loading = true;
    this.error = undefined;

    this.http.get<Registro[]>(this.API).subscribe({
      next: (rows) => {
        this.registros = rows;
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
    return this.registros;
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
    this.registros  = [];
  }

  // saveState y loadState eliminados: ya no hay almacenamiento local

  trackById(index: number, item: any) {
    return item?.id ?? item?.tag ?? index;
  }

  trackByTexto(index: number, item: string) {
    return item;
  }
}
