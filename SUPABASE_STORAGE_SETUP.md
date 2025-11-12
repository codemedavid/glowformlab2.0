# 📦 Supabase Storage Setup for Image Uploads

## 🎯 Quick Setup Guide

To enable image uploads in your admin dashboard, you need to create storage buckets in Supabase.

---

## 🗂️ **Storage Buckets Needed**

### **1. For Product Images:**
- Bucket Name: `menu-images`
- Purpose: Store product/peptide images

### **2. For COA Lab Reports:**
- Bucket Name: `coa-images`
- Purpose: Store Janoshik lab report images

---

## 📋 **How to Create Storage Buckets**

### **Step 1: Go to Supabase Dashboard**
1. Visit: https://supabase.com/dashboard
2. Select your project
3. Click **"Storage"** in the left sidebar

### **Step 2: Create First Bucket (menu-images)**
1. Click **"New bucket"** button
2. Enter name: `menu-images`
3. Toggle **"Public bucket"** to ON (important!)
4. Click **"Create bucket"**

### **Step 3: Create Second Bucket (coa-images)**
1. Click **"New bucket"** button again
2. Enter name: `coa-images`
3. Toggle **"Public bucket"** to ON (important!)
4. Click **"Create bucket"**

---

## ✅ **After Setup**

Once you've created both buckets, you can:

### **✨ Upload COA Images Directly in Admin:**
1. Go to `/admin` → Lab Reports (COA)
2. Click "Add COA Report"
3. Click the upload area or "Choose File" button
4. Select your Janoshik test report image
5. Image uploads automatically to Supabase!

### **📸 Upload Product Images:**
1. Go to `/admin` → Manage Products
2. Add or edit a product
3. Click the image upload area
4. Select product image
5. Uploads automatically!

---

## 🚀 **How It Works Now**

### **Before (Manual):**
❌ Save file to `/public/coa/` folder manually
❌ Enter file path manually
❌ Not user-friendly

### **After (Automatic):**
✅ Click "Choose File" button
✅ Select your image
✅ Automatic upload to Supabase Storage
✅ Image URL saved automatically
✅ Beautiful preview shows instantly
✅ Delete with one click

---

## 💡 **Alternative: Manual Method**

If you prefer NOT to use Supabase Storage, you can still:

1. **Save images to `/public/coa/` folder**
2. **Use path format:** `/coa/filename.jpg`
3. **Or use external URLs** from Imgur, Cloudinary, etc.

The upload field supports all three methods!

---

## 🔒 **Bucket Settings**

Make sure both buckets are set to **Public**:
- This allows customers to view images on your website
- Images are publicly accessible via URL
- No authentication needed for viewing

---

## 🎨 **Your New Upload Experience**

### **Beautiful Upload Interface:**
- ✨ Large drag-and-drop area
- 💙 Cute sky blue theme
- 📊 Upload progress bar
- 🖼️ Instant image preview
- ❌ Easy remove button
- 🎯 Both file upload AND URL paste options

---

## ⚠️ **Important Notes**

- Maximum file size: **5MB**
- Supported formats: **JPG, PNG, WebP, GIF**
- Recommended: High-resolution scans for COA reports
- Images are automatically optimized and cached

---

## ✅ **Setup Complete!**

After creating the 2 storage buckets, your admin dashboard will have **full drag-and-drop image upload** functionality! 🎉

No more manual file management needed! 💙✨

