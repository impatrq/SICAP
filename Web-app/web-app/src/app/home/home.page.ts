import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  botones: string[] = ['Opción 1', 'Opción 2'];

  agregarBoton() {
    this.botones.push('Nuevo espacio');
  }
}