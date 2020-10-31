import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnInit , OnDestroy {

  public titulo: string;

  public tituloSubs$: Subscription;

  constructor( private router: Router ) { 

    this.tituloSubs$ =  this.getArgumentosRuta()
                            .subscribe( data => {
                                        this.titulo = data.titulo;
                                        //genera el titulo en la pestaña de la ventana del navegador.
                                        document.title = `AdminPro - ${ this.titulo }`;
    });
  }
  
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  ngOnInit(): void {
  }

  getArgumentosRuta(){
    // extraer el nombre del título de los breadcrumbs definidos en la data del routing en pages.routing
    return this.router.events
      .pipe(
        filter( event => event instanceof ActivationEnd ),
        filter( (event: ActivationEnd ) => event.snapshot.firstChild === null ),
        map( (event: ActivationEnd ) => event.snapshot.data )
      );
  }

}
