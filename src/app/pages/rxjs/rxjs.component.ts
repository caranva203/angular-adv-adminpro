import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styleUrls: ['./rxjs.component.css']
})
export class RxjsComponent implements OnInit, OnDestroy  {

  public intervalSubs: Subscription;

  constructor() {

    // //suscripción al observador
    // this.retornaObservable().pipe(
    //   //seguir intando el observable 2 vez
    //   retry(2)
    // ).subscribe(
    //   valor => console.log('Subs:', valor ),
    //   ( error ) => console.warn('Error: ', error ),
    //   () => console.info('Obs Terminado')
    // );


    this.intervalSubs = this.retornaIntervalo()
                            .subscribe(
                                ( valor ) => console.log( valor )
                        );
  }

  ngOnDestroy(): void {
    //dejar de suscribirse al observador una vez se destruya el componente.
    this.intervalSubs.unsubscribe();
  }

  retornaIntervalo(): Observable<number> {

    return interval(500)
                        .pipe(
                          //cuantas emisiones del observador se requieren ( 10 )
                          take(100),
                          // Transforma le información del observable o mutarla.
                          map( valor => {
                            return valor + 1; 
                          }),
                          // Filtrar la información del observable ( solo los números pares)
                          filter( valor => ( valor % 2 === 0 ) ? true: false )
                           
                        );

  }


  //función de un observable
  retornaObservable(){

    let i = -1;

    //Creación del observador
    return new Observable<number>( observer => {

      // inicialización de contador
      const intervalo = setInterval( () => {

        i++;
        observer.next(i);

        if (i === 4 ) {
          // limpiar el contador
          clearInterval( intervalo );
          // finalizar el observador
          observer.complete();
        }

        if (i === 2 ) {
          // error en el observador y lo finaliza
          observer.error('i llegó al valor de 2');
        }
        //ejecución cada segundo
      }, 1000 )
    });

  }

  ngOnInit(): void {
  }

}
