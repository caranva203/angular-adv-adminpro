
import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

declare const gapi: any;

import { UsuarioService } from 'src/app/services/usuario.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [ './login.component.css' ]
})
export class LoginComponent implements OnInit {

  public formSubmitted = false;
  public auth2: any;

  public loginForm = this.fb.group({
    email: [ localStorage.getItem('email') || '' , [ Validators.required, Validators.email ]],
    password: ['', Validators.required ],
    remember: [false]
  });

  constructor( private rotuer: Router, 
                private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private ngZone: NgZone) { }

  ngOnInit(): void {
    //carga el boton de google
    this.renderButton();
  }

  login(){

    this.usuarioService.login( this.loginForm.value )
      .subscribe( resp =>  {

        if ( this.loginForm.get('remember').value ) {
          localStorage.setItem('email', this.loginForm.get('email').value );
        } else {
          localStorage.removeItem('email');
        }

        //Navegar al Dashboard
        this.rotuer.navigateByUrl('/');

      }, ( err ) => {
        // Si sucede un error
        Swal.fire('Error', err.error.msg, 'error' )
      });
  }
    
  renderButton() {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    
    this.startApp();
  }

  async startApp() {
      // Se espera a que la promesa se ejecute se ejecute.
      await this.usuarioService.googleInit();
      this.auth2 = this.usuarioService.auth2;
      
      this.attachSignin(document.getElementById('my-signin2'));

  }

  attachSignin(element) {

    this.auth2.attachClickHandler( element, {},
        (googleUser) => {
          
          const id_token = googleUser.getAuthResponse().id_token;
          this.usuarioService.loginGoogle( id_token )
            .subscribe( resp => {

              this.ngZone.run( () => {
                //Navegar al Dashboard
                this.rotuer.navigateByUrl('/');
              });
            });

        }, (error) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }

}
