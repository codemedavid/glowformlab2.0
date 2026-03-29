import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockFrom = vi.fn();
const mockRpc = vi.fn();

function createChain(resolvedValue: any = { data: [], error: null }) {
  const chain: any = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = vi.fn().mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockReturnValue(chain);
  chain.then = (resolve: any, reject: any) => Promise.resolve(resolvedValue).then(resolve, reject);
  return chain;
}

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    channel: vi.fn(() => ({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn(),
    })),
    removeChannel: vi.fn(),
    rpc: (...args: any[]) => mockRpc(...args),
  },
}));

import { useMenu } from '../../hooks/useMenu';

describe('useMenu', () => {
  const mockProducts = [
    {
      id: 'prod-1',
      name: 'BPC-157',
      description: 'Test peptide',
      category: 'peptides',
      base_price: 2500,
      discount_price: null,
      discount_start_date: null,
      discount_end_date: null,
      discount_active: false,
      purity_percentage: 99.5,
      molecular_weight: '1419.53',
      cas_number: '137525-51-0',
      sequence: 'GEPPPGKPADDAGLV',
      storage_conditions: 'Store at -20°C',
      inclusions: null,
      stock_quantity: 10,
      available: true,
      featured: true,
      image_url: null,
      safety_sheet_url: null,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  const mockVariations = [
    { id: 'var-1', product_id: 'prod-1', name: '5mg', quantity_mg: 5, price: 1500, stock_quantity: 20, created_at: '2024-01-01' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockRpc.mockResolvedValue({ data: null, error: null });

    // Default mock: products query returns products, variations query returns variations
    mockFrom.mockImplementation((table: string) => {
      if (table === 'products') {
        return createChain({ data: mockProducts, error: null });
      }
      if (table === 'product_variations') {
        return createChain({ data: mockVariations, error: null });
      }
      if (table === 'recommendation_rules') {
        return createChain({ data: null, error: null });
      }
      return createChain({ data: [], error: null });
    });
  });

  describe('fetching products', () => {
    it('fetches products and their variations on mount', async () => {
      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.products).toHaveLength(1);
      expect(result.current.products[0].name).toBe('BPC-157');
      expect(result.current.products[0].variations).toEqual(mockVariations);
    });

    it('sets error when fetch fails', async () => {
      mockFrom.mockImplementation(() =>
        createChain({ data: null, error: new Error('Network error') })
      );

      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });

    it('provides menuItems alias for backward compatibility', async () => {
      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.menuItems).toBe(result.current.products);
    });
  });

  describe('addProduct', () => {
    it('inserts product and returns success', async () => {
      const newProduct = {
        name: 'TB-500',
        description: 'Thymosin Beta-4',
        category: 'peptides',
        base_price: 3000,
        discount_price: null,
        discount_start_date: null,
        discount_end_date: null,
        discount_active: false,
        purity_percentage: 98,
        molecular_weight: null,
        cas_number: null,
        sequence: null,
        storage_conditions: 'Store at -20°C',
        inclusions: null,
        stock_quantity: 5,
        available: true,
        featured: false,
        image_url: null,
        safety_sheet_url: null,
      };

      const insertedData = { id: 'prod-2', ...newProduct, created_at: '2024-01-01', updated_at: '2024-01-01' };

      mockFrom.mockImplementation((table: string) => {
        if (table === 'products') {
          const chain = createChain({ data: insertedData, error: null });
          return chain;
        }
        return createChain({ data: [], error: null });
      });

      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.addProduct(newProduct as any);
      expect(response.success).toBe(true);
    });

    it('returns error on insert failure', async () => {
      mockFrom.mockImplementation((table: string) => {
        if (table === 'products') {
          return createChain({ data: null, error: { message: 'RLS violation' } });
        }
        return createChain({ data: [], error: null });
      });

      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.addProduct({} as any);
      expect(response.success).toBe(false);
      expect(response.error).toBeTruthy();
    });
  });

  describe('deleteProduct', () => {
    it('deletes via RPC when available', async () => {
      mockRpc.mockResolvedValue({ data: null, error: null });

      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.deleteProduct('prod-1');
      expect(response.success).toBe(true);
      expect(mockRpc).toHaveBeenCalledWith('delete_product_cascade', { target_product_id: 'prod-1' });
    });

    it('falls back to manual deletion when RPC fails', async () => {
      mockRpc.mockResolvedValue({ data: null, error: { message: 'function not found' } });

      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.deleteProduct('prod-1');
      expect(response.success).toBe(true);
      // Should have tried to clean up variations and recommendation_rules
      expect(mockFrom).toHaveBeenCalledWith('recommendation_rules');
      expect(mockFrom).toHaveBeenCalledWith('product_variations');
    });
  });

  describe('addVariation', () => {
    it('inserts variation and refreshes products', async () => {
      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.addVariation({
        product_id: 'prod-1',
        name: '10mg',
        quantity_mg: 10,
        price: 2500,
        discount_price: null,
        discount_active: false,
        stock_quantity: 15,
      });

      expect(response.success).toBe(true);
      expect(mockFrom).toHaveBeenCalledWith('product_variations');
    });
  });

  describe('deleteVariation', () => {
    it('deletes variation and refreshes products', async () => {
      const { result } = renderHook(() => useMenu());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const response = await result.current.deleteVariation('var-1');
      expect(response.success).toBe(true);
    });
  });
});
