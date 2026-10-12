import { authSchema, tokenSchema } from "../schemas/authSchema";
import { User } from "../models/userModel";
import { Auth } from "../models/authModel";
import { sendAuthCode } from "../lib/resend";
import { createToken } from "../lib/token";

export async function requestCode(body: unknown) {
  const { email } = await authSchema.validate(body);

  const user = await User.findByEmail(email);
  if (!user) await User.createWithEmail(email);

  const auth = await Auth.createCode(email);
  await sendAuthCode(email, auth.data.code);
}

export async function getTokenFromCode(body: unknown) {
  const { email, code } = await tokenSchema.validate(body);

  const auth = await Auth.findValidCode(email, code);
  if (!auth) return null;

  const user = await User.findByEmail(email);
  if (!user) return null;

  await auth.markCodeAsUsed();
  return createToken(user.id);
}