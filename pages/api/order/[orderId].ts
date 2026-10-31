import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { getOrder } from "../../../controllers/orderController";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const order = await getOrder(userId, { orderId: req.query.orderId });
  if (!order) return res.status(404).json({ error: "Orden no encontrada" });

  res.status(200).json(order);
}

export default authMiddleware(handler);