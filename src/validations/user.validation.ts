import { z } from "zod";

export const createUserSchema = z.object({
  body: z.object({
    name: z.string().min(1, "name is required"),
    email: z.string().email("email must be valid"),
  }),
});
