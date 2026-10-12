import type { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import { requestCode } from "../../../controllers/authController";

export default async function handler(req: NextApiRequest,res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    await requestCode(req.body ?? {});
    res.status(200).json({ message: "Código enviado" });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
}