import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  botones: string[] = ['Opción 1', 'Opción 2'];

  constructor() {}

  agregarBoton() {
    this.botones.push('Nuevo espacio');
  }
}
