import { z } from "zod";

export const createTasksShema = z.object({
    tittle: z.string({
        required_error: 'Tittle is required'
    }),
    description:z.string({
        required_error:'Description must be a string'
    }),
    date:z.string().datetime().optional(),
});