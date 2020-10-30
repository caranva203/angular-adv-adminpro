import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  //se obtiene item del index.html con id theme
  private linkTheme =  document.querySelector('#theme');

  constructor() {
    //se obtiene el url del tema en el localstorage, si no hay, se genera el por defecto.
    const url = localStorage.getItem('theme') || './assets/css/colors/default-dark.css';
    //se cambia el valor del atributo href del elemento html con id theme en el index.html.
    this.linkTheme.setAttribute('href', url );
  }

  // Cambiar el tema de la app
  changeTheme( theme: string ){
    
    const url = `./assets/css/colors/${ theme }.css`;
    this.linkTheme.setAttribute('href', url );
    localStorage.setItem('theme', url );

    this.checkCurrentTheme();
  }


  checkCurrentTheme(){
    //lista de elementos html con clase selector.
    const links = document.querySelectorAll('.selector');
    
    links.forEach( elem =>{
      //Se remueve la clase working (select) del elemento 
      elem.classList.remove('working');
      //Se consulta el valor del atributo data-theme del elemento 
      const btnTheme = elem.getAttribute('data-theme');
      //Se concatena el nombre del tema con la url 
      const btnThemeUrl = `./assets/css/colors/${ btnTheme }.css`;
      //Se obtiene la url que se encuentra en el objeto html del index.html
      const currentTheme = this.linkTheme.getAttribute('href');

      if (btnThemeUrl === currentTheme ) {
        //Se añade la clase al elemnto que cumpla la condición
        elem.classList.add('working');
      }
    })
  }
}
