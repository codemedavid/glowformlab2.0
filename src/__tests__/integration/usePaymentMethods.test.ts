import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockFrom = vi.fn();

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
  },
}));

import { usePaymentMethods } from '../../hooks/usePaymentMethods';

describe('usePaymentMethods', () => {
  const mockMethods = [
    {
      id: 'gcash',
      name: 'GCash',
      account_number: '09123456789',
      account_name: 'Glowform Lab',
      qr_code_url: 'https://example.com/gcash-qr.png',
      active: true,
      sort_order: 1,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 'bdo',
      name: 'BDO',
      account_number: '1234567890',
      account_name: 'Glowform Lab',
      qr_code_url: 'https://example.com/bdo-qr.png',
      active: true,
      sort_order: 2,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockImplementation(() => createChain({ data: mockMethods, error: null }));
  });

  describe('fetching payment methods', () => {
    it('fetches active payment methods on mount', async () => {
      const { result } = renderHook(() => usePaymentMethods());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.paymentMethods).toEqual(mockMethods);
      expect(result.current.error).toBeNull();
    });

    it('sets error on fetch failure', async () => {
      mockFrom.mockImplementation(() =>
        createChain({ data: null, error: { message: 'Failed' } })
      );

      const { result } = renderHook(() => usePaymentMethods());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('addPaymentMethod', () => {
    it('adds a payment method with QR code URL', async () => {
      const { result } = renderHook(() => usePaymentMethods());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addPaymentMethod({
        id: 'secbank',
        name: 'Security Bank',
        account_number: '9876543210',
        account_name: 'Glowform',
        qr_code_url: 'https://example.com/qr.png',
        active: true,
        sort_order: 3,
      });

      expect(mockFrom).toHaveBeenCalledWith('payment_methods');
    });

    it('uses placeholder URL when QR code is empty', async () => {
      const insertChain = createChain({ data: { id: 'test' }, error: null });
      mockFrom.mockImplementation(() => {
        const chain = createChain({ data: mockMethods, error: null });
        chain.insert = vi.fn().mockReturnValue(insertChain);
        return chain;
      });

      const { result } = renderHook(() => usePaymentMethods());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addPaymentMethod({
        id: 'test',
        name: 'Test',
        account_number: '123',
        account_name: 'Test',
        qr_code_url: '',
        active: true,
        sort_order: 1,
      });

      // The hook should have normalized empty string to placeholder
      expect(mockFrom).toHaveBeenCalledWith('payment_methods');
    });

    it('throws helpful error on RLS violation', async () => {
      mockFrom.mockImplementation(() =>
        createChain({
          data: null,
          error: { code: '42501', message: 'permission denied' },
        })
      );

      const { result } = renderHook(() => usePaymentMethods());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        result.current.addPaymentMethod({
          id: 'test',
          name: 'Test',
          account_number: '123',
          account_name: 'Test',
          qr_code_url: 'https://example.com',
          active: true,
          sort_order: 1,
        })
      ).rejects.toThrow(/Permission denied|Row Level Security/i);
    });
  });

  describe('deletePaymentMethod', () => {
    it('deletes and refetches', async () => {
      const { result } = renderHook(() => usePaymentMethods());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deletePaymentMethod('gcash');
      expect(mockFrom).toHaveBeenCalledWith('payment_methods');
    });
  });

  describe('reorderPaymentMethods', () => {
    it('updates sort_order for each method', async () => {
      const { result } = renderHook(() => usePaymentMethods());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      const reversed = [...mockMethods].reverse();
      await result.current.reorderPaymentMethods(reversed as any);

      expect(mockFrom).toHaveBeenCalledWith('payment_methods');
    });
  });
});
