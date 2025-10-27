import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

type Panol = { id?: number; nombre: string; icono?: string };

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false,
})
export class MenuPage implements OnInit {

  private API_BASE = environment.API_BASE;
  private PANOLES_URL = `${this.API_BASE}panoles/`;
  private CSRF_PING_URL = `${this.API_BASE}auth/csrf/`;

  panoles: Panol[] = [];
  loading = false;
  error?: string;

  creating = false;
  nombreNuevo = '';
  saving = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private alert: AlertController,
    private toast: ToastController
  ) {}

  ngOnInit() {
    // Cookie CSRF y luego cargar pañoles
    this.http.get(this.CSRF_PING_URL, { withCredentials: true }).subscribe({
      next: () => this.cargar(),
      error: () => this.cargar(),
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
          this.panoles.unshift(p);
          this.msg('Creado');
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

  async abrirRenombrar(p: Panol, ev?: Event) {
    ev?.stopPropagation(); // no abrir el pañol al clickear el lápiz
    const alert = await this.alert.create({
      header: 'Renombrar pañol',
      inputs: [{ name: 'nombre', type: 'text', value: p.nombre, placeholder: 'Nuevo nombre' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: (data) => {
            const nuevo = (data?.nombre ?? '').trim();
            if (!p.id || !nuevo || nuevo === p.nombre) return;
            this.http.patch<Panol>(
              `${this.PANOLES_URL}${p.id}/`,
              { nombre: nuevo },
              { withCredentials: true }
            ).subscribe({
              next: (upd) => {
                const i = this.panoles.findIndex(x => x.id === p.id);
                if (i >= 0) this.panoles[i] = { ...this.panoles[i], ...upd };
                this.msg('Nombre actualizado');
              },
              error: (e) => {
                const detail = e?.error?.detail ? `: ${e.error.detail}` : '';
                this.msg('No pude renombrar' + detail);
              }
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async confirmarEliminar(p: Panol, ev?: Event) {
    ev?.stopPropagation();
    const alert = await this.alert.create({
      header: 'Eliminar pañol',
      message: `¿Eliminar “${p.nombre}”? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => this.eliminar(p)
        }
      ]
    });
    await alert.present();
  }

  private eliminar(p: Panol) {
    if (!p.id) return;
    this.http.delete(
      `${this.PANOLES_URL}${p.id}/`,
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.panoles = this.panoles.filter(x => x.id !== p.id);
        this.msg('Pañol eliminado');
        // si estabas dentro de ese pañol, salí
        if (this.router.url.includes(`/home/${p.id}`)) {
          this.router.navigate(['/home']);
        }
      },
      error: (e) => {
        const detail = e?.error?.detail ? `: ${e.error.detail}` : '';
        this.msg('No se pudo eliminar' + detail);
      }
    });
  }

  private async msg(text: string) {
    const t = await this.toast.create({ message: text, duration: 1500 });
    await t.present();
  }
}
