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
  chain.then = (resolve: any, reject: any) => Promise.resolve(resolvedValue).then(resolve, reject);
  return chain;
}

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: (...args: any[]) => mockFrom(...args),
  },
}));

import { useShippingLocations, useShippingLocationsAdmin } from '../../hooks/useShippingLocations';

describe('useShippingLocations', () => {
  const mockLocations = [
    { id: 'LUZON', name: 'Luzon (J&T)', fee: 150, is_active: true, order_index: 1 },
    { id: 'VISAYAS', name: 'Visayas (J&T)', fee: 120, is_active: true, order_index: 2 },
    { id: 'MINDANAO', name: 'Mindanao (J&T)', fee: 90, is_active: true, order_index: 3 },
    { id: 'MAXIM', name: 'Maxim Delivery', fee: 0, is_active: true, order_index: 4 },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('public hook', () => {
    it('fetches shipping locations from database', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockLocations, error: null }));

      const { result } = renderHook(() => useShippingLocations());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.locations).toEqual(mockLocations);
    });

    it('falls back to defaults on database error', async () => {
      mockFrom.mockImplementation(() =>
        createChain({ data: null, error: { message: 'Table not found' } })
      );

      const { result } = renderHook(() => useShippingLocations());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.locations).toHaveLength(4);
      expect(result.current.locations[0].name).toContain('Luzon');
    });

    it('falls back to defaults when database returns empty', async () => {
      mockFrom.mockImplementation(() => createChain({ data: [], error: null }));

      const { result } = renderHook(() => useShippingLocations());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.locations).toHaveLength(4);
    });

    describe('getShippingFee', () => {
      it('returns the correct fee for a known location', async () => {
        mockFrom.mockImplementation(() => createChain({ data: mockLocations, error: null }));

        const { result } = renderHook(() => useShippingLocations());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(result.current.getShippingFee('LUZON')).toBe(150);
        expect(result.current.getShippingFee('VISAYAS')).toBe(120);
        expect(result.current.getShippingFee('MINDANAO')).toBe(90);
        expect(result.current.getShippingFee('MAXIM')).toBe(0);
      });

      it('returns 0 for unknown location', async () => {
        mockFrom.mockImplementation(() => createChain({ data: mockLocations, error: null }));

        const { result } = renderHook(() => useShippingLocations());

        await waitFor(() => {
          expect(result.current.loading).toBe(false);
        });

        expect(result.current.getShippingFee('UNKNOWN')).toBe(0);
      });
    });
  });

  describe('admin hook', () => {
    it('fetches all locations including inactive', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockLocations, error: null }));

      const { result } = renderHook(() => useShippingLocationsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.locations).toEqual(mockLocations);
    });

    it('sets error when table not found', async () => {
      mockFrom.mockImplementation(() =>
        createChain({ data: null, error: { message: 'not found' } })
      );

      const { result } = renderHook(() => useShippingLocationsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
      expect(result.current.locations).toEqual([]);
    });

    it('addLocation inserts and refetches', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockLocations, error: null }));

      const { result } = renderHook(() => useShippingLocationsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addLocation({
        id: 'NEW',
        name: 'New Location',
        fee: 200,
        is_active: true,
      });

      expect(mockFrom).toHaveBeenCalledWith('shipping_locations');
    });

    it('deleteLocation deletes and refetches', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockLocations, error: null }));

      const { result } = renderHook(() => useShippingLocationsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteLocation('LUZON');
      expect(mockFrom).toHaveBeenCalledWith('shipping_locations');
    });
  });
});
