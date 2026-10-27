import { algoliasearch } from "algoliasearch";

export function getAlgolia() {
  const appId = process.env.ALGOLIA_APP_ID;
  const key = process.env.ALGOLIA_SEARCH_KEY;
  const indexName = process.env.ALGOLIA_INDEX;
  if (!appId || !key || !indexName) {
    throw new Error("Faltan variables de Algolia en .env.local");
  }
  return { client: algoliasearch(appId, key), indexName };
}