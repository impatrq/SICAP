import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';

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
      { id: 1, nombre: 'Quilmes' },
      { id: 2, nombre: 'Ezpeleta' },
      { id: 3, nombre: 'Abril Club de Campo' },
    ];
    
  }

  
  seleccionarPanol(panol: any) {
    console.log('Pañol seleccionado:', panol);
    
    this.navCtrl.navigateForward('/home');
  }
}