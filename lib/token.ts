import jwt from "jsonwebtoken";

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("Falta la variable JWT_SECRET");
  return secret;
}

export function createToken(userId: string) {
  return jwt.sign({ userId }, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  try {
    const payload = jwt.verify(token, getSecret()) as { userId: string };
    return payload.userId;
  } catch {
    return null;
  }
}