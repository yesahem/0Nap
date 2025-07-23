import { z } from "zod";

export const addUrlSchema = z.object({
  url: z.string().url(),
  interval: z.coerce.number().int().min(1).max(1440), // 1 min to 24 hours
}); 