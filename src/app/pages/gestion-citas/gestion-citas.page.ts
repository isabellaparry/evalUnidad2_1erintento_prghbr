import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CitasService } from '../../services/citas.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-gestion-citas',
  templateUrl: './gestion-citas.page.html',
  styleUrls: ['./gestion-citas.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, CommonModule, FormsModule]
})

export class GestionCitasPage implements OnInit {
  citas: { id: number; cita: string; autor: string }[] = [];
  //nuevaCita = '';
  //nuevoAutor = '';

  constructor(private dbService: DatabaseService) {}

  async ngOnInit() {
    try {
      // Inicializa la base de datos
      await this.dbService.iniciarPlugin();
      console.log('Base de datos inicializada correctamente.');
  
      // Carga las citas iniciales
      this.citas = await this.dbService.obtenerCitas();
      console.log('Citas cargadas:', this.citas);
    } catch (error) {
      console.error('Error al inicializar la base de datos GESTION CITAS PAGE:', error);
    }
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

    await this.dbService.agregarCita(nuevaCita, nuevoAutor);
    console.log('NUEVA CITA', { cita: nuevaCita, autor: nuevoAutor });
    this.citas = await this.dbService.obtenerCitas();

    // Limpiar campos
    this.nuevaCitaForm.reset();

    console.log('CITAS ACTUALES', this.citas);
    } catch (error) {
      console.error('Error al agregar cita:', error);
    }
  }

  async eliminarCita(indice: number) {
    await this.dbService.eliminarCita(indice);
    this.citas = await this.dbService.obtenerCitas();
  }

}
