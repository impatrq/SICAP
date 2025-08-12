import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

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

  constructor(private navCtrl: NavController) { }

  onAnimationComplete() {
    this.animacionTerminada = true;
  }

  async login() {
    const response = await fetch('http://127.0.0.1:8000/usuarios_login/v1/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username, password: this.password })
    });
    const data = await response.json();
    if (data.success) {
      this.navCtrl.navigateForward('/home');
    } else {
      alert('Credenciales incorrectas');
    }
  }
}