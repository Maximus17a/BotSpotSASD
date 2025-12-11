import { Pool } from 'pg';
import { config } from '../config';

let pool: Pool | null = null;

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: config.databaseUrl,
    });
  }
  return pool;
}

export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  const p = getPool();
  // Convert MySQL style parameters (?) to PostgreSQL style ($1, $2, ...)
  let paramIndex = 1;
  const pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
  
  const { rows } = await p.query(pgSql, params);
  return rows;
}

export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  const results = await query<T>(sql, params);
  return results[0] || null;
}
