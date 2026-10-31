import { object, string } from "yup";

export const createOrderSchema = object({
  productId: string()
    .matches(/^rec[A-Za-z0-9]+$/, "Id de producto inválido")
    .required(),
});

export const orderIdSchema = object({
  orderId: string()
    .matches(/^[A-Za-z0-9]+$/, "Id de orden inválido")
    .required(),
});