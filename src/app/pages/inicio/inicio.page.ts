import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CitasService } from '../../services/citas.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class InicioPage implements OnInit {

  citaAleatoria: { cita: string; autor: string } | undefined;

  constructor(private citasService: CitasService) {
  }

  ngOnInit() {
    this.citaAleatoria = this.citasService.obtenerCitaAleatoria();

  }

}
