import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage {
  mostrarToolbarVisual = false;

  opcionesMenu: string[] = [
    'Interfaz Visual',
    'Registros y Movimientos',
    'Reportes',
    'Gestión de Pañol 1',
    'Gestión de Pañol 2',
    'Gestión de Pañol 3'
  ];

  activarInterfazVisual() {
    this.mostrarToolbarVisual = true;
  }

  volverAlMenuCentral() {
    this.mostrarToolbarVisual = false;
  }
}