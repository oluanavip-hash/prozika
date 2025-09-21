import { CartItem } from '../types';

export const calculateCartTotals = (cartItems: CartItem[]) => {
  // 1. Cria uma lista plana de todos os itens, respeitando a quantidade e aplicando o desconto de 70%
  const flatItems = cartItems.flatMap(item => 
    Array(item.quantity).fill({ 
      ...item, 
      price: item.team.price * 0.30 
    })
  );

  // 2. Calcula o subtotal (soma de todos os preços dos itens)
  const subtotal = flatItems.reduce((sum, item) => sum + item.price, 0);

  // 3. Ordena os itens por preço para encontrar os mais baratos para o desconto
  flatItems.sort((a, b) => a.price - b.price);

  // 4. Calcula o número de itens gratuitos (limite de 1 item grátis se houver 3 ou mais)
  const totalQuantity = flatItems.length;
  const numberOfFreeItems = totalQuantity >= 3 ? 1 : 0;

  // 5. Calcula o desconto somando os preços dos N itens mais baratos
  const discount = numberOfFreeItems > 0 
    ? flatItems.slice(0, numberOfFreeItems).reduce((sum, item) => sum + item.price, 0)
    : 0;
    
  // 6. Calcula o total final
  const total = subtotal - discount;

  return {
    subtotal,
    discount,
    total,
    totalQuantity,
    numberOfFreeItems,
  };
};
