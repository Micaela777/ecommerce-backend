import { object, string, number } from "yup";

export const searchSchema = object({
  q: string().trim().default(""),
  offset: number().integer().min(0).default(0),
  limit: number().integer().min(1).max(50).default(10),
});

export const productIdSchema = object({
  id: string()
    .matches(/^rec[A-Za-z0-9]+$/, "Id de producto inválido")
    .required(),
});