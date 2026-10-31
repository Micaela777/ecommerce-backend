import { DocumentSnapshot } from "firebase-admin/firestore";
import { firestore } from "../lib/firestore";

const collection = firestore.collection("orders");

function toOrder(doc: DocumentSnapshot) {
  const raw = doc.data() as any;
  return new Order(doc.id, { ...raw, createdAt: raw.createdAt.toDate() });
}

export type OrderData = {
  userId: string;
  productId: string;
  productName: string;
  amount: number;
  status: "pending" | "paid";
  createdAt: Date;
};

export class Order {
  id: string;
  data: OrderData;

  constructor(id: string, data: OrderData) {
    this.id = id;
    this.data = data;
  }

  static async createPending(
    userId: string,
    product: { id: string; name: string; price: number }
  ) {
    const data: OrderData = {
      userId,
      productId: product.id,
      productName: product.name,
      amount: product.price,
      status: "pending",
      createdAt: new Date(),
    };
    const ref = await collection.add(data);
    return new Order(ref.id, data);
  }

  static async findById(id: string) {
    const doc = await collection.doc(id).get();
    return doc.exists ? toOrder(doc) : null;
  }

  static async findByUserId(userId: string) {
    const snap = await collection.where("userId", "==", userId).get();
    return snap.docs
      .map(toOrder)
      .sort((a, b) => b.data.createdAt.getTime() - a.data.createdAt.getTime());
  }
}