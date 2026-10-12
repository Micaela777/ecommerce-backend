import { ValidationError } from "yup";
import { User } from "../models/userModel";
import { updateMeSchema, addressSchema } from "../schemas/userSchema";

function toPublicUser(user: User) {
  const { email, name, address } = user.data;
  return { id: user.id, email, name, address };
}

export async function getMe(userId: string) {
  const user = await User.findById(userId);
  return user ? toPublicUser(user) : null;
}

export async function updateMe(userId: string, body: unknown) {
  const changes = await updateMeSchema.validate(body, { stripUnknown: true });
  if (Object.keys(changes).length === 0) {
    throw new ValidationError("No hay datos para actualizar");
  }

  const user = await User.findById(userId);
  if (!user) return null;

  await user.updateProfile(changes);
  return toPublicUser(user);
}

export async function updateAddress(userId: string, body: unknown) {
  const changes = await addressSchema.validate(body, { stripUnknown: true });
  if (Object.keys(changes).length === 0) {
    throw new ValidationError("No hay datos para actualizar");
  }

  const user = await User.findById(userId);
  if (!user) return null;

  await user.updateProfile({ address: { ...user.data.address, ...changes } });
  return toPublicUser(user);
}