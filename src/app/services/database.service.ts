import { Injectable } from '@angular/core';
import { CitasRepository } from './citas-repository';
import { CitasSqliteData } from './citas-sqlite-data';
import { Cita } from '../models/cita';
import { decodeTime } from 'ulidx'
import { BehaviorSubject } from 'rxjs'

@Injectable( {
  providedIn: 'root'
} )
export class DatabaseService {

  repository: CitasRepository = new CitasSqliteData()

  constructor() {
    this.cargarCitasDesdeBD().then(() => {
      console.log('Citas cargadas al iniciar el servicio');
    });
  }

  async init(): Promise<void> {
    await this.repository.init()
    // await this.seedCitas()
  }

  private _quotes: Map<string, Cita>                        = new Map()
  private quotesSubject: BehaviorSubject<Map<string, Cita>> = new BehaviorSubject(
    this._quotes )
  citas$                                                    = this.quotesSubject.asObservable()

  async seedCitas(): Promise<void> {
    const id1 = '01J9J7XRM22TYP9CT2WJC0XB8P'
    const id2 = '01J9J7XRMDZ6J9C0FEBN41G5N6'
    await this.repository.deleteCita( id1 )
    await this.repository.deleteCita( id2 )
    await this.repository.addCita( {
      id       : id1,
      cita     : 'Success usually comes to those who are too busy to be looking for it.',
      autor   : 'Henry David Thoreau'
    } )
    await this.repository.addCita( {
      id       : id2,
      cita     : 'We are all like fireworks: we climb, we shine and always go our separate ways and become further apart. But even when that time comes, let’s not disappear like a firework and continue to shine.. forever.',
      autor   : 'Hitsugaya Toshiro'
    } )
    await this.getCitas()
  }

  private async getCitas(): Promise<void> {
    const quotes        = await this.repository.getCitas()
  }

  async addCita( quote: Cita ): Promise<void> {
    await this.repository.addCita( quote )
    this._quotes.set( quote.id, quote )
    this.quotesSubject.next( this._quotes )
  }

  async deleteCita( id: string ): Promise<void> {
    await this.repository.deleteCita( id )
    this._quotes.delete( id )
    this.quotesSubject.next( this._quotes )
  }

  async getCita( id: string ): Promise<Cita | undefined> {
    // return this.repository.getCita( id )
    return this._quotes.get( id )
  }

  async updateCita( quote: Cita ): Promise<void> {
    await this.repository.updateCita( quote )
    this._quotes.set( quote.id, quote )
    this.quotesSubject.next( this._quotes )
  }

  async getAllCitas(): Promise<Cita[]> {
    const citas = await this.repository.getCitas(); // Obtener todas las citas desde SQLite
    return citas;
  }

  async cargarCitasDesdeBD(): Promise<void> {
    const citasGuardadas = await this.repository.getCitas(); // Método para obtener citas desde SQLite
    citasGuardadas.forEach((cita) => {
      this._quotes.set(cita.id, cita);
    });
    this.quotesSubject.next(this._quotes); // Actualiza el flujo
  }
  

}
