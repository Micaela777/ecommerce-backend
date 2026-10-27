import Airtable from "airtable";

export function getProductsTable() {
  const token = process.env.AIRTABLE_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const table = process.env.AIRTABLE_TABLE;
  if (!token || !baseId || !table) {
    throw new Error("Faltan variables de Airtable en .env.local");
  }
  return new Airtable({ apiKey: token }).base(baseId)(table);
}