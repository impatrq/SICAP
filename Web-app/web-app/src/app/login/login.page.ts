import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})

export class LoginPage implements OnInit {

  constructor() { }

  onAnimationComplete() {
    this.animacionTerminada = true; 
  }

  ngOnInit() {}

  async login() {
    const response = await fetch('http://127.0.0.1:8000/usuarios_login/v1/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: this.username, password: this.password })
    });
    const data = await response.json();
    if (data.success) {
      alert('Login correcto');
      // Aquí podés redirigir al home si querés
    } else {
      alert('Credenciales incorrectas');
    }
  }

}
