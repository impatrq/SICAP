import { AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { interval, Subscription, firstValueFrom } from 'rxjs';
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
  // Se controla secciones, listas de tags y acciones
  // de CRUD mínimas. Mantener este componente enfocado en comportamiento
  // de UI + llamadas al backend; la lógica de negocio más compleja puede
  // moverse a servicios si crece.
  panolId?: number;
  seccionActiva: string | null = null;

  opcionesMenu: string[] = [
    'Interfaz Visual',
    'Inventario',
    'Empleados',
    'Personalización',
  ];

  registros: Registro[] = [];
  tagsTaller: Registro[] = [];
  tagsFuera: Registro[] = [];
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
  private API_ASSIGN_AUTO =
    'http://192.168.111.218:5000/api/v1/assignments/auto/';

  // Estado solo backend-driven
  private API_BULK_DELETE =
    'http://192.168.111.218:5000/api/v1/register/tag/bulk_delete/';

  private pollingMs = 1000; // Actualiza cada 1 segundo para mayor fluidez
  private reqInFlight = false;
  private visHandler?: () => void;

  private cooldownPersonaTag: string | null = null;
  private cooldownHasta = 0;
  private cooldownMs = 3000;

  currentPersona: { tag: string; nombre?: string | null } | null = null;
  carritoSesion = new Map<
    string,
    { tag: string; nombre?: string | null; lastTs: number }
  >();
  ultimoPingPersonaTs = 0;

  selectMode = false;
  selectedTags = new Set<string>();
  selectAllActive = false;
  purgeLoading = false;

  expanded: Set<string> = new Set();
  asigCache: Record<string, Asignacion[]> = {};
  asigLoading: Record<string, boolean> = {};
  asigError: Record<string, string | undefined> = {};
  // metadata local mínimo (algunas funciones esperan tagMeta en este componente)
  tagMeta: Record<string, any> = {};

  constructor(
    private toast: ToastController,
    private http: HttpClient,
    private alertCtrl: AlertController,
    private route: ActivatedRoute
  ) {
    this.route.paramMap.subscribe((p) => {
      this.panolId = +(p.get('panolId') || 0) || undefined;
    });
  }

  private catKey(cat: string | null | undefined): string {
    return (cat ?? '').toString().trim().toLowerCase();
  }

  // Normaliza y valida la categoría guardada en la DB para uso interno.
  private normCat(cat: string | null | undefined): '' | 'persona' | 'insumo' {
    const k = (cat ?? '').toString().trim().toLowerCase();
    if (k === 'objeto') return 'insumo';
    if (k === 'persona' || k === 'insumo') return k;
    return '';
  }

  private normTxt(s?: string | null): string {
    // Normaliza texto: quita diacríticos, pasa a minúsculas y trim
    return (s ?? '')
      .toString()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .toLowerCase()
      .trim();
  }

  private matchQuery(reg: Registro, q: string): boolean {
    // Comprueba si el registro coincide con la consulta del usuario.
    // Se normaliza texto para ignorar acentos y mayúsculas, y se busca
    // por tokens que coincidan con el inicio de una palabra.
    const qq = this.normTxt(q);
    if (!qq) return true;
    const n = this.normTxt(reg.nombre);
    const t = this.normTxt(reg.tag);
    const tokens = qq.split(/\s+/).filter(Boolean);
    const fields = [n, t];
    return tokens.every((tok) =>
      fields.some((f) => f.split(/\s+/).some((word) => word.startsWith(tok)))
    );
  }

  private fetchActivosCount(personaTag: string): Promise<number> {
    // Consulta rápida para saber cuántas asignaciones activas tiene una persona
    return new Promise((resolve) => {
      this.http
        .get<Asignacion[]>(
          `${this.API_ASSIGN}/?activo=1&persona_tag=${encodeURIComponent(
            personaTag
          )}`
        )
        .subscribe({
          next: (rows) => resolve((rows || []).length),
          error: (_) => resolve(0),
        });
    });
  }

  isPersona(cat: string | null | undefined) {
    // true si la categoría normalizada es 'persona'
    return this.normCat(cat) === 'persona';
  }
  isInsumo(cat: string | null | undefined) {
    // true si la categoría normalizada es 'insumo'
    return this.normCat(cat) === 'insumo';
  }
  isSinCategoria(cat: string | null | undefined) {
    // true si no tiene categoría asignada
    return this.normCat(cat) === '';
  }

  editOpen = false;
  modeloEdicion: {
    id: number | null;
    nombre: string;
    categoria: 'persona' | 'insumo' | '';
  } = {
    id: null,
    nombre: '',
    categoria: '',
  };

  // Estado temporal usado por el modal de edición/confirmación

  friendlyCategoria(cat: string | null | undefined): string {
    // Devuelve una etiqueta legible a partir de la categoría
    const n = this.normCat(cat);
    if (n === 'persona') return 'Persona';
    if (n === 'insumo') return 'Insumo';
    return '—';
  }

  get inventarioItems() {
    // Lista filtrada para la sección Inventario
    return this.tagsUnicos.filter((r) => this.isInsumo(r.categoria));
  }
  get empleadosItems() {
    // Lista filtrada para la sección Empleados
    return this.tagsUnicos.filter((r) => this.isPersona(r.categoria));
  }
  get sinCategoriaItems() {
    // Lista de tags sin categoría asignada
    return this.tagsUnicos.filter((r) => this.isSinCategoria(r.categoria));
  }

  setCategoria(reg: Registro, categoria: 'persona' | 'insumo' | null) {
    // Actualiza la categoría del tag en el backend
    const url = `${this.API_EDIT}/${reg.id}/editar/`;
    this.http.put(url, { categoria }).subscribe({
      next: () => {
        // Actualiza vista según la nueva categoría
        if (categoria === 'persona') this.seccionActiva = 'Empleados';
        if (categoria === 'persona' && this.expanded.has(reg.tag)) {
          this.cargarAsignacionesPersona(reg.tag);
        }
        if (categoria === 'insumo') this.seccionActiva = 'Inventario';
      },
      error: (e) => console.error(e),
    });
  }

  /**
   * Abre un diálogo inline para editar el nombre de un tag.
   * @param reg Registro a editar
   * @param ev Evento del click (opcional)
   */
  async editarNombreInline(reg: Registro, ev?: Event) {
    // Muestra un diálogo para editar el nombre del tag
    ev?.stopPropagation();
    const alert = await this.alertCtrl.create({
      header: 'Editar nombre',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          value: reg.nombre || '',
          placeholder: 'Nombre…',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: ({ nombre }) =>
            this.editarSoloNombre(reg, (nombre ?? '').trim()),
        },
      ],
    });
    await alert.present();
  }

  onAsignarCategoria(reg: Registro, ev: any) {
    const value = (ev?.detail?.value ?? '').toString();
    this.setCategoria(reg, value);
  }

  /**
   * Envía al backend la actualización del nombre del registro.
   * @param reg Registro afectado
   * @param nuevoNombre Nuevo nombre (o null para eliminar)
   */
  private editarSoloNombre(reg: Registro, nuevoNombre: string) {
    // Envía solo el nombre actualizado al backend
    const url = `${this.API_EDIT}/${reg.id}/editar/`;
    this.http.put(url, { nombre: nuevoNombre || null }).subscribe({
      next: () => {
        // Actualización completada; la lista se refresca por polling
      },
      error: (e) => console.error('No se pudo actualizar el nombre', e),
    });
  }

  /**
   * Carga asignaciones activas para una persona y las cachea localmente.
   * @param tag Tag de la persona
   */
  private cargarAsignacionesPersona(tag: string) {
    // Carga y cachea las asignaciones activas para una persona. El
    // caching evita peticiones repetidas al expandir/plegar la vista.
    this.asigLoading[tag] = true;
    this.asigError[tag] = undefined;

    this.http
      .get<Asignacion[]>(
        `${this.API_ASSIGN}/?activo=1&persona_tag=${encodeURIComponent(tag)}`
      )
      .subscribe({
        next: (rows) => {
          this.asigCache[tag] = rows || [];
          this.asigLoading[tag] = false;
        },
        error: (err) => {
          console.error(err);
          this.asigError[tag] = 'No pude cargar asignaciones';
          this.asigLoading[tag] = false;
        },
      });
  }

  toggleAsignados(reg: Registro, ev?: Event) {
    // Expande/contrae la lista de asignaciones de una persona
    ev?.stopPropagation();
    const tag = reg.tag;

    if (this.expanded.has(tag)) {
      this.expanded.delete(tag);
    } else {
      this.expanded.add(tag);
      if (!this.asigCache[tag]) this.cargarAsignacionesPersona(tag);
    }
  }

  /**
   * Marca una asignación como devuelta y actualiza la cache local.
   * @param a Asignación a devolver
   */
  devolverAsignacion(a: Asignacion) {
    // Marca una asignación como devuelta y actualiza la cache local
    this.http
      .put<Asignacion>(`${this.API_ASSIGN}/${a.id}/devolver/`, {})
      .subscribe({
        next: () => {
          const list = this.asigCache[a.persona_tag] || [];
          this.asigCache[a.persona_tag] = list.filter((x) => x.id !== a.id);
          this.cargarRegistros();
        },
        error: (e) => console.error('No se pudo devolver', e),
      });
  }

  private abrirSesionPersona(r: Registro) {
    // Inicia la sesión de persona en la interfaz: limpia el carrito local,
    // selecciona la sección de Empleados y carga las asignaciones activas.
    this.currentPersona = { tag: r.tag, nombre: r.nombre ?? null };
    this.carritoSesion.clear();
    this.seccionActiva = 'Empleados';
    this.expanded.add(r.tag);
    this.cargarAsignacionesPersona(r.tag);
  }

  private async cerrarSesionPersona(): Promise<void> {
    if (!this.currentPersona) return;

    const persona = this.currentPersona;
    const items = Array.from(this.carritoSesion.values()).map((x) => ({
      tag: x.tag,
      nombre: x.nombre ?? null,
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
    const visibles = this.sinCategoriaItems.map((x) => x.tag);
    this.selectedTags = new Set(visibles);
    this.selectAllActive = true;
  }

  private recomputeSelectAllSinCat() {
    const visibles = new Set(this.sinCategoriaItems.map((x) => x.tag));
    let selVisibles = 0;
    for (const t of this.selectedTags) if (visibles.has(t)) selVisibles++;
    this.selectAllActive = visibles.size > 0 && selVisibles === visibles.size;
  }

  private apiEliminarTag(id: number, force = false) {
    const url = `${this.API_EDIT}/${id}/eliminar/${force ? '?force=1' : ''}`;
    return this.http.delete<{ status: string; borrados: number }>(url);
  }

  private saveState(): void {}

  private ok(msg: string): void {
    // Muestra un toast corto para feedback al usuario
    this.toast
      .create({ message: msg, duration: 2000 })
      .then((t) => t.present());
  }

  async confirmarEliminarDesdeModal() {
    if (this.modeloEdicion.id == null) return;

    const nombre = this.modeloEdicion.nombre?.trim();
    // Mostramos un alert solicitando confirmación antes de eliminar.
    // Esto evita borrados accidentales desde la UI.
    const alerta = await this.alertCtrl.create({
      header: 'Eliminar tag',
      message: nombre
        ? `¿Querés eliminar el tag <b>${nombre}</b>?`
        : '¿Querés eliminar este tag?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            const id = this.modeloEdicion.id;
            if (id == null) return;
            this.eliminarTagById(id);
          },
        },
      ],
    });
    await alerta.present();
  }

  /**
   * Prepara y abre el modal de confirmación para eliminar un registro.
   * @param reg Registro que se quiere eliminar
   * @param ev Evento del click (opcional)
   */
  abrirConfirmEliminar(reg: Registro, ev?: Event) {
    // Prepara el modelo de edición y abre el modal de confirmación
    ev?.stopPropagation();
    this.modeloEdicion = {
      id: reg.id,
      nombre: reg.nombre || '',
      categoria: this.normCat(reg.categoria),
    };
    this.confirmarEliminarDesdeModal();
  }

  // Elimina el tag en el backend y limpia referencias locales para que la
  // UI se actualice inmediatamente. Maneja el caso de conflicto (409)
  // devolviendo un diálogo que permite forzar la eliminación.
  /**
   * Elimina un tag por id en el backend. Actualiza la UI local y maneja
   * el caso de conflicto (409) ofreciendo forzar la eliminación.
   * @param id Identificador del tag a eliminar
   */
  async eliminarTagById(id: number) {
    try {
      const res = await firstValueFrom(this.apiEliminarTag(id));

      const drop = (arr: Registro[]) => arr.filter((x) => x.id !== id);
      this.registros = drop(this.registros);
      this.tagsTaller = drop(this.tagsTaller);
      this.tagsFuera = drop(this.tagsFuera);

      const allPrev = [
        ...this.registros,
        ...this.tagsTaller,
        ...this.tagsFuera,
      ];
      const eliminado = allPrev.find((r) => r.id === id);
      if (eliminado?.tag) {
        delete this.tagMeta[eliminado.tag];
        delete this.tagsEstado[eliminado.tag];
        delete this.asigCache[eliminado.tag];
        delete this.asigError[eliminado.tag];
        delete this.asigLoading[eliminado.tag];
        this.expanded.delete(eliminado.tag);
        this.selectedTags.delete(eliminado.tag);
      }

      this.saveState();
      this.editOpen = false;
      this.ok('Tag eliminado');
    } catch (e: any) {
      const msg =
        e?.status === 409
          ? 'No se puede eliminar: hay asignaciones activas'
          : 'No pude eliminar el tag';
      this.ok(msg);

      if (e?.status === 409) {
        const force = await this.alertCtrl.create({
          header: 'Forzar eliminación',
          message:
            'Este tag tiene asignaciones activas. ¿Querés forzar la eliminación?',
          buttons: [
            { text: 'No', role: 'cancel' },
            {
              text: 'Sí, forzar',
              role: 'destructive',
              handler: async () => {
                try {
                  const idForce = this.modeloEdicion.id;
                  if (idForce == null) {
                    this.ok('ID inválido');
                    return;
                  }
                  await firstValueFrom(this.apiEliminarTag(idForce, true));
                  const drop = (arr: Registro[]) =>
                    arr.filter((x) => x.id !== idForce);
                  this.registros = drop(this.registros);
                  this.tagsTaller = drop(this.tagsTaller);
                  this.tagsFuera = drop(this.tagsFuera);
                  this.editOpen = false;
                  this.ok('Tag eliminado (forzado)');
                } catch {
                  this.ok('No pude forzar la eliminación');
                }
              },
            },
          ],
        });
        await force.present();
      }

      console.error(e);
    }
  }

  /**
   * Borra en bloque los tags sin categoría que están seleccionados.
   * Hace una petición bulk_delete y limpia las listas locales.
   */
  borrarSeleccionadosSinCat() {
    if (this.selectedTags.size === 0 || this.purgeLoading) return;

    const toDelete = [...this.selectedTags].filter((t) =>
      this.sinCategoriaItems.some((x) => x.tag === t)
    );
    if (!toDelete.length) return;

    // Borrar en bloque los tags sin categoría seleccionados. Se hace una
    // petición al endpoint bulk_delete y luego se filtran los arrays locales.
    this.purgeLoading = true;

    this.http.post(this.API_BULK_DELETE, { tags: toDelete }).subscribe({
      next: (_res: any) => {
        const kill = new Set(toDelete);

        const filtra = (arr: Registro[]) => arr.filter((x) => !kill.has(x.tag));
        this.registros = filtra(this.registros);
        this.tagsTaller = filtra(this.tagsTaller);
        this.tagsFuera = filtra(this.tagsFuera);

        for (const t of kill) {
          this.selectedTags.delete(t);
        }
        this.recomputeSelectAllSinCat();

        this.purgeLoading = false;
      },
      error: (e) => {
        console.error(e);
        this.purgeLoading = false;
      },
    });
  }

  /**
   * Abre el modal de edición y carga el registro en `modeloEdicion`.
   * @param reg Registro a editar
   * @param ev Evento del click (opcional)
   */
  abrirEdicion(reg: Registro, ev?: Event) {
    // Abre el modal de edición con los datos del registro
    ev?.stopPropagation();
    this.modeloEdicion = {
      id: reg.id,
      nombre: reg.nombre || '',
      categoria: this.normCat(reg.categoria),
    };
    this.editOpen = true;
  }

  /**
   * Guarda los cambios realizados en el modal de edición enviándolos
   * al backend.
   */
  guardarEdicion() {
    if (this.modeloEdicion.id == null) return;

    const id = this.modeloEdicion.id;
    const categoriaPayload =
      this.modeloEdicion.categoria === '' ? null : this.modeloEdicion.categoria;

    const url = `${this.API_EDIT}/${id}/editar/`;
    this.http
      .put(url, {
        nombre: this.modeloEdicion.nombre,
        categoria: categoriaPayload,
      })
      .subscribe({
        next: () => {
          const row = [
            ...this.registros,
            ...this.tagsTaller,
            ...this.tagsFuera,
          ].find((x) => x.id === id);
          const tag = row?.tag;

          if (tag) {
          }

          if (categoriaPayload === 'persona') this.seccionActiva = 'Empleados';
          else if (categoriaPayload === 'insumo')
            this.seccionActiva = 'Inventario';
          else this.seccionActiva = 'Personalización';

          this.editOpen = false;

          const persona = [
            ...this.registros,
            ...this.tagsTaller,
            ...this.tagsFuera,
          ].find((x) => x.id === id);
          if (
            persona &&
            this.isPersona(categoriaPayload) &&
            this.expanded.has(persona.tag)
          ) {
            this.cargarAsignacionesPersona(persona.tag);
          }
        },
        error: (err) => console.error('No se pudo guardar', err),
      });
  }

  ngOnInit() {
    // Inicio: cargamos registros y arrancamos polling cuando corresponda
    // (se evita recargar si ya hay una petición en vuelo)
    this.cargarRegistros();

    this.visHandler = () => {
      if (document.hidden) {
        this.sub?.unsubscribe();
      } else if (this.seccionActiva) {
        this.sub?.unsubscribe();
        this.sub = interval(this.pollingMs).subscribe(() =>
          this.cargarRegistros()
        );
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
      this.sub = interval(this.pollingMs).subscribe(() =>
        this.cargarRegistros()
      );
    }
  }

  volverAlMenuCentral() {
    this.seccionActiva = null;
    this.sub?.unsubscribe();
  }

  // Lógica local eliminada: solo backend-driven

  /**
   * Solicita al backend la lista completa de registros y actualiza el
   * estado local. Evita peticiones concurrentes con `reqInFlight`.
   */
  cargarRegistros() {
    // Carga la lista de registros desde el backend con protección contra
    // peticiones concurrentes (reqInFlight).
    if (this.reqInFlight) return;
    this.reqInFlight = true;

    const showSpinner = this.registros.length === 0 && !this.loading;
    if (showSpinner) this.loading = true;

    this.http.get<Registro[]>(this.API).subscribe({
      next: (rows) => {
        this.registros = rows || [];
        this.loading = false;
        this.reqInFlight = false;

        // Actualiza el estado de los tags (taller/fuera) basado en la lógica backend-driven
        this.actualizarEstadoTags();
      },
      error: (e) => {
        console.error('Error cargando registros', e);
        this.loading = false;
        this.reqInFlight = false;
      },
    });
  }

  get tagsUnicos(): Registro[] {
    return this.registros;
  }

  get tagsTallerFiltrados(): Registro[] {
    return this.tagsUnicos.filter(
      (r: Registro) => this.tagsEstado && this.tagsEstado[r.tag] === 'taller' && this.matchQuery(r, this.qVisual)
    );
  }
  get tagsFueraFiltrados(): Registro[] {
    return this.tagsUnicos.filter(
      (r: Registro) => this.tagsEstado && this.tagsEstado[r.tag] === 'fuera' && this.matchQuery(r, this.qVisual)
    );
  }

  // Alterna el estado cada vez que el tag es detectado (cuando cambia created_at)
  actualizarEstadoTags(): void {
    if (!this.tagsUnicos) return;
    for (const r of this.tagsUnicos) {
      const last = this.tagMeta[r.tag]?.lastCreatedAt;
      if (r.created_at && r.created_at !== last) {
        // Si el tag fue detectado de nuevo, alterna el estado
        this.tagsEstado[r.tag] = this.tagsEstado[r.tag] === 'taller' ? 'fuera' : 'taller';
        this.tagMeta[r.tag] = { lastCreatedAt: r.created_at };
      } else if (!this.tagsEstado[r.tag]) {
        // Si no tiene estado, inicializa en 'taller'
        this.tagsEstado[r.tag] = 'taller';
        this.tagMeta[r.tag] = { lastCreatedAt: r.created_at };
      }
    }
  }

  trackById(index: number, item: Registro): any {
    return item?.id ?? item?.tag ?? index;
  }

  trackByTexto(index: number, item: string): string {
    return item;
  }
}
