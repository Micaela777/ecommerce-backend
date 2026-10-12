import { randomInt } from "crypto";
import { firestore } from "../lib/firestore";

const collection = firestore.collection("auths");
const EXPIRATION_MINUTES = 15;

export type AuthData = {
  email: string;
  code: string;
  expires: Date;
  used: boolean;
  createdAt: Date;
};

export class Auth {
  id: string;
  data: AuthData;

  constructor(id: string, data: AuthData) {
    this.id = id;
    this.data = data;
  }

  static async createCode(email: string) {
    const code = String(randomInt(0, 100000)).padStart(5, "0");
    const now = new Date();
    const data: AuthData = {
      email,
      code,
      used: false,
      expires: new Date(now.getTime() + EXPIRATION_MINUTES * 60 * 1000),
      createdAt: now,
    };
    const ref = await collection.add(data);
    return new Auth(ref.id, data);
  }

  static async findValidCode(email: string, code: string) {
    const snap = await collection
      .where("email", "==", email)
      .where("code", "==", code)
      .where("used", "==", false)
      .get();

    for (const doc of snap.docs) {
      const raw = doc.data();
      const expires: Date = raw.expires.toDate();
      if (expires > new Date()) {
        return new Auth(doc.id, { ...raw, expires } as AuthData);
      }
    }
    return null;
  }

  async markCodeAsUsed() {
    await collection.doc(this.id).update({ used: true });
    this.data.used = true;
  }
}