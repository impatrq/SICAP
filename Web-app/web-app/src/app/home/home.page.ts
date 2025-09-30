import { AlertController } from '@ionic/angular';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

type Registro = { id: number; tag: string; nombre?: string | null; fecha_hora?: string | null; created_at?: string | null; };

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
    'Invenatario',
    'Empleados',
    'Personalización'
  ];
  

  registros: Registro[] = [];
  loading = false;
  error?: string;
  private sub?: Subscription;

  // 🔹 Endpoint de Django (podés moverlo a environment.apiBase)
  private API = 'http://192.168.111.218:5000/api/v1/register/tag/list/';
  // private API = `${environment.apiBase}/registros/register/tag/list/`;
  private API_EDIT = 'http://192.168.111.218:5000/api/v1/register/tag/';

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
        value: reg.id,
        placeholder: 'Nombre a la persona o al insumo'
      }
    ],
    buttons: [
      { text: 'Cancelar', role: 'cancel' },
      {
        text: 'Guardar',
        handler: (data) => {
          this.editarTag(reg, data.nombre);
        }
      }
    ]
  });
  await alert.present();
}

editarTag(reg: Registro, nuevoNombre: string) {
  this.http.post(`${this.API_EDIT}${reg.id}/editar`, { nombre: nuevoNombre}).subscribe({
    next: (resp) => {
      reg.nombre = nuevoNombre;
      // this.cargarRegistros();
    },
    error: () => {
      alert('No se pudo guardar el cambio');
    }
  });
}

ngOnInit() {}

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  activarSeccion(nombre: string) {
    this.seccionActiva = nombre;

    
    if (nombre === 'Interfaz Visual') {
      this.cargarRegistros();
      if (!this.sub || this.sub.closed) {
        this.sub = interval(3000).subscribe(() => this.cargarRegistros());
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

tagsTaller: Registro[] = [];
tagsFuera: Registro[] = [];
tagsEstado: { [tag: string]: 'taller' | 'fuera' } = {};

procesarRegistro(nuevo: Registro) {
  const tag = nuevo.tag;
  if (!(tag in this.tagsEstado)) {
    // Primera vez: va al taller
    this.tagsTaller.unshift(nuevo);
    this.tagsEstado[tag] = 'taller';
  } else if (this.tagsEstado[tag] === 'taller') {
    // Estaba en taller, va fuera
    this.tagsTaller = this.tagsTaller.filter(t => t.tag !== tag);
    this.tagsFuera.unshift(nuevo);
    this.tagsEstado[tag] = 'fuera';
  } else {
    // Estaba fuera, vuelve al taller
    this.tagsFuera = this.tagsFuera.filter(t => t.tag !== tag);
    this.tagsTaller.unshift(nuevo);
    this.tagsEstado[tag] = 'taller';
  }
}

// Llamá a esto cada vez que llegan nuevos registros:
cargarRegistros() {
  this.loading = true;
  this.error = undefined;
  this.http.get<Registro[]>(this.API).subscribe({
    next: (rows) => {
      this.registros = rows;
      // Solo procesar los nuevos
      rows.forEach(reg => {
        if (
          !this.tagsTaller.some(t => t.id === reg.id) &&
          !this.tagsFuera.some(t => t.id === reg.id)
        ) {
          this.procesarRegistro(reg);
        }
      });
      this.loading = false;
    },
    error: (e) => {
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
}
}
