import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {

  animacionTerminada: boolean = false;


  constructor() { }

  onAnimationComplete() {
    this.animacionTerminada = true; 
  }

  ngOnInit() {
  }

}
