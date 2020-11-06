import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class FileUploadService {

  constructor() { }


  //Método asincrono promesa
  async actualizarFoto(
    archivo: File,
    tipo: 'usuarios'|'medicos'|'hospitales',
    id: string
  ){

    try {
      const url = `${ base_url }/upload/${ tipo }/${ id }`;

      const formData = new FormData();
      formData.append('imagen', archivo);

      // se espera a que se realice el posteo de la imagen
      const resp = await fetch( url, {
        method: 'PUT',
        headers: {
          'x-token': localStorage.getItem('token') || ''
        },
        body: formData
      });

      // se serializa la respuesta en un json
      const data = await resp.json();
      
      if ( data.ok ) {
        return data.nombreArchivo;
      } else {
        console.log(data.msg);
        return false;
      }
      
      
    } catch (error) {
      console.log(error);
      return false;
      
    }

  }


}
