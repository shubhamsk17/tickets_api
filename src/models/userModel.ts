import pool from './db';
import bcrypt from 'bcryptjs';

export async function createUser(name: string, email: string, type: string, password: string) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    'INSERT INTO users (name, email, type, password) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, type, hashedPassword]
  );
  return result.rows[0];
}

export async function findUserByEmail(email: string) {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
}

export async function findUserById(id: number) {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
}
