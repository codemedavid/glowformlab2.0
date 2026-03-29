import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';

const mockUpload = vi.fn();
const mockGetPublicUrl = vi.fn();
const mockRemove = vi.fn();
const mockList = vi.fn();

vi.mock('../../lib/supabase', () => ({
  supabase: {
    storage: {
      from: vi.fn(() => ({
        upload: mockUpload,
        getPublicUrl: mockGetPublicUrl,
        remove: mockRemove,
        list: mockList,
      })),
    },
  },
}));

import { useImageUpload } from '../../hooks/useImageUpload';

function createFile(name: string, size: number, type: string): File {
  const buffer = new ArrayBuffer(size);
  return new File([buffer], name, { type });
}

describe('useImageUpload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });

    // Default successful responses
    mockList.mockResolvedValue({ data: [], error: null });
    mockUpload.mockResolvedValue({ data: { path: 'test-file.jpg' }, error: null });
    mockGetPublicUrl.mockReturnValue({
      data: { publicUrl: 'https://test.supabase.co/storage/v1/object/public/menu-images/test-file.jpg' },
    });
    mockRemove.mockResolvedValue({ data: null, error: null });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('initial state', () => {
    it('starts with uploading=false and progress=0', () => {
      const { result } = renderHook(() => useImageUpload());
      expect(result.current.uploading).toBe(false);
      expect(result.current.uploadProgress).toBe(0);
    });
  });

  describe('file validation', () => {
    it('rejects non-image files', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createFile('document.pdf', 1000, 'application/pdf');

      await expect(
        act(() => result.current.uploadImage(file))
      ).rejects.toThrow(/valid image file/i);
    });

    it('rejects files that are too small (likely empty)', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createFile('tiny.jpg', 50, 'image/jpeg');

      await expect(
        act(() => result.current.uploadImage(file))
      ).rejects.toThrow(/invalid or empty/i);
    });

    it('rejects files over 10MB', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createFile('huge.jpg', 11 * 1024 * 1024, 'image/jpeg');

      await expect(
        act(() => result.current.uploadImage(file))
      ).rejects.toThrow(/less than 10MB/i);
    });

    it('accepts valid image extensions', async () => {
      const { result } = renderHook(() => useImageUpload());

      const extensions = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      for (const ext of extensions) {
        const file = createFile(`image.${ext}`, 1000, `image/${ext === 'jpg' ? 'jpeg' : ext}`);

        const url = await act(() => result.current.uploadImage(file));
        expect(url).toContain('https://');
      }
    });

    it('accepts files with empty MIME type but valid extension (mobile gallery)', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createFile('photo.heic', 1000, '');

      const url = await act(() => result.current.uploadImage(file));
      expect(url).toContain('https://');
    });
  });

  describe('upload flow', () => {
    it('uploads file and returns public URL', async () => {
      const { result } = renderHook(() => useImageUpload());
      const file = createFile('photo.jpg', 5000, 'image/jpeg');

      const url = await act(() => result.current.uploadImage(file));

      expect(url).toBe('https://test.supabase.co/storage/v1/object/public/menu-images/test-file.jpg');
      expect(mockUpload).toHaveBeenCalled();
    });

    it('uses custom folder/bucket', async () => {
      const { result } = renderHook(() => useImageUpload('payment-proofs'));
      const file = createFile('proof.jpg', 5000, 'image/jpeg');

      await act(() => result.current.uploadImage(file));

      const { supabase } = await import('../../lib/supabase');
      expect(supabase.storage.from).toHaveBeenCalledWith('payment-proofs');
    });

    it('throws when bucket does not exist', async () => {
      mockList.mockResolvedValue({ data: null, error: { message: 'Bucket not found' } });

      const { result } = renderHook(() => useImageUpload());
      const file = createFile('photo.jpg', 5000, 'image/jpeg');

      await expect(
        act(() => result.current.uploadImage(file))
      ).rejects.toThrow(/not found/i);
    });

    it('throws when upload fails', async () => {
      mockUpload.mockResolvedValue({
        data: null,
        error: { message: 'row-level security violation', statusCode: 403 },
      });

      const { result } = renderHook(() => useImageUpload());
      const file = createFile('photo.jpg', 5000, 'image/jpeg');

      await expect(
        act(() => result.current.uploadImage(file))
      ).rejects.toThrow(/policy error/i);
    });

    it('throws when upload returns no data', async () => {
      mockUpload.mockResolvedValue({ data: null, error: null });

      const { result } = renderHook(() => useImageUpload());
      const file = createFile('photo.jpg', 5000, 'image/jpeg');

      await expect(
        act(() => result.current.uploadImage(file))
      ).rejects.toThrow(/No data returned/i);
    });
  });

  describe('deleteImage', () => {
    it('extracts filename from URL and removes from storage', async () => {
      const { result } = renderHook(() => useImageUpload());

      await act(async () => {
        await result.current.deleteImage('https://test.supabase.co/storage/v1/object/public/menu-images/12345-abc.jpg');
      });

      expect(mockRemove).toHaveBeenCalledWith(['12345-abc.jpg']);
    });

    it('throws when deletion fails', async () => {
      mockRemove.mockResolvedValue({ data: null, error: new Error('Delete failed') });

      const { result } = renderHook(() => useImageUpload());

      await expect(
        act(() => result.current.deleteImage('https://example.com/file.jpg'))
      ).rejects.toThrow();
    });
  });
});
