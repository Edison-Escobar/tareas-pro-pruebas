import { describe, it, expect, beforeAll, beforeEach, afterAll } from 'vitest';
import { Pool } from 'pg';
import { randomUUID } from 'node:crypto';

const conexion = process.env.DATABASE_URL;

if (!conexion) {
  throw new Error('No se encontró DATABASE_URL para las pruebas');
}

const pool = new Pool({
  connectionString: conexion,
});

describe('Integración real con PostgreSQL', () => {
  beforeAll(async () => {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS tareas_prueba (
        id UUID PRIMARY KEY,
        titulo VARCHAR(80) NOT NULL,
        hecha BOOLEAN NOT NULL DEFAULT FALSE
      )
    `);
  });

  beforeEach(async () => {
    await pool.query('TRUNCATE TABLE tareas_prueba');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('guarda una tarea y permite recuperarla de PostgreSQL', async () => {
    const id = randomUUID();

    await pool.query(
      'INSERT INTO tareas_prueba (id, titulo) VALUES ($1, $2)',
      [id, 'Estudiar integración con PostgreSQL'],
    );

    const resultado = await pool.query(
      'SELECT id, titulo, hecha FROM tareas_prueba WHERE id = $1',
      [id],
    );

    expect(resultado.rows).toHaveLength(1);
    expect(resultado.rows[0].titulo).toBe(
      'Estudiar integración con PostgreSQL',
    );
    expect(resultado.rows[0].hecha).toBe(false);
  });
});
