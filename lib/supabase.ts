import { createClient } from '@supabase/supabase-js';

// Solo se usa desde el servidor (route handlers). La llave publishable
// únicamente puede INSERTAR en la tabla entregas: así está el RLS del curso.
export function supabaseServidor() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !key) {
    throw new Error('Faltan SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en .env.local');
  }
  return createClient(url, key, { auth: { persistSession: false } });
}
