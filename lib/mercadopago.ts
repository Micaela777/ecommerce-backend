import { MercadoPagoConfig, Preference } from "mercadopago";

function getClient() {
  const token = process.env.MP_ACCESS_TOKEN;
  if (!token) throw new Error("Falta la variable MP_ACCESS_TOKEN");
  return new MercadoPagoConfig({ accessToken: token });
}

export async function createPaymentUrl(order: {
  orderId: string;
  title: string;
  price: number;
}) {
  const preference = await new Preference(getClient()).create({
    body: {
      items: [
        {
          id: order.orderId,
          title: order.title,
          quantity: 1,
          unit_price: order.price,
          currency_id: "ARS",
        },
      ],
      external_reference: order.orderId,
    },
  });

  if (!preference.init_point) {
    throw new Error("MercadoPago no devolvió la URL de pago");
  }
  return preference.init_point;
}