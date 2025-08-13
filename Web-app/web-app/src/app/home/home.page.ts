import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  botones: string[] = ['Opción 1', 'Opción 2'];

  constructor(private alertController: AlertController) {}

    async agregarBoton() {
    const alert = await this.alertController.create({
      header: 'Nuevo botón',
      inputs: [
        {
          name: 'nombre',
          type: 'text',
          placeholder: 'Nombre del botón'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Agregar',
          handler: (data) => {
            if (data.nombre && data.nombre.trim() !== '') {
              this.botones.push(data.nombre);
            }
          }
        }
      ]
    });

    await alert.present();
  }
}
