import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

type Panol = { id?: number; nombre: string; icono?: string };

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  
  private API_BASE = environment.API_BASE;
  private PANOLES_URL = `${this.API_BASE}/panoles/`;
  private CSRF_PING_URL = `${this.API_BASE}/auth/csrf/`;

  panoles: Panol[] = [];
  loading = false;
  error?: string;

  creating = false;
  nombreNuevo = '';
  saving = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    // 1) Plantar cookie CSRF y luego cargar pañoles
    this.http.get(this.CSRF_PING_URL, { withCredentials: true }).subscribe({
      next: () => this.cargar(),
      error: () => this.cargar(), // aunque falle, intento cargar
    });
  }

  cargar() {
    this.loading = true;
    this.error = undefined;

    this.http.get<any>(this.PANOLES_URL, { withCredentials: true }).subscribe({
      next: (res) => {
        this.panoles = Array.isArray(res) ? res : (res?.results ?? []);
        this.loading = false;
      },
      error: () => {
        this.error = 'No pude cargar los pañoles';
        this.loading = false;
      },
    });
  }

  abrirCrear() {
    this.nombreNuevo = '';
    this.creating = true;
  }

  cancelarCrear() {
    this.creating = false;
    this.nombreNuevo = '';
  }

  crear() {
    const nombre = this.nombreNuevo.trim();
    if (!nombre) return;

    this.saving = true;

    this.http
      .post<Panol>(
        this.PANOLES_URL,
        { nombre, icono: 'cube' },
        { withCredentials: true }
      )
      .subscribe({
        next: (p) => {
          this.saving = false;
          this.creating = false;
          this.nombreNuevo = '';
          // lo muestro al toque
          this.panoles.unshift(p);
        },
        error: () => {
          this.saving = false;
          this.error = 'No pude crear el pañol';
        },
      });
  }

  abrirPanol(p: Panol) {
    if (!p.id) return;
    this.router.navigate(['/home', p.id]);
  }
}
