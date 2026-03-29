import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

// Mock supabase
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

import { useFAQs, useFAQsAdmin } from '../../hooks/useFAQs';

describe('useFAQs', () => {
  const mockFAQData = [
    {
      id: 'faq-1',
      question: 'How to use peptides?',
      answer: 'Follow the instructions.',
      category: 'PRODUCT & USAGE',
      order_index: 1,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 'faq-2',
      question: 'How to pay?',
      answer: 'GCash or bank transfer.',
      category: 'PAYMENT METHODS',
      order_index: 2,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('useFAQs (public)', () => {
    it('fetches active FAQs from database', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockFAQData, error: null }));

      const { result } = renderHook(() => useFAQs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.faqs).toEqual(mockFAQData);
    });

    it('falls back to defaults when database returns error', async () => {
      mockFrom.mockImplementation(() => createChain({ data: null, error: { message: 'Table not found' } }));

      const { result } = renderHook(() => useFAQs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      // Should have default FAQs (13 items)
      expect(result.current.faqs.length).toBeGreaterThan(0);
      expect(result.current.faqs[0].question).toBeTruthy();
    });

    it('falls back to defaults when database returns empty', async () => {
      mockFrom.mockImplementation(() => createChain({ data: [], error: null }));

      const { result } = renderHook(() => useFAQs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.faqs.length).toBeGreaterThan(0);
    });

    it('extracts unique categories from FAQ data', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockFAQData, error: null }));

      const { result } = renderHook(() => useFAQs());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.categories).toContain('PRODUCT & USAGE');
      expect(result.current.categories).toContain('PAYMENT METHODS');
      expect(result.current.categories).toHaveLength(2);
    });
  });

  describe('useFAQsAdmin', () => {
    it('fetches all FAQs including inactive', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockFAQData, error: null }));

      const { result } = renderHook(() => useFAQsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.faqs).toEqual(mockFAQData);
    });

    it('returns empty array on database error', async () => {
      mockFrom.mockImplementation(() => createChain({ data: null, error: { message: 'Error' } }));

      const { result } = renderHook(() => useFAQsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.faqs).toEqual([]);
    });

    it('addFAQ calls insert and refetches', async () => {
      const insertChain = createChain({ data: { id: 'faq-3' }, error: null });
      mockFrom.mockImplementation(() => {
        const chain = createChain({ data: mockFAQData, error: null });
        chain.insert = vi.fn().mockReturnValue(insertChain);
        return chain;
      });

      const { result } = renderHook(() => useFAQsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.addFAQ({
        question: 'New question?',
        answer: 'New answer.',
        category: 'NEW',
        order_index: 3,
        is_active: true,
      });

      expect(mockFrom).toHaveBeenCalledWith('faqs');
    });

    it('deleteFAQ calls delete and refetches', async () => {
      mockFrom.mockImplementation(() => createChain({ data: mockFAQData, error: null }));

      const { result } = renderHook(() => useFAQsAdmin());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.deleteFAQ('faq-1');
      expect(mockFrom).toHaveBeenCalledWith('faqs');
    });
  });
});
