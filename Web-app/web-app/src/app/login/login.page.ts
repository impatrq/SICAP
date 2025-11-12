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

  // Marca que la animación inicial (lottie) terminó y muestra el formulario.
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

      // Validación de respuesta del servidor
      if (!response.ok) {
        throw new Error('Error en el servidor');
      }

      const data = await response.json();

      // Resultado del endpoint: si success=true navegamos, sino mostramos alerta.
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

  /**
   * Mostrar una alerta modal básica.
   * @param titulo Texto del encabezado
   * @param mensaje Texto del cuerpo
   */
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
