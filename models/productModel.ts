import { getAlgolia } from "../lib/algolia";

function toProduct(hit: Record<string, any>) {
  return {
    id: hit.objectID,
    name: hit.Name,
    type: hit.Type,
    price: hit["Unit cost"],
    description: hit.Description,
    images: (hit.Images ?? []).map((image: any) => image.url),
  };
}

function toDetailedProduct(hit: Record<string, any>) {
  return {
    id: hit.objectID,
    name: hit.Name,
    type: hit.Type,
    price: hit["Unit cost"],
    description: hit.Description,
    images: (hit.Images ?? []).map((image: any) => image.url),
    materials: hit.Materials,
    size: hit["Size (WxLxH)"],
    color: hit.Color,
  };
}

export class Product {
  static async search(q: string, offset: number, limit: number) {
    const { client, indexName } = getAlgolia();

    const { results } = await client.search({
      requests: [{ indexName, query: q, offset, length: limit }],
    });

    const result = results[0];
    if (!("hits" in result)) {
      throw new Error("Respuesta inesperada de Algolia");
    }

    return {
      products: result.hits.map(toProduct),
      total: result.nbHits ?? 0,
    };
  }

  static async findById(id: string) {
    const { client, indexName } = getAlgolia();
    try {
      const hit = await client.getObject({ indexName, objectID: id });
      return toDetailedProduct(hit);
    } catch (error: any) {
      if (error.status === 404) return null;
      throw error;
    }
  }
}