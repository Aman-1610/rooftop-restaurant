-- Add new columns to the settings table
ALTER TABLE settings 
ADD COLUMN IF NOT EXISTS navbar_title text,
ADD COLUMN IF NOT EXISTS email text DEFAULT 'hello@rooftoprestaurant.com',
ADD COLUMN IF NOT EXISTS opening_hours text DEFAULT 'Daily: 4 PM - 11 PM',
ADD COLUMN IF NOT EXISTS social_instagram text,
ADD COLUMN IF NOT EXISTS social_facebook text,
ADD COLUMN IF NOT EXISTS google_maps_link text;

-- Update the existing row with default values if they are null
UPDATE settings 
SET 
  navbar_title = COALESCE(navbar_title, restaurant_name),
  email = COALESCE(email, 'hello@rooftoprestaurant.com'),
  opening_hours = COALESCE(opening_hours, 'Daily: 4 PM - 11 PM')
WHERE id = 1;
