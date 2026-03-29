import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Use vi.hoisted so these are available in the hoisted vi.mock factory
const { mockFrom, mockChannel, mockRemoveChannel, mockInsert, mockDelete } = vi.hoisted(() => ({
  mockFrom: vi.fn(),
  mockChannel: vi.fn(() => ({
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn(),
  })),
  mockRemoveChannel: vi.fn(),
  mockInsert: vi.fn(),
  mockDelete: vi.fn(),
}));

function createChain(resolvedValue: any = { data: [], error: null }) {
  const chain: any = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.insert = mockInsert.mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.delete = mockDelete.mockReturnValue(chain);
  chain.eq = vi.fn().mockReturnValue(chain);
  chain.order = vi.fn().mockReturnValue(chain);
  chain.single = vi.fn().mockReturnValue(chain);
  chain.limit = vi.fn().mockReturnValue(chain);
  chain.then = (resolve: any, reject: any) => Promise.resolve(resolvedValue).then(resolve, reject);
  return chain;
}

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
    channel: (...args: any[]) => mockChannel(...args),
    removeChannel: mockRemoveChannel,
  },
}));

import { useCategories } from '../../hooks/useCategories';

describe('useCategories', () => {
  const mockCategories = [
    { id: 'cat-1', name: 'Peptides', icon: '💊', sort_order: 1, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
    { id: 'cat-2', name: 'Accessories', icon: '🔧', sort_order: 2, active: true, created_at: '2024-01-01', updated_at: '2024-01-01' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockImplementation(() => createChain({ data: mockCategories, error: null }));
  });

  describe('fetching categories', () => {
    it('fetches active categories on mount', async () => {
      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.categories).toEqual(mockCategories);
      expect(result.current.error).toBeNull();
      expect(mockFrom).toHaveBeenCalledWith('categories');
    });

    it('sets error on fetch failure', async () => {
      mockFrom.mockImplementation(() =>
        createChain({ data: null, error: { message: 'Network error' } })
      );

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.categories).toEqual([]);
    });

    it('returns empty array when no categories exist', async () => {
      mockFrom.mockImplementation(() =>
        createChain({ data: [], error: null })
      );

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.categories).toEqual([]);
    });
  });

  describe('addCategory', () => {
    it('inserts a new category and refetches', async () => {
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount <= 1) return createChain({ data: mockCategories, error: null });
        if (callCount === 2) return createChain({ data: { id: 'cat-3', name: 'New' }, error: null });
        return createChain({ data: [...mockCategories, { id: 'cat-3', name: 'New', icon: '', sort_order: 3, active: true }], error: null });
      });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addCategory({
        name: 'New',
        icon: '',
        sort_order: 3,
        active: true,
      });

      expect(mockInsert).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    it('prevents deletion of category with products', async () => {
      let callCount = 0;
      mockFrom.mockImplementation((table: string) => {
        callCount++;
        if (table === 'products') {
          return createChain({ data: [{ id: 'prod-1' }], error: null });
        }
        return createChain({ data: mockCategories, error: null });
      });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(result.current.deleteCategory('cat-1')).rejects.toThrow(
        'Cannot delete category that contains products'
      );
    });

    it('deletes category when no products reference it', async () => {
      let callCount = 0;
      mockFrom.mockImplementation((table: string) => {
        callCount++;
        if (table === 'products') {
          return createChain({ data: [], error: null });
        }
        return createChain({ data: mockCategories, error: null });
      });

      const { result } = renderHook(() => useCategories());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteCategory('cat-1');
      expect(mockDelete).toHaveBeenCalled();
    });
  });

  describe('real-time subscription', () => {
    it('subscribes to category changes on mount', () => {
      renderHook(() => useCategories());
      expect(mockChannel).toHaveBeenCalledWith('categories-changes');
    });

    it('cleans up subscription on unmount', () => {
      const { unmount } = renderHook(() => useCategories());
      unmount();
      expect(mockRemoveChannel).toHaveBeenCalled();
    });
  });
});
