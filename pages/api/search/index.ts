import type { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import { searchProducts } from "../../../controllers/productController";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const data = await searchProducts(req.query);
    res.status(200).json(data);
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
}