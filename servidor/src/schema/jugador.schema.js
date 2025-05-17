import { z } from "zod";

export const createJugaShema = z.object({
    nombre: z.string({
        required_error: 'Nombre is required'
    }),
    apellido:z.string({
        required_error:'Apellido must be a string'
    }),
    email: z.string({
        required_error: 'Email is required'
    }).email({
        message: 'Invalid Email '
    }),
    foto_jug:z.string().optional(),
    fecha_nac:z.string().datetime().optional(),
});