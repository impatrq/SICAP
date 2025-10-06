import { AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
// import RegistroTag from '../../../Servidor-sicap_backend/SICAP_Backend/registros/registro_tag.model';

type Registro = { id: number; tag: string; nombre?: string; categoria?: string | null; fecha_hora?: string | null; created_at?: string | null; };

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
  tagsFuera: Registro[] = [];
  tagsEstado: { [tag: string]: 'taller' | 'fuera' } = {};

  loading = false;
  error?: string;
  private sub?: Subscription;

  private STORAGE_KEY = 'sicap_ui_estado';

  private saveState() {
  
  const snapshot = {
    tagsEstado: this.tagsEstado,
    lastSeen: this.lastSeen,
    
    ultimoRegistroPorTag: this.buildUltimoRegistroPorTag(),
  };
  localStorage.setItem(this.STORAGE_KEY, JSON.stringify(snapshot));
  }
  private loadState() {
  const raw = localStorage.getItem(this.STORAGE_KEY);
  if (!raw) return;
  try {
    const s = JSON.parse(raw);
    this.tagsEstado = s.tagsEstado || {};
    this.lastSeen = s.lastSeen || {};
    
    this.tagsTaller = [];
    this.tagsFuera = [];
    const mapa: Record<string, Registro> = s.ultimoRegistroPorTag || {};
    for (const tag of Object.keys(this.tagsEstado)) {
      const reg = mapa[tag];
      if (!reg) continue;
      if (this.tagsEstado[tag] === 'taller') this.tagsTaller.push(reg);
      else this.tagsFuera.push(reg);
    }
  } catch {
    
  }
}

private buildUltimoRegistroPorTag(): Record<string, Registro> {
  const out: Record<string, Registro> = {};
  
  const fuente = [...(this.registros || []), ...this.tagsTaller, ...this.tagsFuera];
  
  fuente.sort((a, b) => this.parseTS(a) - this.parseTS(b));
  for (const r of fuente) out[r.tag] = r;
  return out;
}

  private lastSeen: Record<string, { id: number; ts: number }> = {};

  private parseTS(r: Registro): number {
    return r?.fecha_hora ? new Date(r.fecha_hora).getTime() : 0;
  }

  private esMasNuevo(nuevo: Registro): boolean {
    const ts = this.parseTS(nuevo);
    const prev = this.lastSeen[nuevo.tag];
    if (!prev) return true;
    if (ts && ts !== prev.ts) return ts > prev.ts;
    if (typeof nuevo.id === 'number' && typeof prev.id === 'number') {
      return nuevo.id > prev.id;
    }
    return false;
  }

  private marcarVisto(r: Registro) {
    this.lastSeen[r.tag] = { id: Number(r.id) || 0, ts: this.parseTS(r) };
  }


  // 🔹 Endpoint de Django (podés moverlo a environment.apiBase)
  private API = 'http://192.168.111.218:5000/api/v1/register/tag/list/';
  // private API = `${environment.apiBase}/registros/register/tag/list/`;
  private API_EDIT = 'http://192.168.111.218:5000/api/v1/register/tag';

constructor(private http: HttpClient, private alertCtrl: AlertController, private route: ActivatedRoute) {
  this.route.paramMap.subscribe(p => {
    this.panolId = +(p.get('panolId') || 0) || undefined;
  });
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
        value: reg.categoria,
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
  const url = `${this.API_EDIT}/${reg.id}/editar/`;            
  
  this.http.put(url, { 
    nombre: nuevoNombre,
    categoria: nuevaCategoria    
  }).subscribe({
    next: () => { 
      reg.nombre = nuevoNombre; 
      reg.categoria = nuevaCategoria;
    },
    error: (err) => { console.error(err); alert('No se pudo guardar el cambio'); }
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
        this.sub = interval(500).subscribe(() => this.cargarRegistros());
      }
    } else {
      // Si cambiás de sección, detené el intervalo
      this.sub?.unsubscribe();
    }
  }

  volverAlMenuCentral() {
    this.seccionActiva = null;
    this.sub?.unsubscribe();
  }



procesarRegistro(nuevo: Registro) {
    if (!this.esMasNuevo(nuevo)) return;

    const tag = nuevo.tag;
    if (!(tag in this.tagsEstado)) {
      this.tagsTaller = [nuevo, ...this.tagsTaller.filter(t => t.tag !== tag)];
      this.tagsEstado[tag] = 'taller';
    } else if (this.tagsEstado[tag] === 'taller') {
      this.tagsTaller = this.tagsTaller.filter(t => t.tag !== tag);
      this.tagsFuera = [nuevo, ...this.tagsFuera.filter(t => t.tag !== tag)];
      this.tagsEstado[tag] = 'fuera';
    } else {
      this.tagsFuera = this.tagsFuera.filter(t => t.tag !== tag);
      this.tagsTaller = [nuevo, ...this.tagsTaller.filter(t => t.tag !== tag)];
      this.tagsEstado[tag] = 'taller';
    }

    this.marcarVisto(nuevo);
    this.saveState();
  }

// Llamá a esto cada vez que llegan nuevos registros:
cargarRegistros() {
    this.loading = true;
    this.error = undefined;
    this.http.get<Registro[]>(this.API).subscribe({
      next: (rows) => {
        this.registros = rows;
        const ordenados = [...rows].sort((a, b) => this.parseTS(a) - this.parseTS(b));
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
  const vistos = new Set<string>();
  const unicos: Registro[] = [];
  // Recorre de atrás para adelante para que el más reciente quede primero
  for (let i = this.registros.length - 1; i >= 0; i--) {
    const reg = this.registros[i];
    if (!vistos.has(reg.tag)) {
      vistos.add(reg.tag);
      unicos.unshift(reg);
    }
  }
  return unicos;
}
limpiarTags() {
  this.tagsTaller = [];
  this.tagsFuera = [];
  this.tagsEstado = {};
  this.registros = [];
  this.lastSeen = {};
  localStorage.removeItem(this.STORAGE_KEY);
}
trackById(index: number, item: any) {
  return item?.id ?? item?.tag ?? index;
}

trackByTexto(index: number, item: string) {
  return item;
}
}
