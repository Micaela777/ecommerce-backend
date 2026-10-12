import type { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import { verifyToken } from "../lib/token";

type AuthedHandler = (
  req: NextApiRequest,
  res: NextApiResponse,
  userId: string
) => Promise<void> | void;

export function authMiddleware(handler: AuthedHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const header = req.headers.authorization;
    const token = header?.match(/^Bearer\s+(.+)$/i)?.[1] ?? null;
    const userId = token ? verifyToken(token) : null;

    if (!userId) {
      return res.status(401).json({ error: "Token inválido o ausente" });
    }

    try {
      await handler(req, res, userId);
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      console.error(error);
      res.status(500).json({ error: "Error interno" });
    }
  };
}