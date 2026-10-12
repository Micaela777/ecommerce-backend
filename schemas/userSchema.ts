import { object, string } from "yup";

export const updateMeSchema = object({
  name: string().trim().min(1),
});

export const addressSchema = object({
  street: string().trim(),
  number: string().trim(),
  city: string().trim(),
  province: string().trim(),
  zipCode: string().trim(),
});