import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';

const mockFrom = vi.fn();

function createChain(resolvedValue: any = { data: [], error: null }) {
  const chain: any = {};
  chain.select = vi.fn().mockReturnValue(chain);
  chain.update = vi.fn().mockReturnValue(chain);
  chain.upsert = vi.fn().mockReturnValue(chain);
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

import { useSiteSettings } from '../../hooks/useSiteSettings';

describe('useSiteSettings', () => {
  const mockSettingsData = [
    { id: 'site_name', value: 'Peptide Pulse', type: 'string', description: null, updated_at: '2024-01-01' },
    { id: 'site_description', value: 'Test description', type: 'string', description: null, updated_at: '2024-01-01' },
    { id: 'hero_badge_text', value: 'Test Badge', type: 'string', description: null, updated_at: '2024-01-01' },
    { id: 'hero_title_highlight', value: 'Glow', type: 'string', description: null, updated_at: '2024-01-01' },
    { id: 'hero_accent_color', value: 'purple-500', type: 'string', description: null, updated_at: '2024-01-01' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockImplementation(() => createChain({ data: mockSettingsData, error: null }));
  });

  describe('fetching settings', () => {
    it('fetches and transforms site settings on mount', async () => {
      const { result } = renderHook(() => useSiteSettings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.siteSettings).toBeTruthy();
      expect(result.current.siteSettings!.site_name).toBe('Peptide Pulse');
      expect(result.current.siteSettings!.hero_badge_text).toBe('Test Badge');
      expect(result.current.siteSettings!.hero_accent_color).toBe('purple-500');
    });

    it('uses default values for missing settings', async () => {
      mockFrom.mockImplementation(() => createChain({ data: [], error: null }));

      const { result } = renderHook(() => useSiteSettings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.siteSettings!.site_name).toBe('Glowform Lab');
      expect(result.current.siteSettings!.currency).toBe('PHP');
    });

    it('sets error on fetch failure', async () => {
      mockFrom.mockImplementation(() =>
        createChain({ data: null, error: new Error('DB error') })
      );

      const { result } = renderHook(() => useSiteSettings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBeTruthy();
    });
  });

  describe('updateSiteSetting', () => {
    it('updates a single setting and refetches', async () => {
      const { result } = renderHook(() => useSiteSettings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.updateSiteSetting('site_name', 'New Name');
      expect(mockFrom).toHaveBeenCalledWith('site_settings');
    });

    it('throws on update failure', async () => {
      let callCount = 0;
      mockFrom.mockImplementation(() => {
        callCount++;
        if (callCount > 1) {
          return createChain({ data: null, error: new Error('Update failed') });
        }
        return createChain({ data: mockSettingsData, error: null });
      });

      const { result } = renderHook(() => useSiteSettings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await expect(
        result.current.updateSiteSetting('site_name', 'New')
      ).rejects.toThrow();
    });
  });

  describe('updateSiteSettings (bulk)', () => {
    it('upserts multiple settings', async () => {
      const { result } = renderHook(() => useSiteSettings());

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      await result.current.updateSiteSettings({
        site_name: 'Updated Name',
        hero_badge_text: 'Updated Badge',
      });

      expect(mockFrom).toHaveBeenCalledWith('site_settings');
    });
  });
});
