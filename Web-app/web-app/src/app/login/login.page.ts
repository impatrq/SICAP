import { Component } from '@angular/core';

import {
  NavController,
  AlertController,
  LoadingController,
} from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {
  animacionTerminada: boolean = false;
  username = '';
  password = '';

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController
  ) {}

  onAnimationComplete() {
    this.animacionTerminada = true;
  }

  async login() {
    const loading = await this.loadingCtrl.create({
      message: 'Verificando...',
    });
    await loading.present();

    try {
      const response = await fetch(
        'http://192.168.111.218:5000/usuarios/login/',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: this.username,
            password: this.password,
          }),
        }
      );

      await loading.dismiss();

      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();

      if (data.success) {
        this.navCtrl.navigateForward('/menu');
      } else {
        this.mostrarAlerta(
          'Error de Login',
          data.message || 'Credenciales incorrectas.'
        );
      }
    } catch (error) {
      await loading.dismiss();
      this.mostrarAlerta(
        'Error de Conexión',
        'No se pudo conectar con el servidor. Por favor, intente más tarde.'
      );
    }
  }

  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
