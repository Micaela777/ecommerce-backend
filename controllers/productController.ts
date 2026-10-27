import { searchSchema, productIdSchema } from "../schemas/productSchema";
import { Product } from "../models/productModel";

export async function searchProducts(query: unknown) {
  const { q, offset, limit } = await searchSchema.validate(query);
  const { products, total } = await Product.search(q, offset, limit);

  return { results: products, pagination: { offset, limit, total } };
}

export async function getProduct(query: unknown) {
  const { id } = await productIdSchema.validate(query);
  return Product.findById(id);
}