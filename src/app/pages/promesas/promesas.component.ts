import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styleUrls: ['./promesas.component.css']
})
export class PromesasComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    // //creación de la promesa
    // const promesa = new Promise( ( resolve, reject ) => {

    //   if ( false ) {
    //     resolve('Hola Mundo')
    //   } else {
    //     reject('Algo salió mal');
    //   }
      
    // });

    // //escuchar la promesa
    // promesa
    // .then( ( mensaje ) => {
    //   console.log( mensaje );
    // })
    // .catch( error => console.log( 'Error en mi promesa', error));

    // console.log('Fin del init');

    this.getUsuarios().then( usuarios => {
      console.log( usuarios );
    });

  }

  getUsuarios(){

    return  new Promise( resolve => {
      fetch('https://reqres.in/api/users')
      .then( resp => resp.json() )
      .then( body => resolve( body.data ));
    });    

  }

}
