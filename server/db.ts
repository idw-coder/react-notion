import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

function getEnv(name: string, fallback?: string): string | undefined {
  const value = process.env[name];
  return value === undefined || value === '' ? fallback : value;
}

export function getMySqlPool(): mysql.Pool {
  if (pool) return pool;

  const host = getEnv('MYSQL_HOST', '127.0.0.1')!;
  const port = Number(getEnv('MYSQL_PORT', '3307'));
  const user = getEnv('MYSQL_USER', 'app_user')!;
  const password = getEnv('MYSQL_PASSWORD', 'app_password')!;
  const database = getEnv('MYSQL_DATABASE', 'app_db')!;

  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: 'Z',
    charset: 'utf8mb4_general_ci',
  });
  return pool;
}

export async function pingDatabase(): Promise<{ ok: boolean; now?: string }> {
  const p = getMySqlPool();
  const [rows] = await p.query<{ now: string }[] & any>('SELECT NOW() AS now');
  return { ok: true, now: rows?.[0]?.now };
}


