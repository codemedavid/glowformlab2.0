# 📦 Product Size Variations Setup Guide

This guide explains how to manage product size variations for your peptide business.

---

## 🎯 Overview

Your peptide products can now have multiple size options (e.g., 2mg, 5mg, 10mg, 20mg) with different prices for each size. Customers will see a "Select Size:" dropdown on products that have variations.

---

## ✅ PART 1: Quick SQL Setup (Do This First!)

### Step 1: Apply the Migration

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Open the file: `supabase/migrations/20250112000001_add_all_product_variations.sql`
4. Copy all the SQL code
5. Paste it into the SQL Editor
6. Click **Run**

This will add 3 size options (2mg, 5mg, 10mg) for all your peptides:
- **2mg** = 80% of base price (lower price)
- **5mg** = 100% of base price (standard)
- **10mg** = 180% of base price (higher price)

**Example:**
If a product's base price is ₱1,000:
- 2mg = ₱800
- 5mg = ₱1,000
- 10mg = ₱1,800

---

## 🎨 PART 2: Using the Variation Manager UI

### Accessing the Variation Manager

1. Log into **Admin Dashboard** (`/admin`)
2. Go to **Products** section
3. Find any product in the list
4. Click the **purple Layers icon** (📑) button
5. The Variation Manager popup will open

### Features

#### View Current Sizes
- See all size variations for the product
- View name, quantity (mg), price, and stock for each size
- Empty state shows if no variations exist

#### Add New Size
1. Click **"Add New Size"** button
2. Fill in the form:
   - **Size Name**: e.g., "20mg", "30mg" (required)
   - **Quantity (mg)**: Numeric amount (required)
   - **Price (₱)**: Price for this size (required)
   - **Stock Quantity**: Number of units available (required)
3. Click **"Save Variation"**
4. Success! The new size is now available

#### Delete a Size
1. Find the size you want to remove
2. Click the red **trash icon** (🗑️)
3. Confirm deletion
4. The size is removed

---

## 📊 Product List Indicators

In the Admin Products list, you'll see:
- **"Sizes"** column showing the count of variations (e.g., "3" means 3 size options)
- **Purple Layers icon** to manage sizes
- **Teal Edit icon** to edit product details
- **Red Trash icon** to delete product

---

## 🛍️ Customer Experience

When customers browse products:

### Products WITHOUT Variations
- Show single price
- "Add to Cart" button directly

### Products WITH Variations
- Show "Select Size:" dropdown
- List all available sizes with prices
- Must select a size before adding to cart
- Selected size name appears in cart

---

## 💡 Best Practices

### Pricing Strategy
1. **2mg** - Entry level (80% of base price)
2. **5mg** - Standard (100% of base price) 
3. **10mg** - Premium (180% of base price)
4. **20mg** - Bulk (320% of base price)

### Naming Convention
- Use consistent format: "2mg", "5mg", "10mg"
- Avoid: "2 mg", "2MG", "small"
- Be clear and simple

### Stock Management
- Update stock for each size separately
- Set realistic quantities
- Monitor popular sizes

---

## 🔧 Advanced: Manual SQL Commands

### Add a Custom Variation
```sql
-- Get the product ID first
SELECT id, name FROM products WHERE name = 'BPC-157';

-- Add new variation
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
VALUES 
('paste-product-id-here', '20mg', 20.0, 1200.00, 50);
```

### Update Variation Price
```sql
UPDATE product_variations 
SET price = 1500.00 
WHERE product_id = 'product-id' AND name = '10mg';
```

### Delete a Variation
```sql
DELETE FROM product_variations 
WHERE product_id = 'product-id' AND name = '2mg';
```

### Add Variations for Multiple Products
```sql
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT id, '20mg', 20.0, base_price * 3.2, 30 FROM products WHERE category = 'healing'
UNION ALL
SELECT id, '30mg', 30.0, base_price * 4.5, 20 FROM products WHERE category = 'healing';
```

---

## ❓ Troubleshooting

### "Select Size" not showing?
- Check if product has variations in database
- Run the SQL migration first
- Refresh the products page

### Can't delete a variation?
- Make sure no orders exist with that variation
- Check if you have proper permissions

### Prices not updating?
- Clear browser cache
- Refresh the admin dashboard
- Verify changes in Supabase

---

## 📝 Summary

**For Immediate Setup:**
1. ✅ Run SQL migration in Supabase (`20250112000001_add_all_product_variations.sql`)
2. ✅ Refresh your website
3. ✅ All products now have 2mg, 5mg, 10mg options!

**For Future Management:**
- Use the **Admin Dashboard → Products → Layers Icon (📑)**
- Add, view, or delete sizes through the UI
- No SQL knowledge needed!

---

## 🎉 Done!

Your customers can now choose their preferred peptide sizes when ordering!

**Need help?** Check the Admin Dashboard or run SQL queries in Supabase.

