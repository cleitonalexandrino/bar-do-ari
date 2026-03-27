import { CartItem } from '@/types';

export function generateWhatsAppLink(
  items: CartItem[],
  total: number,
  address: string,
  paymentMethod: string,
  observations: string,
  phone: string = '551129224666'
) {
  const itemsText = items
    .map((item) => `${item.quantity}x ${item.name} (R$ ${(item.price * item.quantity).toFixed(2)})`)
    .join('\n');

  const text = `*Novo Pedido - Bar do Ari* 🍔\n\n` +
    `*Itens:*\n${itemsText}\n\n` +
    `*Total:* R$ ${total.toFixed(2)}\n\n` +
    `*Endereço de Entrega:*\n${address}\n\n` +
    `*Forma de Pagamento:*\n${paymentMethod}\n\n` +
    (observations ? `*Observações:*\n${observations}\n\n` : '') +
    `Por favor, confirme meu pedido!`;

  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${phone}?text=${encodedText}`;
}
