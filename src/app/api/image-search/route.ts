import { NextResponse } from 'next/server';

// Pexels API: gratuita, 200 req/hora, CORS-friendly via server-side
const PEXELS_KEY = process.env.PEXELS_API_KEY;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Missing query' }, { status: 400 });
  }

  // Se a chave Pexels estiver disponível, usa ela
  if (PEXELS_KEY) {
    try {
      // Traduzz termos comuns para inglês para melhor busca
      const translatedQuery = translateToEnglish(query);
      
      const response = await fetch(
        `https://api.pexels.com/v1/search?query=${encodeURIComponent(translatedQuery)}+food&per_page=6&orientation=square`,
        { headers: { Authorization: PEXELS_KEY } }
      );

      if (response.ok) {
        const data = await response.json();
        const results = data.photos?.map((photo: any) => ({
          title: photo.alt || query,
          link: photo.src.large,
          thumbnail: photo.src.medium,
        })) || [];

        if (results.length > 0) return NextResponse.json(results);
      }
    } catch (e) {
      console.warn('Pexels falhou, usando fallback curado.');
    }
  }

  // Fallback: lookup curado de fotos de comida brasileira via IDs do Pexels
  const curatedResults = getCuratedImages(query);
  return NextResponse.json(curatedResults);
}

function translateToEnglish(query: string): string {
  const translations: Record<string, string> = {
    'calabresa': 'calabrese sausage pizza',
    'picanha': 'picanha beef grilled',
    'frango': 'grilled chicken',
    'peixe': 'grilled fish fillet',
    'carne': 'beef steak',
    'cerveja': 'cold beer glass',
    'batata': 'french fries potato',
    'caipirinha': 'caipirinha cocktail',
    'porcao': 'appetizer sharing',
    'porcão': 'appetizer sharing',
    'costela': 'beef ribs barbecue',
    'salsicha': 'sausage grilled',
    'linguica': 'sausage grilled',
    'linguiça': 'sausage grilled',
    'refrigerante': 'soda soft drink',
    'agua': 'water bottle',
    'suco': 'fresh juice glass',
    'pernil': 'pork leg roasted',
    'feijoada': 'feijoada brazilian beans',
    'arroz': 'rice plate',
    'feijao': 'beans bowl',
    'salada': 'salad plate',
  };

  const lowerQuery = query.toLowerCase().trim();
  for (const [key, value] of Object.entries(translations)) {
    if (lowerQuery.includes(key)) return value;
  }

  // Se não traduzir, faz busca em inglês mesmo
  return `${query} food restaurant`;
}

// IDs reais de fotos do Pexels por categoria (fallback sem chave)
function getCuratedImages(query: string) {
  const lowerQuery = query.toLowerCase();

  type PhotoSet = Array<{ id: number; title: string }>;

  const categories: Record<string, PhotoSet> = {
    default: [
      { id: 1640777, title: 'Prato Gourmet 1' },
      { id: 376464, title: 'Prato Gourmet 2' },
      { id: 1633578, title: 'Prato Gourmet 3' },
      { id: 70497, title: 'Prato Gourmet 4' },
      { id: 1279330, title: 'Prato Gourmet 5' },
      { id: 1437588, title: 'Prato Gourmet 6' },
    ],
    meat: [
      { id: 3535218, title: 'Carne Grelhada 1' },
      { id: 361184, title: 'Carne Grelhada 2' },
      { id: 602773, title: 'Carne Grelhada 3' },
      { id: 675951, title: 'Carne Grelhada 4' },
      { id: 1639562, title: 'Carne Grelhada 5' },
      { id: 323682, title: 'Carne Grelhada 6' },
    ],
    drink: [
      { id: 1283219, title: 'Bebida Premium 1' },
      { id: 544961, title: 'Bebida Premium 2' },
      { id: 1283217, title: 'Bebida Premium 3' },
      { id: 1283218, title: 'Bebida Premium 4' },
      { id: 2531157, title: 'Bebida Premium 5' },
      { id: 3407777, title: 'Bebida Premium 6' },
    ],
    chicken: [
      { id: 2338407, title: 'Frango Grelhado 1' },
      { id: 2097090, title: 'Frango Grelhado 2' },
      { id: 1410235, title: 'Frango Grelhado 3' },
      { id: 4253298, title: 'Frango Grelhado 4' },
      { id: 1640772, title: 'Frango Grelhado 5' },
      { id: 3535216, title: 'Frango Grelhado 6' },
    ],
  };

  // Detecta categoria
  let category: keyof typeof categories = 'default';
  if (lowerQuery.match(/pic|cost|car|bife|chu|lin|calc|assa/)) category = 'meat';
  if (lowerQuery.match(/fran|gal|peito|coxa/)) category = 'chicken';
  if (lowerQuery.match(/cerv|ref|suc|cai|agua|drin|long|beb/)) category = 'drink';

  const photos = categories[category];
  return photos.map((p) => ({
    title: `${query} - ${p.title}`,
    link: `https://images.pexels.com/photos/${p.id}/pexels-photo-${p.id}.jpeg?auto=compress&cs=tinysrgb&w=800`,
    thumbnail: `https://images.pexels.com/photos/${p.id}/pexels-photo-${p.id}.jpeg?auto=compress&cs=tinysrgb&w=200`,
  }));
}
