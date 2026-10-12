import { firestore } from "../lib/firestore";

const collection = firestore.collection("users");

export type Address = {
  street?: string;
  number?: string;
  city?: string;
  province?: string;
  zipCode?: string;
};

export type UserData = {
  email: string;
  name?: string;
  address?: Address;
  createdAt: Date;
};

export class User {
  id: string;
  data: UserData;

  constructor(id: string, data: UserData) {
    this.id = id;
    this.data = data;
  }

  static async findByEmail(email: string) {
    const snap = await collection.where("email", "==", email).limit(1).get();
    if (snap.empty) return null;
    const doc = snap.docs[0];
    return new User(doc.id, doc.data() as UserData);
  }

  static async findById(id: string) {
    const doc = await collection.doc(id).get();
    if (!doc.exists) return null;
    return new User(doc.id, doc.data() as UserData);
  }

  static async createWithEmail(email: string) {
    const data: UserData = { email, createdAt: new Date() };
    const ref = await collection.add(data);
    return new User(ref.id, data);
  }

  async updateProfile(changes: Partial<UserData>) {
    await collection.doc(this.id).update(changes);
    this.data = { ...this.data, ...changes };
  }
}