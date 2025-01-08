import { Cita } from 'src/app/models/cita'

export abstract class CitasRepository {

  abstract init(): Promise<void>
  abstract getCitas(): Promise<Cita[]>
  abstract getCita(id: string): Promise<Cita | undefined>
  abstract addCita(Cita: Cita): Promise<boolean>
  abstract updateCita(Cita: Cita): Promise<boolean>
  abstract deleteCita(id: string): Promise<boolean>
}
