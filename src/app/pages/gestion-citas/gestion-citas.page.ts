import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DatabaseService } from '../../services/database.service';
import { Cita } from '../../models/cita';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, CommonModule, FormsModule]
})

export class GestionCitasPage implements OnInit {
  citas: Cita[] = [];
  loaded: boolean = false;
  //nuevaCita = '';
  //nuevoAutor = '';

  constructor(private dbService: DatabaseService) {}

  ngOnInit() {
    // Suscríbete al flujo de citas
    this.dbService.citas$.subscribe((citas) => {
      this.loaded = false; // Indica que la página está cargando
      this.citas = Array.from(citas.values());
      this.loaded = true; // Indica que los datos se han cargado
    });
  }

  ionViewWillEnter() {
    this.dbService.citas$.subscribe((citas) => {
      this.citas = Array.from(citas.values());
    });
  }
  

  nuevaCitaForm = new FormGroup({
    nuevaCita: new FormControl('',[Validators.required, Validators.minLength(5)]),
    nuevoAutor: new FormControl('',[Validators.required, Validators.minLength(2)])
  });

  


  async agregarCita() {
    try {
      if (this.nuevaCitaForm.invalid) {
        console.log('Formulario inválido');
        return;
      }

    const nuevaCita = this.nuevaCitaForm.get('nuevaCita')?.value || '';
    const nuevoAutor = this.nuevaCitaForm.get('nuevoAutor')?.value || '';

    // Genera un ID único
    const idUnico = Date.now().toString();

    const citaAInsertar = { id: idUnico, cita: nuevaCita, autor: nuevoAutor };

    await this.dbService.addCita(citaAInsertar);
    console.log('NUEVA CITA', { cita: nuevaCita, autor: nuevoAutor });

    // Limpiar campos
    this.nuevaCitaForm.reset();

    console.log('CITAS ACTUALES', this.citas);
    } catch (error) {
    console.error('Error al agregar cita:', error);
    }
  }

  async eliminarCita(indice: string) {
    await this.dbService.deleteCita(indice);

    this.dbService.citas$.subscribe( async (citas) => {
      this.loaded = false
      this.citas = Array.from(citas.values())
      this.loaded = true
      })
  }

}
