import { createOrderSchema, orderIdSchema } from "../schemas/orderSchema";
import { Product } from "../models/productModel";
import { Order } from "../models/orderModel";
import { createPaymentUrl } from "../lib/mercadopago";

export async function createOrder(userId: string, query: unknown) {
  const { productId } = await createOrderSchema.validate(query);

  const product = await Product.findById(productId);
  if (!product) return null;

  if (typeof product.price !== "number") {
    throw new Error("El producto no tiene precio");
  }

  const order = await Order.createPending(userId, {
    id: product.id,
    name: product.name,
    price: product.price,
  });

  const url = await createPaymentUrl({
    orderId: order.id,
    title: product.name,
    price: product.price,
  });

  return { url, orderId: order.id };
}

function toPublicOrder(order: Order) {
  const { productId, productName, amount, status, createdAt } = order.data;
  return { id: order.id, productId, productName, amount, status, createdAt };
}

export async function getMyOrders(userId: string) {
  const orders = await Order.findByUserId(userId);
  return orders.map(toPublicOrder);
}

export async function getOrder(userId: string, query: unknown) {
  const { orderId } = await orderIdSchema.validate(query);

  const order = await Order.findById(orderId);
  if (!order || order.data.userId !== userId) return null;

  return toPublicOrder(order);
}