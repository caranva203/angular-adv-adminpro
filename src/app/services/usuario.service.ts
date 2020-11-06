import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';

import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;

  constructor( private http: HttpClient,
                private router: Router,
                private  ngZone: NgZone ) { 
    // Se inicializa una sola vez cuando se carga la aplicación              
    this.googleInit();
  }

  googleInit(){
    // siempre se va a ejecutar esta promesa 
    return new Promise( resolve => {

      gapi.load('auth2', () => {
        // Retrieve the singleton for the GoogleAuth library and set up the client.
        this.auth2 = gapi.auth2.init({
          client_id: '629436188514-qaivuc6rcc45gcef279m8ubiahocadsv.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        //se expone una vez se realice el proceso
        resolve();
      });

    })
    
  }

  logout(){
    localStorage.removeItem('token');
 
    this.auth2.signOut().then( () => {
      //Se debe ejecutar por ser libreria de terceros
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
      
    });
  }

  validarToken(): Observable<boolean> {

    const token = localStorage.getItem('token') || '';

    return this.http.get(`${base_url}/login/renew`, {
      //Se envía el token actual en los headers
      headers: {
        'x-token': token 
      }
    }).pipe(
      tap( (resp: any) => {
        // Se lee el token de respuesta y se guarda en el local storage
        localStorage.setItem('token', resp.token)
      }),
      // retorna un true si el observable retorna el token renovado
      map( resp => true),
      //atrapa el error que suceda en el flujo y regresa un nuevo observable con el valor de false
      catchError( error => of(false) )
    );
  }

  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          //guardar el token en el localStorage
          localStorage.setItem('token', resp.token);
        })
      );

  }

  login( formData: LoginForm ){

    return this.http.post(`${ base_url }/login`, formData )
                    .pipe(
                      //Se recibe lo que responda la petición de manera exitosa
                      tap( (resp: any)  => {
                        //guardar el token en el localStorage
                        localStorage.setItem('token', resp.token );
                      })
                    );
    
  }

  loginGoogle( token ){

    return this.http.post(`${ base_url }/login/google`, { token } )
                    .pipe(
                      //Se recibe lo que responda la petición de manera exitosa
                      tap( (resp: any)  => {
                        //guardar el token en el localStorage
                        localStorage.setItem('token', resp.token );
                      })
                    );
    
  }

}
