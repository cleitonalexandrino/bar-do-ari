import { describe, it, expect, beforeEach } from 'vitest';
import { useCartStore } from './store';

const mockItem = {
  id: '1',
  name: 'Feijoada',
  description: 'Completa',
  price: 35.0,
  category: 'Pratos Feitos',
  is_available: true,
};

describe('useCartStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    const { clearCart } = useCartStore.getState();
    clearCart();
  });

  it('should add an item to the cart', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].id).toBe('1');
    expect(items[0].quantity).toBe(1);
  });

  it('should increment quantity if same item is added', () => {
    const { addItem } = useCartStore.getState();
    addItem(mockItem);
    addItem(mockItem);

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(2);
  });

  it('should calculate total correctly', () => {
    const { addItem, getTotal } = useCartStore.getState();
    addItem(mockItem); // 35.0
    addItem({ ...mockItem, id: '2', price: 10.0 }); // 10.0
    
    expect(getTotal()).toBe(45.0);
  });

  it('should remove an item correctly', () => {
    const { addItem, removeItem } = useCartStore.getState();
    addItem(mockItem);
    removeItem('1');

    const { items } = useCartStore.getState();
    expect(items).toHaveLength(0);
  });

  it('should update quantity correctly', () => {
    const { addItem, updateQuantity } = useCartStore.getState();
    addItem(mockItem);
    updateQuantity('1', 5);

    const { items } = useCartStore.getState();
    expect(items[0].quantity).toBe(5);
  });
});
