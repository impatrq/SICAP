import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
  standalone: false, 
})
export class MenuPage implements OnInit {
  
  panoles: any[] = [];

  constructor(private navCtrl: NavController) { }

  ngOnInit() {
    
    this.panoles = [
      { id: 1, nombre: 'Pañol de Mecánica' },
      { id: 2, nombre: 'Pañol de Electricidad' },
      { id: 3, nombre: 'Pañol Principal' },
    ];
  }

  
  seleccionarPanol(panol: any) {
    console.log('Pañol seleccionado:', panol);
    
    this.navCtrl.navigateForward('/home');
  }
}