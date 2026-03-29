import type { Product, ProductVariation, CartItem } from '../types';

export function createProduct(overrides: Partial<Product> = {}): Product {
  return {
    id: 'prod-1',
    name: 'Test Peptide BPC-157',
    description: 'A test peptide for unit testing',
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
    featured: false,
    image_url: null,
    safety_sheet_url: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    variations: [],
    ...overrides,
  };
}

export function createVariation(overrides: Partial<ProductVariation> = {}): ProductVariation {
  return {
    id: 'var-1',
    product_id: 'prod-1',
    name: '5mg',
    quantity_mg: 5,
    price: 1500,
    discount_price: null,
    discount_active: false,
    stock_quantity: 20,
    created_at: '2024-01-01T00:00:00Z',
    ...overrides,
  };
}

export function createCartItem(overrides: Partial<CartItem> = {}): CartItem {
  const product = createProduct();
  return {
    product,
    quantity: 1,
    price: product.base_price,
    ...overrides,
  };
}
