import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map, tap, catchError } from 'rxjs/operators';

import { LoginForm } from '../interfaces/login-form.interfaces';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interfaces';


const base_url = environment.base_url;
declare const gapi: any;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
                private router: Router,
                private  ngZone: NgZone ) { 
    // Se inicializa una sola vez cuando se carga la aplicación              
    this.googleInit();
  }

  //instacia de clase para obtener el token del local storage, si es vació retorna un string vacío
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get uid(): string{
    return this.usuario.uid;
  }

  get role(): 'ADMIN_ROLE' | 'USER_ROLE'{
    return this.usuario.role;
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token 
      }
    }
  }

  guardarLocalStorage( token: string, menu: any ){
    // Se lee el token de respuesta y se guarda en el local storage
    localStorage.setItem('token', token);
    // se guarda en el localstorge el menú que el usuario verá en la aplicación 
    localStorage.setItem('menu', JSON.stringify( menu ) );
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
    // Borrar token
    localStorage.removeItem('token');
    // Borrar menu
    localStorage.removeItem('menu');

    this.auth2.signOut().then( () => {
      //Se debe ejecutar por ser libreria de terceros
      this.ngZone.run( () => {
        this.router.navigateByUrl('/login');
      })
      
    });
  }

  validarToken(): Observable<boolean> {

    return this.http.get(`${base_url}/login/renew`, {
      //Se envía el token actual en los headers
      headers: {
        'x-token': this.token 
      }
    }).pipe(
      map( (resp: any) => {
        // se desestructura el objeto en variables 
         const { email , google, nombre, role, img = '', uid } = resp.usuario;

        // se crea una instancia del usuario 
         this.usuario = new Usuario( nombre, email, '', img, google, role, uid );

         this.guardarLocalStorage( resp.token, resp.menu );
         
        return true;
      }),
      //atrapa el error que suceda en el flujo y regresa un nuevo observable con el valor de false
      catchError( error => of(false) )
    );
  }

  crearUsuario(formData: RegisterForm) {

    return this.http.post(`${base_url}/usuarios`, formData)
      .pipe(
        tap((resp: any) => {
          //guardar el token en el localStorage
          this.guardarLocalStorage( resp.token, resp.menu );
        })
      );

  }

  actualizarPerfil( data: { email: string, nombre: string, role: string } ){

    data = {
      ...data,
      role: this.usuario.role
    };

    return this.http.put(`${base_url}/usuarios/${ this.uid }`, data, this.headers );
  }

  login( formData: LoginForm ){

    return this.http.post(`${ base_url }/login`, formData )
                    .pipe(
                      //Se recibe lo que responda la petición de manera exitosa
                      tap( (resp: any)  => {
                        //guardar el token en el localStorage
                        this.guardarLocalStorage( resp.token, resp.menu );
                      })
                    );
    
  }

  loginGoogle( token ){

    return this.http.post(`${ base_url }/login/google`, { token } )
                    .pipe(
                      //Se recibe lo que responda la petición de manera exitosa
                      tap( (resp: any)  => {
                        //guardar el token en el localStorage
                        this.guardarLocalStorage( resp.token, resp.menu );
                      })
                    );
    
  }

  cargarUsuarios( desde: number = 0 ){

    const url = `${base_url}/usuarios?desde=${ desde }`;

    return this.http.get<CargarUsuario>( url, this.headers )
            .pipe(
              map( resp =>{
                const usuarios = resp.usuarios.map( 
                  user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid )
                );

                return {
                  total: resp.total,
                  usuarios
                };
              })
            );

  }

  eliminarUsuario( usuario: Usuario ){

    const url = `${base_url}/usuarios/${ usuario.uid }`;

    return this.http.delete( url, this.headers );

  }

  guardarUsuario( usuario: Usuario ){
    
    return this.http.put(`${base_url}/usuarios/${ usuario.uid }`, usuario, this.headers );
  }

}
