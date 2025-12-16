// Type declarations for react-native-sqlite-storage
declare module 'react-native-sqlite-storage' {
  export interface DatabaseParams {
    name: string;
    location?: string;
  }

  export interface ResultSet {
    insertId?: number;
    rowsAffected: number;
    rows: {
      length: number;
      item: (index: number) => any;
      raw: () => any[];
    };
  }

  export interface SQLiteDatabase {
    executeSql(
      sql: string,
      params?: any[]
    ): Promise<[ResultSet]>;
    close(): Promise<void>;
  }

  export interface SQLite {
    openDatabase(params: DatabaseParams): Promise<SQLiteDatabase>;
    enablePromise(enable: boolean): void;
  }

  const sqlite: SQLite;
  export default sqlite;
}
