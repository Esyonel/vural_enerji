-- Migration: Add SEO columns to products table
-- Version: 1.0.0
-- Date: 2025-12-17

-- Add SEO-related columns to products table
ALTER TABLE products ADD COLUMN seo_title TEXT;
ALTER TABLE products ADD COLUMN seo_description TEXT;
ALTER TABLE products ADD COLUMN seo_keywords TEXT;
ALTER TABLE products ADD COLUMN slug TEXT UNIQUE;

-- Add description and brand columns for better SEO
ALTER TABLE products ADD COLUMN description TEXT;
ALTER TABLE products ADD COLUMN brand TEXT;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- Update existing products with default SEO values
UPDATE products 
SET 
    seo_title = name || ' - Vural Enerji',
    seo_description = 'Kaliteli ' || name || ' ürününü Vural Enerji''den satın alın.',
    seo_keywords = name || ', ' || category || ', güneş enerjisi, solar panel',
    slug = LOWER(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(name, ' ', '-'), 'ç', 'c'), 'ğ', 'g'), 'ı', 'i'), 'ö', 'o'), 'ş', 's'))
WHERE seo_title IS NULL;
