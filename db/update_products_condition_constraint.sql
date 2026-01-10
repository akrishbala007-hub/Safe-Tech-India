-- Remove the restrictive check constraint on product condition
ALTER TABLE products 
DROP CONSTRAINT IF EXISTS products_condition_check;

-- Optionally, you can add a new constraint with the updated values if you want to maintain data integrity,
-- or just leave it without a check constraint to allow flexibility.
-- For now, we are just removing it to allow the new "Grade A+" values.
