import { z } from "zod";

export const createEquipoShema = z.object({
    nombre: z.string({
        required_error: 'Nombre is required'
    }),
    description:z.string({
        required_error:'Description must be a string'
    }),
    foto_equipo:z.string().optional(),
});