import { whatsappConfig, formatWhatsAppUrl } from 'src/config/whatsapp';
import type { Product } from 'src/stores/types';
import type { CartItem } from 'src/stores/types';
import { formatPrice } from 'src/utils/format';

export function useWhatsApp() {
  function sendProductRequest(product: Product) {
    const price = formatProductPrice(product);
    const message = whatsappConfig.messageTemplates.product(product.name, price);
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  function sendCartProposal(items: CartItem[]) {
    const itemsList = items
      .map((item) => `${item.product.name} x${item.quantity} - ${formatProductPrice(item.product)}`)
      .join('\n');

    const totals: Record<string, number> = {};
    items.forEach((item) => {
      const c = item.product.currency || 'CUP';
      const price = item.product.descuento || item.product.price;
      totals[c] = (totals[c] || 0) + price * item.quantity;
    });
    const totalLines = Object.entries(totals)
      .map(([currency, total]) => `Total ${currency}: ${formatPrice(total, currency)}`)
      .join('\n');

    const message = whatsappConfig.messageTemplates.cart(itemsList, totalLines);
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  function sendContactMessage() {
    const message = whatsappConfig.messageTemplates.contact();
    window.open(formatWhatsAppUrl(message), '_blank');
  }

  return {
    sendProductRequest,
    sendCartProposal,
    sendContactMessage,
  };
}

function formatProductPrice(product: Product): string {
  const price = product.oferta && product.descuento ? product.descuento : product.price;
  const label = formatPrice(price, product.currency);
  const suffix = product.currency && product.currency !== 'CUP' ? product.currency : '';
  return product.oferta ? `${label}${suffix} (Oferta)` : `${label}${suffix}`;
}
