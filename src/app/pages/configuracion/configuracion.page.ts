import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Preferences } from '@capacitor/preferences';

export interface Configuracion {
  eliminarCitasInicio: boolean
}

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class ConfiguracionPage implements OnInit {

  private defaultConfig: Configuracion = {
    eliminarCitasInicio: false
  }

  config: Configuracion = this.defaultConfig;

  constructor() { }

  async ngOnInit() {
    const configStr: string | null = (
      await Preferences.get({ key: 'configuracion' })
    ).value;

    this.config = configStr !== null ? JSON.parse(configStr) : this.defaultConfig;
  }

  async onChange() {
    await Preferences.set({
      key: 'configuracion',
      value: JSON.stringify(this.config),
    });
  }

}
