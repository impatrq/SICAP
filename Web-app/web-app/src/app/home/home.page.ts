import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { interval, Subscription } from 'rxjs';
// import { environment } from '../../environments/environment'; // ← si usás env

type Registro = { id: number; tag: string; created_at: string };

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit, OnDestroy {
  mostrarToolbarVisual = false;

  opcionesMenu: string[] = [
    'Interfaz Visual',
    'Registros y Movimientos',
    'Reportes',
    'Gestión de Pañol 1',
    'Gestión de Pañol 2',
    'Gestión de Pañol 3'
  ];

  registros: Registro[] = [];
  loading = false;
  error?: string;
  private sub?: Subscription;

  // 🔹 Endpoint de Django (podés moverlo a environment.apiBase)
  private API = 'http://192.168.111.218:5000/api/v1/register/tag/list/';
  // private API = `${environment.apiBase}/registros/register/tag/list/`;

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  activarInterfazVisual() {
    this.mostrarToolbarVisual = true;
    this.cargarRegistros();

    // Evitar múltiples intervalos
    if (!this.sub || this.sub.closed) {
      this.sub = interval(3000).subscribe(() => this.cargarRegistros());
    }
  }

  volverAlMenuCentral() {
    this.mostrarToolbarVisual = false;
    this.sub?.unsubscribe();
  }

  cargarRegistros() {
    this.loading = true;
    this.error = undefined; // ← limpia error previo

    this.http.get<Registro[]>(this.API).subscribe({
      next: (rows) => {
        this.registros = rows;
        this.loading = false;
      },
      error: (e) => {
        this.error = 'No pude cargar los registros';
        this.loading = false;
        // console.error(e);
      }
    });
  }
}
