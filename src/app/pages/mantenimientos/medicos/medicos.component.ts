import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { BusquedasService } from 'src/app/services/busquedas.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public cargando: boolean = true;
  public medicos: Medico[] = [];
  private imgSubs: Subscription;

  constructor( private medicosService: MedicoService,
                private modalImagenService: ModalImagenService,
                private busquedasService: BusquedasService ) { }

  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    //subscripción al observagle del modal de imagenes para que carguen las imagenes
    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(300)
      )
      .subscribe(img => {
        this.cargarMedicos()
      });
  }

  cargarMedicos(){
    this.cargando = true;
    this.medicosService.cargarMedicos()
        .subscribe( medicos => {
          this.cargando = false;
          this.medicos = medicos;
        });
  }

  abrirModal( medico: Medico) {
    this.modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  buscar( termino: string ){

    if ( termino.length === 0 ) {
      return this.cargarMedicos();
    }

    this.busquedasService.buscar( 'medicos', termino )
        .subscribe( resp => {
          this.medicos = resp as Medico[];
        });
  }

  borrarMedico( medico: Medico ){

    Swal.fire({
      title: '¿Borrar médico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {
          this.medicosService.borrarMedico( medico._id )
              .subscribe( resp => {

                this.cargarMedicos();

                Swal.fire(
                  'Usuario borrado', 
                  `${ medico.nombre } fué eliminado correctamente`,
                  'success'
                  ) 

              });
      }
    });

  }

}
