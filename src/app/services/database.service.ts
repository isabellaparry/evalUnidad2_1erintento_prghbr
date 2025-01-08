import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { CapacitorSQLite, SQLiteDBConnection, SQLiteConnection } from '@capacitor-community/sqlite';

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
  private sqlite: SQLiteConnection = new SQLiteConnection(CapacitorSQLite);
  private db!: SQLiteDBConnection;

  constructor() { }

  async iniciarPlugin(): Promise<void> {
    try {
      // Verifica si estás en la plataforma web
      if (Capacitor.getPlatform() === 'web') {
        const jeepSqliteEl = document.querySelector('jeep-sqlite');
        if (!jeepSqliteEl) {
          throw new Error('El componente jeep-sqlite no está presente en el DOM.');
        }

        // Inicializa el almacenamiento para la web
        await CapacitorSQLite.initWebStore();
      }

      if (!this.db) {
        this.db = await this.sqlite.createConnection(
          'citassql',
          false,
          'no-encryption',
          1,
          false
        );
        await this.db.open();

        const schema = `
          CREATE TABLE IF NOT EXISTS citas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cita TEXT NOT NULL,
            autor TEXT NOT NULL
          );
        `;
        await this.db.execute(schema);
        console.log('Base de datos inicializada correctamente.');
      }
    } catch (error) {
      console.error('Error al inicializar la base de datos:', error);
      throw error;
    }
  }

  // CRUD - Create, Read, Update, Delete

  async agregarCita(cita: string, autor: string) {
    const query = `INSERT INTO citas (cita, autor) VALUES (?, ?)`;
    await this.db.run(query, [cita, autor]);
  }

  async obtenerCitas() {
    const query = `SELECT * FROM citas`;
    const result = await this.db.query(query);
    return result.values || [];
  }

  async obtenerCitaPorId(id: number) {
    const query = `SELECT * FROM citas WHERE id = ?`;
    const result = await this.db.query(query, [id]);
    return result.values;
  }

  async eliminarCita(id: number) {
    const query = `DELETE FROM citas WHERE id = ?`;
    await this.db.run(query, [id]);
  }

}
