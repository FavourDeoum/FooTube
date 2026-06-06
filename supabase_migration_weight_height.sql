-- ============================================================
-- Migration: Add weight and height columns to profiles table
-- Run this in your Supabase SQL Editor
-- ============================================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS weight NUMERIC(5, 1),  -- kg, e.g. 70.5
  ADD COLUMN IF NOT EXISTS height NUMERIC(5, 1);  -- cm, e.g. 175.0

-- Optional: Add a comment explaining usage
COMMENT ON COLUMN profiles.weight IS 'User body weight in kilograms, used for BMI-based food recommendations';
COMMENT ON COLUMN profiles.height IS 'User height in centimeters, used for BMI-based food recommendations';
