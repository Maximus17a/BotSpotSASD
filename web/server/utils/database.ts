import mysql from 'mysql2/promise';

let connection: mysql.Connection | null = null;

export async function getConnection(): Promise<mysql.Connection> {
  if (!connection) {
    connection = await mysql.createConnection(process.env.DATABASE_URL || '');
  }
  return connection;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const conn = await getConnection();
  const [rows] = await conn.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}
