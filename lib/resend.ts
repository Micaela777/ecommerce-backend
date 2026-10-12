import { Resend } from "resend";

function getResend() {
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error("Falta la variable RESEND_API_KEY");
  return new Resend(key);
}

export async function sendAuthCode(email: string, code: string) {
  const { error } = await getResend().emails.send({
    from: process.env.EMAIL_FROM as string,
    to: email,
    subject: "Tu código de acceso",
    html: `<p>Tu código es <strong>${code}</strong>.</p><p>Vence en 15 minutos.</p>`,
  });

  if (error) throw new Error(`No se pudo enviar el email: ${error.message}`);
}