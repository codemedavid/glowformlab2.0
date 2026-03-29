import { vi } from 'vitest';

// Chainable query builder mock
function createQueryBuilder(resolvedValue: { data: any; error: any } = { data: [], error: null }) {
  const builder: any = {};
  const methods = [
    'select', 'insert', 'update', 'delete', 'upsert',
    'eq', 'neq', 'gt', 'lt', 'gte', 'lte',
    'like', 'ilike', 'is', 'in',
    'order', 'limit', 'range', 'single',
    'maybeSingle', 'csv', 'filter',
  ];

  methods.forEach(method => {
    builder[method] = vi.fn().mockReturnValue(builder);
  });

  // Terminal methods that return the resolved value
  builder.then = vi.fn((resolve: any) => resolve(resolvedValue));
  // Make it thenable (works with await)
  Object.defineProperty(builder, 'then', {
    value: (resolve: any, reject: any) => {
      return Promise.resolve(resolvedValue).then(resolve, reject);
    },
  });

  return builder;
}

// Create a reusable mock for supabase.from()
export function createSupabaseMock(overrides: Record<string, { data: any; error: any }> = {}) {
  const defaultResponse = { data: [], error: null };

  const fromMock = vi.fn((table: string) => {
    const response = overrides[table] || defaultResponse;
    return createQueryBuilder(response);
  });

  const channelMock = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnValue({ unsubscribe: vi.fn() }),
  };

  const storageMock = {
    from: vi.fn(() => ({
      upload: vi.fn().mockResolvedValue({ data: { path: 'test-file.jpg' }, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/storage/test-file.jpg' } }),
      remove: vi.fn().mockResolvedValue({ data: null, error: null }),
      list: vi.fn().mockResolvedValue({ data: [], error: null }),
    })),
  };

  return {
    from: fromMock,
    channel: vi.fn().mockReturnValue(channelMock),
    removeChannel: vi.fn(),
    storage: storageMock,
    rpc: vi.fn().mockResolvedValue({ data: null, error: null }),
  };
}

// Default mock instance
export const mockSupabase = createSupabaseMock();
