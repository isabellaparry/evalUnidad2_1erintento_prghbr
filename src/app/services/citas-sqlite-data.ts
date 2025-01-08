import {
    CapacitorSQLite,
    SQLiteConnection,
    SQLiteDBConnection
  } from '@capacitor-community/sqlite'
  import { Capacitor } from '@capacitor/core'
  import { Cita } from 'src/app/models/cita'
  import { CitasRepository } from 'src/app/services/citas-repository'
  
  export class CitasSqliteData extends CitasRepository {
  
    private sqlite: SQLiteConnection = new SQLiteConnection( CapacitorSQLite )
    private db !: SQLiteDBConnection
    private plataforma: string       = ''
    private DB_TABLE_NAME            = 'quotes'
    private DB_NAME                  = 'quotes'
    private DB_ENCRIPT               = false
    private DB_MODE                  = 'no-encryption'
    private DB_VERSION               = 1
    private DB_READ_ONLY             = false
    private DB_COL_ID                = 'id'
    private DB_COL_AUTOR            = 'autor'
    private DB_COL_CITA              = 'cita'
    private DB_SQL_TABLAS            = `CREATE TABLE IF NOT EXISTS ${this.DB_TABLE_NAME} (
      ${this.DB_COL_ID} TEXT PRIMARY KEY NOT NULL,
      ${this.DB_COL_AUTOR} TEXT NOT NULL,
      ${this.DB_COL_CITA} TEXT NOT NULL
      )`
  
    async init(): Promise<void> {
      await this.initPlugin()
    }
  
    async getCitas(): Promise<Cita[]> {
      const sql             = `SELECT * FROM ${this.DB_TABLE_NAME}`
      const response        = await this.db.query( sql )
      const result: Cita[] = []
      response.values?.forEach( ( element: any ) => {
        element.createdAt = new Date( element.createdAt )
        result.push( element )
      } )
      return result
    }
  
    async getCita( id: string ): Promise<Cita | undefined> {
      const sql      = `SELECT * FROM ${this.DB_TABLE_NAME} WHERE ${this.DB_COL_ID} = ?`
      const response = await this.db.query( sql, [ id ] )
      let result: Cita | undefined
  
      if ( response.values && response.values.length > 0 ) {
        result = response.values[0]
      }
  
      return result
    }
  
    async addCita( quote: Cita ): Promise<boolean> {
      try {
        const sql = `INSERT INTO ${this.DB_TABLE_NAME}(${this.DB_COL_ID}, ${this.DB_COL_AUTOR}, ${this.DB_COL_CITA}) VALUES(?, ?,?,?)`
        await this.db.run( sql,
          [ quote.id, quote.autor, quote.cita ] )
        return true
      }
      catch ( e ) {
        return false
      }
    }
  
    async updateCita( quote: Cita ): Promise<boolean> {
      try {
        const sql = `UPDATE ${this.DB_TABLE_NAME} SET ${this.DB_COL_AUTOR} = ?, ${this.DB_COL_CITA} = ? WHERE ${this.DB_COL_ID} = ?`
        await this.db.run( sql,
          [ quote.autor, quote.cita, quote.id ] )
        return true
      }
      catch ( e ) {
        return false
      }
    }
  
    async deleteCita( id: string ): Promise<boolean> {
      try {
        const sql = `DELETE FROM ${this.DB_TABLE_NAME} WHERE ${this.DB_COL_ID} = ?`
        await this.db.run( sql, [ id ] )
        return true
      }
      catch ( e ) {
        return false
      }
    }
  
    private async _initPluginWeb(): Promise<void> {
      await customElements.whenDefined( 'jeep-sqlite' )
      const jeepSqliteEl = document.querySelector( 'jeep-sqlite' )
      if ( jeepSqliteEl != null ) {
        await this.sqlite.initWebStore()
      }
    }
  
    async initPlugin() {
      this.plataforma = Capacitor.getPlatform()
      if ( this.plataforma == 'web' ) {
        await this._initPluginWeb()
      }
      await this.openConnection()
      await this.db.execute( this.DB_SQL_TABLAS )
    }
  
    async openConnection() {
      const ret    = await this.sqlite.checkConnectionsConsistency()
      const isConn = ( await this.sqlite.isConnection( this.DB_NAME,
        this.DB_READ_ONLY ) ).result
      if ( ret.result && isConn ) {
        this.db =
          await this.sqlite.retrieveConnection( this.DB_NAME, this.DB_READ_ONLY )
      }
      else {
        this.db = await this.sqlite.createConnection(
          this.DB_NAME,
          this.DB_ENCRIPT,
          this.DB_MODE,
          this.DB_VERSION,
          this.DB_READ_ONLY
        )
      }
      await this.db.open()
    }
  }
  