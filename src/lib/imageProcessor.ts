/**
 * Utilitário de Processamento de Imagem para o Bar do Ari
 * Foca em tratamento visual de fundo branco e padronização.
 */

export async function processImageForMenu(imagePath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(imagePath); // Fallback
        return;
      }

      // Definimos um tamanho padrão quadrado (Pro Max Style)
      const size = 800;
      canvas.width = size;
      canvas.height = size;

      // Fundo Branco Sólido (Requisito do Usuário)
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, size, size);

      // Cálculo de enquadramento (Object-fit: contain proporcional)
      const ratio = Math.min(size / img.width, size / img.height);
      const x = (size - img.width * ratio) / 2;
      const y = (size - img.height * ratio) / 2;
      const width = img.width * ratio;
      const height = img.height * ratio;

      // Desenha a imagem centralizada
      ctx.drawImage(img, x, y, width, height);

      // Retorna em Base64 ou Blob URL
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => reject(new Error("Erro ao carregar imagem para processamento."));
    img.src = imagePath;
  });
}
