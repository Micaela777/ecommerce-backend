import { object, string, InferType } from "yup";

const email = string().trim().lowercase().email().required();

export const authSchema = object({ email });

export const tokenSchema = object({
  email,
  code: string().trim().matches(/^\d{5}$/, "El código debe tener 5 dígitos").required(),
});

export type AuthBody = InferType<typeof authSchema>;
export type TokenBody = InferType<typeof tokenSchema>;