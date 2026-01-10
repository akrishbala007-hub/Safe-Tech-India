-- Add new columns to products table for Safe Tech India overhaul

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS safe_tech_price DECIMAL(10, 2),
ADD COLUMN IF NOT EXISTS inspection_data JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS trust_metrics JSONB DEFAULT '{}'::jsonb;

-- specific columns if preferred over JSONB for sorting, but JSONB is flexible for the 30 points.
-- We will Store the 30-point checklist in `inspection_data`
-- And the Trust Summary (Battery Health, SSD Life, etc) in `trust_metrics`

-- Example of trust_metrics structure:
-- {
--   "battery_health": "92%",
--   "ssd_life": "98% Remaining",
--   "display_audit": "Zero Dead Pixels",
--   "thermal_audit": "Stable @ 65°C"
-- }

-- Example of inspection_data structure:
-- {
--   "physical_cosmetic": { "body_integrity": true, "hinge_tension": true, ... },
--   "display_visuals": { "dead_pixels": true, ... },
--   ...
-- }
