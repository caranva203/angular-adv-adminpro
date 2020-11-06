import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// ES6 Modules or TypeScript
import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.css' ]
})
export class RegisterComponent implements OnInit {

  public formSubmitted = false;

  public registerForm = this.fb.group({
    nombre: ['Fernando', [ Validators.required, Validators.minLength(3) ]],
    email: ['test100@gmail.com', [ Validators.required, Validators.email ]],
    password: ['12345', Validators.required ],
    password2: ['12345', Validators.required ],
    terminos: [true, Validators.required ]
  }, {
    Validators: this.passwordsIguales('password', 'password2')
  });

  constructor( private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private router: Router ) { }

  ngOnInit(): void {
  }

  crearUsuario(  ){

    this.formSubmitted = true;

    if ( this.registerForm.invalid ) {
      return;
    }else {
      //Realizar el posteo
      this.usuarioService.crearUsuario( this.registerForm.value )
          .subscribe( resp => {

            //Navegar al Dashboard
            this.router.navigateByUrl('/');

          }, (err) => {
            // Si sucede un error
            Swal.fire('Error', err.error.msg, 'error' )
          });
    }
  }

  campoNovalido( campo: string ): boolean{

    if ( this.registerForm.get( campo ).invalid && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }    
  }

  aceptaTerminos(){
    return !this.registerForm.get('terminos').value && this.formSubmitted;
  }

  contrasenasNoValidas(){
    const pass1 = this.registerForm.get('password').value;
    const pass2 = this.registerForm.get('password2').value;

    if ( (pass1 !== pass2 ) && this.formSubmitted ) {
      return true;
    } else {
      return false;
    }
  }

  passwordsIguales( pass1Name: string, pass2Name: string ){

    return ( formGroup: FormGroup ) => {

      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if ( pass1Control.value === pass2Control.value ) {
        pass2Control.setErrors( null );
      } else {
        pass2Control.setErrors({ noEsIgual: true });
      }
    }
  }

}
