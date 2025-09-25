import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

type Panol = { id?: number; nombre: string; icono: string };

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {
  private API_BASE = 'http://192.168.111.218:5000/api/v1';
  private PANOLES_URL = `${this.API_BASE}/panoles/`;
  private CSRF_PING_URL = `${this.API_BASE}/auth/csrf/`;

  panoles: Panol[] = [];
  loading = false;
  error?: string;


  formVisible = true;    
  editId?: number;
  form: Panol = { nombre: '', icono: 'cube' };
  saving = false;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    
    this.http.get(this.CSRF_PING_URL, { withCredentials: true }).subscribe({
      next: () => this.cargar(),
      error: () => this.cargar(),
    });
  }

  cargar() {
    this.loading = true; this.error = undefined;
    this.http.get<any>(this.PANOLES_URL, { withCredentials: true }).subscribe({
      next: (res) => {
        this.panoles = Array.isArray(res) ? res : (res?.results ?? []);
        this.loading = false;
      },
      error: () => { this.error = 'No pude cargar los pañoles'; this.loading = false; }
    });
  }

  abrirCrear() {
    this.editId = undefined;
    this.form = { nombre: '', icono: 'cube' };
    this.formVisible = true;
  }

  editar(p: Panol) {
    this.editId = p.id;
    this.form = { ...p };
    this.formVisible = true;
  }

  cancelar() {
    this.editId = undefined;
    this.form = { nombre: '', icono: 'cube' };
  }

  guardar() {
    if (!this.form.nombre?.trim()) { this.error = 'El nombre es requerido'; return; }
    this.saving = true;
    const req = this.editId
      ? this.http.patch<Panol>(`${this.PANOLES_URL}${this.editId}/`, this.form, { withCredentials: true })
      : this.http.post<Panol>(this.PANOLES_URL, this.form, { withCredentials: true });

    req.subscribe({
      next: () => { this.saving = false; this.cancelar(); this.cargar(); },
      error: () => { this.saving = false; this.error = 'No pude guardar el pañol'; }
    });
  }

  eliminar(p: Panol) {
    if (!p.id) return;
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.http.delete(`${this.PANOLES_URL}${p.id}/`, { withCredentials: true }).subscribe({
      next: () => this.cargar(),
      error: () => { this.error = 'No pude eliminar el pañol'; }
    });
  }

  abrirPanol(p: Panol) {
    if (!p.id) return;
    this.router.navigate(['/home', p.id]); 
  }
}
