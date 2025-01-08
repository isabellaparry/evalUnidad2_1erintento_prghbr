import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CitasService } from '../../services/citas.service';
import { DatabaseService } from '../../services/database.service';
import { Cita } from '../../models/cita';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})

export class InicioPage implements OnInit {
  citas: Cita[] = [];
  loaded: boolean = false;

  citaAleatoria: { cita: string; autor: string } | undefined;

  constructor( private dbService: DatabaseService ) {
  }

  ngOnInit() {
    this.dbService.citas$.subscribe((citas) => {
      this.citas = Array.from(citas.values());
  
      if (this.citas.length > 0) {
        const indiceAleatorio = Math.floor(Math.random() * this.citas.length);
        this.citaAleatoria = this.citas[indiceAleatorio];
      }
    });
  }

}
