import { z } from "zod";

export const authSchema = z.object({
  name: z.string().trim().optional(),
  email: z.string().email(),
  password: z.string().min(1, 'Field too short'),
});

export type AuthFormData = z.infer<typeof authSchema>;