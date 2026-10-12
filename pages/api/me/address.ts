import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { updateAddress } from "../../../controllers/userController";

async function handler(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const user = await updateAddress(userId, req.body ?? {});
  if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

  res.status(200).json(user);
}

export default authMiddleware(handler);