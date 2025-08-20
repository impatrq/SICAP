import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  botones: any[] = [];

  constructor() {}


  agregarBoton() {
    const nuevoNumero = this.botones.length + 1;
    const nuevoBoton = {
      nombre: `Espacio ${nuevoNumero}`
    };
    this.botones.push(nuevoBoton);
    console.log('Se agregó un nuevo botón:', nuevoBoton);
  }

}
