import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { delay } from 'rxjs/operators';
import { Hospital } from 'src/app/models/hospital.model';
import { Medico } from 'src/app/models/medico.model';
import { HospitalService } from 'src/app/services/hospital.service';
import { MedicoService } from 'src/app/services/medico.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [
  ]
})
export class MedicoComponent implements OnInit {

  public medicoFrom: FormGroup;
  public hospitales: Hospital[] = [];

  public medicoSeleccionado: Medico;
  public hospitalSeleccionado: Hospital;

  constructor( private fb: FormBuilder, 
                private hospitalService: HospitalService,
                private medicoService: MedicoService, 
                private router: Router, 
                private activatedRoute: ActivatedRoute ) { }

  ngOnInit(): void {

    this.activatedRoute.params.subscribe( params =>{
      this.cargarMedico( params.id );
    });

    this.medicoService.obtenerMedicoPorId

    this.medicoFrom = this.fb.group({
      nombre: ['', Validators.required ],
      hospital: ['', Validators.required ]
    });

    this.cargarHospitales();

    // Se suscribe al observable del cambio de valor del select
    this.medicoFrom.get('hospital').valueChanges
        .subscribe( hospitalId => {
          this.hospitalSeleccionado = this.hospitales.find( h => h._id === hospitalId );
        });
  }

  cargarMedico( id: string ){

    if (id === 'nuevo') {
      return;
    }

    this.medicoService.obtenerMedicoPorId( id )
        .pipe(
          delay(200)
        )
        .subscribe( medico => {

          if ( !medico ) {
            this.router.navigateByUrl(`/dashboard/medicos`);
          }

          const { nombre, hospital: { _id } } = medico;
          this.medicoSeleccionado = medico;
          this.medicoFrom.setValue({ nombre, hospital: _id });
        });
  }

  cargarHospitales(){
    this.hospitalService.cargarHospitales()
        .subscribe( (hospitales: Hospital[]) => {
          this.hospitales = hospitales;
        });
    
  }

  guardarMedico() {

    const { nombre } = this.medicoFrom.value;

    if (this.medicoSeleccionado) {

      const data = {
        ...this.medicoFrom.value,
        _id: this.medicoSeleccionado._id
      }

      this.medicoService.actualizarMedico( data )
          .subscribe( resp => {
            Swal.fire('Actualizado', `${ nombre } actualizado correctamente`, 'success');
          })

    } else {

      this.medicoService.crearMedico(this.medicoFrom.value)
        .subscribe((resp: any) => {
          Swal.fire('Creado', `${nombre} creado correctamente`, 'success');
          this.router.navigateByUrl(`/dashboard/medico/${resp.medico._id}`);
        });

    }


  }

}
