import { z } from 'zod';

export const crearTarea = z.object({
  // FIX: El servidor debe rechazar títulos demasiado cortos; la prueba
  // envía "ab" solo hay dos caracteres, por lo que el mínimo debe ser de 3 caracteres.
  titulo: z
    .string()
    .trim()
    .min(3, 'Mínimo 3 caracteres')
    .max(80, 'Máximo 80 caracteres'),
});

export type CrearTarea = z.infer<typeof crearTarea>;