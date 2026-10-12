import type { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "yup";
import { getTokenFromCode } from "../../../controllers/authController";

export default async function handler(req: NextApiRequest,res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const token = await getTokenFromCode(req.body ?? {});
    if (!token) {
      return res.status(401).json({ error: "Email o código incorrecto" });
    }
    res.status(200).json({ token });
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    res.status(500).json({ error: "Error interno" });
  }
}

// "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwNHlwdjhKM1lDd2NIUXlRMzB6bSIsImlhdCI6MTc5MTY3NzA4MywiZXhwIjoxNzkyMjgxODgzfQ.6ycZHIZ5nQIoVWwo-Nvilux4bjc_2HIOxl3KB3onM-w"