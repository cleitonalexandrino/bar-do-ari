export interface SearchResult {
  title: string;
  link: string;
  thumbnail: string;
}

/**
 * Busca imagens pelo nome do item via rota server-side /api/image-search
 * Usa Pexels API (alta qualidade) com fallback curado por categoria.
 */
export async function searchImages(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`/api/image-search?q=${encodeURIComponent(query)}`);
    if (!response.ok) throw new Error('Falha na busca de imagens.');
    const results: SearchResult[] = await response.json();
    return results;
  } catch (error) {
    console.error('Erro ao buscar imagens:', error);
    return [];
  }
}

/**
 * Converte uma URL de imagem externa para Blob para poder subir no Storage
 * Usa um PROXY no servidor para evitar erros de CORS
 */
export async function imageUrlToBlob(url: string): Promise<Blob> {
  const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  if (!response.ok) throw new Error('Falha ao baixar imagem via proxy.');
  return await response.blob();
}
