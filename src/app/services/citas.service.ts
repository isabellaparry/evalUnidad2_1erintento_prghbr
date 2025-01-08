import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class CitasService {

  private citas = [
    { cita: 'Mueve la licuadora mami', autor: 'Finn El Humano' },
    { cita: 'Una nena, para el nene', autor: 'Jake El Perro' },
    { cita: 'Ay que la canción', autor: 'Jake El Perro' },
    { cita: 'Tú me creaste!!', autor: 'Limón Agrio' }
  ];

  obtenerCitas() {
    return this.citas;
  }

  obtenerCitaAleatoria() {
    const indice = Math.floor(Math.random() * this.citas.length);
    console.log('CITA ALEATORIA', this.citas[indice]);
    return this.citas[indice];
  }

  agregarCita(cita: string, autor: string) {
    this.citas.push({ cita, autor });
  }

  eliminarCita(indice: number) {
    this.citas.splice(indice, 1);
  }
}
