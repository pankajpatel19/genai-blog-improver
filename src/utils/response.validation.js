import z from "zod";

export const responseValidation = z.object({
  title: z.string(),
  description: z.string(),
});
