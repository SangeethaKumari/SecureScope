export const SENSO_API_URL = 'https://sdk.senso.ai/api/v1';

export interface SensoSearchResponse {
  answer: string;
  results: Array<{
    chunk_text: string;
    score: number;
    title: string;
  }>;
}

export async function searchPolicy(query: string, apiKey: string) {
  const response = await fetch(`${SENSO_API_URL}/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      query,
      max_results: 3,
    }),
  });

  if (!response.ok) {
    throw new Error(`Senso API Error: ${response.statusText}`);
  }

  return (await response.json()) as SensoSearchResponse;
}

export async function ingestPolicy(file: File, apiKey: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('title', 'Access Control Policy');

  const response = await fetch(`${SENSO_API_URL}/content/file`, {
    method: 'POST',
    headers: {
      'X-API-Key': apiKey,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Senso Ingestion Error: ${response.statusText}`);
  }

  return await response.json();
}
