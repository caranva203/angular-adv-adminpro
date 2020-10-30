import { sharedStylesheetJitUrl } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  constructor( private rotuer: Router) { }

  ngOnInit(): void {
  }

  login(){
    this.rotuer.navigateByUrl('/');
  }

}
