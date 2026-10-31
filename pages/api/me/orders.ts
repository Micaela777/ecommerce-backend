import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { getMyOrders } from "../../../controllers/orderController";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const orders = await getMyOrders(userId);
  res.status(200).json({ orders });
}

export default authMiddleware(handler);