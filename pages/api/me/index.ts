import type { NextApiRequest, NextApiResponse } from "next";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { getMe, updateMe } from "../../../controllers/userController";

async function handler(req: NextApiRequest, res: NextApiResponse, userId: string) {
  if (req.method === "GET") {
    const user = await getMe(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.status(200).json(user);
  }

  if (req.method === "PATCH") {
    const user = await updateMe(userId, req.body ?? {});
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
    return res.status(200).json(user);
  }

  res.status(405).json({ error: "Método no permitido" });
}

export default authMiddleware(handler);