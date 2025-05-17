import { z } from "zod";

export const createNotiShema = z.object({
    tittle: z.string({
        required_error: 'Tittle is required'
    }),
    description:z.string({
        required_error:'Description must be a string'
    }),
    foto_noti:z.string().optional(),
});