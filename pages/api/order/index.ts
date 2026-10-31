import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { createOrder } from "../../../controllers/orderController";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const result = await createOrder(userId, { productId: req.query.productId });
  if (!result) {
    return res.status(404).json({ error: "Producto no encontrado" });
  }

  res.status(201).json(result);
}

export default authMiddleware(handler);