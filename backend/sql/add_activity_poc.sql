-- Migration: Add Point of Contact (POC) to activities table
-- This adds a reference to the staff member who created the activity

-- Add the new column
ALTER TABLE activities 
ADD COLUMN IF NOT EXISTS created_by_staff_id UUID REFERENCES users(id) ON DELETE SET NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by_staff_id);

-- Update existing activities to set POC (optional - only if you want to assign POC to existing activities)
-- You can run this after the column is added if needed:
-- UPDATE activities SET created_by_staff_id = (SELECT id FROM users WHERE role = 'staff' LIMIT 1) WHERE created_by_staff_id IS NULL;
