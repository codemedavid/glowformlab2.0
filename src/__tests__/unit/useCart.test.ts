import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCart } from '../../hooks/useCart';
import { createProduct, createVariation } from '../helpers';

describe('useCart', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('starts with an empty cart', () => {
      const { result } = renderHook(() => useCart());
      expect(result.current.cartItems).toEqual([]);
      expect(result.current.getTotalPrice()).toBe(0);
      expect(result.current.getTotalItems()).toBe(0);
    });

    it('loads cart from localStorage on mount', () => {
      const product = createProduct();
      const savedCart = [{ product, quantity: 2, price: product.base_price }];
      localStorage.setItem('peptide_cart', JSON.stringify(savedCart));

      const { result } = renderHook(() => useCart());

      // Wait for useEffect to run
      expect(result.current.cartItems).toEqual(savedCart);
    });
  });

  describe('addToCart', () => {
    it('adds a product to the cart', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct();

      act(() => {
        result.current.addToCart(product);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].product.id).toBe(product.id);
      expect(result.current.cartItems[0].quantity).toBe(1);
      expect(result.current.cartItems[0].price).toBe(product.base_price);
    });

    it('adds a product with a variation', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct();
      const variation = createVariation({ price: 1500 });

      act(() => {
        result.current.addToCart(product, variation);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].variation?.id).toBe(variation.id);
      expect(result.current.cartItems[0].price).toBe(1500);
    });

    it('uses discount price when discount is active (product)', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({
        base_price: 2500,
        discount_price: 2000,
        discount_active: true,
      });

      act(() => {
        result.current.addToCart(product);
      });

      expect(result.current.cartItems[0].price).toBe(2000);
    });

    it('uses discount price when discount is active (variation)', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct();
      const variation = createVariation({
        price: 1500,
        discount_price: 1200,
        discount_active: true,
      });

      act(() => {
        result.current.addToCart(product, variation);
      });

      expect(result.current.cartItems[0].price).toBe(1200);
    });

    it('increments quantity for duplicate product', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({ stock_quantity: 10 });

      act(() => {
        result.current.addToCart(product);
      });
      act(() => {
        result.current.addToCart(product);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });

    it('treats same product with different variations as separate items', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct();
      const variation1 = createVariation({ id: 'var-1', name: '5mg', stock_quantity: 10 });
      const variation2 = createVariation({ id: 'var-2', name: '10mg', stock_quantity: 10 });

      act(() => {
        result.current.addToCart(product, variation1);
      });
      act(() => {
        result.current.addToCart(product, variation2);
      });

      expect(result.current.cartItems).toHaveLength(2);
    });

    it('prevents adding out-of-stock product', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({ stock_quantity: 0 });

      act(() => {
        result.current.addToCart(product);
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('out of stock')
      );
    });

    it('caps quantity at available stock for new items', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({ stock_quantity: 3 });

      act(() => {
        result.current.addToCart(product, undefined, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(3);
      expect(window.alert).toHaveBeenCalled();
    });

    it('caps quantity at available stock when incrementing existing item', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({ stock_quantity: 3 });

      act(() => {
        result.current.addToCart(product, undefined, 2);
      });
      act(() => {
        result.current.addToCart(product, undefined, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(3);
    });

    it('alerts when cart already has max stock', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({ stock_quantity: 2 });

      act(() => {
        result.current.addToCart(product, undefined, 2);
      });
      act(() => {
        result.current.addToCart(product, undefined, 1);
      });

      expect(result.current.cartItems[0].quantity).toBe(2);
      expect(window.alert).toHaveBeenCalledWith(
        expect.stringContaining('maximum available quantity')
      );
    });
  });

  describe('updateQuantity', () => {
    it('updates item quantity', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({ stock_quantity: 10 });

      act(() => {
        result.current.addToCart(product);
      });
      act(() => {
        result.current.updateQuantity(0, 5);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
    });

    it('removes item when quantity is set to 0', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct();

      act(() => {
        result.current.addToCart(product);
      });
      act(() => {
        result.current.updateQuantity(0, 0);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('removes item when quantity is negative', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct();

      act(() => {
        result.current.addToCart(product);
      });
      act(() => {
        result.current.updateQuantity(0, -1);
      });

      expect(result.current.cartItems).toHaveLength(0);
    });

    it('caps at available stock', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct({ stock_quantity: 5 });

      act(() => {
        result.current.addToCart(product);
      });
      act(() => {
        result.current.updateQuantity(0, 100);
      });

      expect(result.current.cartItems[0].quantity).toBe(5);
      expect(window.alert).toHaveBeenCalled();
    });
  });

  describe('removeFromCart', () => {
    it('removes an item by index', () => {
      const { result } = renderHook(() => useCart());
      const product1 = createProduct({ id: 'p1', name: 'Product 1' });
      const product2 = createProduct({ id: 'p2', name: 'Product 2' });

      act(() => {
        result.current.addToCart(product1);
      });
      act(() => {
        result.current.addToCart(product2);
      });
      act(() => {
        result.current.removeFromCart(0);
      });

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].product.id).toBe('p2');
    });
  });

  describe('clearCart', () => {
    it('empties the cart and clears localStorage', () => {
      const { result } = renderHook(() => useCart());
      const product = createProduct();

      act(() => {
        result.current.addToCart(product);
      });
      act(() => {
        result.current.clearCart();
      });

      expect(result.current.cartItems).toHaveLength(0);
      expect(localStorage.removeItem).toHaveBeenCalledWith('peptide_cart');
    });
  });

  describe('getTotalPrice', () => {
    it('calculates total price across all items', () => {
      const { result } = renderHook(() => useCart());
      const product1 = createProduct({ id: 'p1', base_price: 1000, stock_quantity: 10 });
      const product2 = createProduct({ id: 'p2', base_price: 500, stock_quantity: 10 });

      act(() => {
        result.current.addToCart(product1, undefined, 2);
      });
      act(() => {
        result.current.addToCart(product2, undefined, 3);
      });

      // 1000*2 + 500*3 = 3500
      expect(result.current.getTotalPrice()).toBe(3500);
    });

    it('returns 0 for empty cart', () => {
      const { result } = renderHook(() => useCart());
      expect(result.current.getTotalPrice()).toBe(0);
    });
  });

  describe('getTotalItems', () => {
    it('sums quantities across all items', () => {
      const { result } = renderHook(() => useCart());
      const product1 = createProduct({ id: 'p1', stock_quantity: 10 });
      const product2 = createProduct({ id: 'p2', stock_quantity: 10 });

      act(() => {
        result.current.addToCart(product1, undefined, 3);
      });
      act(() => {
        result.current.addToCart(product2, undefined, 2);
      });

      expect(result.current.getTotalItems()).toBe(5);
    });
  });

  describe('localStorage persistence', () => {
    it('persists cart data across hook re-mounts', async () => {
      const product = createProduct();

      // Pre-populate localStorage as if a previous session saved data
      const savedCart = [{ product, quantity: 2, price: product.base_price }];
      localStorage.setItem('peptide_cart', JSON.stringify(savedCart));

      // Mount: cart should load from localStorage
      const { result } = renderHook(() => useCart());

      expect(result.current.cartItems).toHaveLength(1);
      expect(result.current.cartItems[0].product.id).toBe(product.id);
      expect(result.current.cartItems[0].quantity).toBe(2);
    });
  });
});
