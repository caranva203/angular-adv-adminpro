import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Hospital } from '../models/hospital.model';
import { Medico } from '../models/medico.model';
import { Usuario } from '../models/usuario.model';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BusquedasService {

  constructor( private http: HttpClient ) { }

  //instacia de clase para obtener el token del local storage, si es vació retorna un string vacío
  get token(): string {
    return localStorage.getItem('token') || '';
  }

  get headers(){
    return {
      headers: {
        'x-token': this.token 
      }
    }
  }

  private trasnformarUsuarios( resultados: any[] ): Usuario[] {
    
    return resultados.map(
      user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid )
    );
  }

  private trasnformarHospitales( resultados: any[] ): Hospital[] {
    
    return resultados;
  }

  private trasnformarMedicos( resultados: any[] ): Medico[] {
    
    return resultados;
  }

  busquedaGlobal( termino: string ){
    const url = `${ base_url }/todo/${ termino }`;
    return this.http.get( url, this.headers );
  }

  buscar( tipo: 'usuarios'|'medicos'|'hospitales', termino: string ){

    const url = `${ base_url }/todo/coleccion/${ tipo }/${ termino }`;
    return this.http.get<any[]>( url, this.headers )
            .pipe(
              map( (resp: any) => {
                switch ( tipo ) {
                  case 'usuarios':
                      return this.trasnformarUsuarios( resp.resultados );
                  case 'hospitales':
                      return this.trasnformarHospitales( resp.resultados );
                  case 'medicos':
                      return this.trasnformarMedicos( resp.resultados );
                  default:
                    return [];
                }
              })
            );


  }


}
