-- Seed Activities for Supabase
-- Run this in the Supabase SQL Editor to populate activities
-- 
-- IMPORTANT: These UUIDs are synchronized with:
--   - backend/app/db/seed.py
--   - frontend/src/mocks/activities.mock.js
-- Any changes to activities should be made in all three files.

-- First, add the new columns if they don't exist
ALTER TABLE activities ADD COLUMN IF NOT EXISTS wheelchair_accessible BOOLEAN DEFAULT TRUE;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS payment_required BOOLEAN DEFAULT FALSE;

-- Use UPSERT to insert or update activities
INSERT INTO activities (id, title, description, date, start_time, end_time, location, max_capacity, current_participants, program_type, wheelchair_accessible, payment_required, created_by_staff_id, created_at)
VALUES
  ('00000000-0000-4000-a000-000000000001', 'Morning Yoga Session', 'Start your day with gentle stretching and breathing exercises. Perfect for all fitness levels. Bring your own mat or use ours!', '2026-01-22', '09:00:00', '10:30:00', 'Main Hall', 20, 12, 'wellness', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000002', 'Arts & Crafts Workshop', 'Create beautiful handmade cards and decorations. All materials provided. Great for developing fine motor skills!', '2026-01-22', '14:00:00', '16:00:00', 'Creative Studio', 15, 8, 'arts', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000003', 'Basketball Practice', 'Fun basketball drills and friendly games. Coach will be present to guide everyone. Sports shoes required.', '2026-01-23', '10:00:00', '12:00:00', 'Sports Hall', 25, 18, 'sports', FALSE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000004', 'Music Jam Session', 'Bring your instruments or use ours! Play together, learn new songs, and enjoy making music with friends.', '2026-01-23', '15:00:00', '17:00:00', 'Music Room', 12, 10, 'music', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000005', 'Swimming Lessons', 'Learn to swim or improve your technique with certified instructors. Swimwear and towel required.', '2026-01-24', '11:00:00', '12:30:00', 'Swimming Pool', 10, 10, 'sports', TRUE, TRUE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000006', 'Cooking Class: Healthy Snacks', 'Learn to make delicious and nutritious snacks. Take home recipes and samples of what you make!', '2026-01-25', '10:00:00', '12:00:00', 'Kitchen', 12, 7, 'educational', TRUE, TRUE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000007', 'Dance Party', 'Move to the beat! Fun dance routines and free dancing. No experience needed, just bring your energy!', '2026-01-25', '15:00:00', '16:30:00', 'Main Hall', 30, 22, 'social', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000008', 'Gardening Workshop', 'Learn about plants and help maintain our community garden. Get your hands dirty and watch things grow!', '2026-01-26', '09:00:00', '11:00:00', 'Garden Area', 15, 9, 'educational', FALSE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000009', 'Movie Afternoon', 'Watch a fun, feel-good movie together with popcorn and drinks. Voting on movie choice will happen at the start.', '2026-01-26', '14:00:00', '16:30:00', 'Theater Room', 40, 28, 'social', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000010', 'Painting Class', 'Express yourself through colors! Learn basic painting techniques or create your own masterpiece.', '2026-01-27', '10:00:00', '12:00:00', 'Art Studio', 15, 11, 'arts', TRUE, TRUE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000011', 'Table Tennis Tournament', 'Friendly competition for all skill levels. Prizes for winners! Sign up for singles or doubles.', '2026-01-28', '14:00:00', '16:00:00', 'Recreation Room', 16, 14, 'sports', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000012', 'Mindfulness & Meditation', 'Calm your mind and reduce stress through guided meditation and mindfulness practices.', '2026-01-29', '09:00:00', '10:00:00', 'Quiet Room', 20, 13, 'wellness', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW()),
  ('00000000-0000-4000-a000-000000000013', 'Board Games Day', 'A fun day of board games with friends. Chess, Scrabble, Monopoly, and more!', '2026-01-15', '14:00:00', '17:00:00', 'Recreation Room', 20, 18, 'social', TRUE, FALSE, (SELECT id FROM users WHERE email = 'wyang020@e.ntu.edu.sg'), NOW())
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  date = EXCLUDED.date,
  start_time = EXCLUDED.start_time,
  end_time = EXCLUDED.end_time,
  location = EXCLUDED.location,
  max_capacity = EXCLUDED.max_capacity,
  current_participants = EXCLUDED.current_participants,
  program_type = EXCLUDED.program_type,
  wheelchair_accessible = EXCLUDED.wheelchair_accessible,
  payment_required = EXCLUDED.payment_required,
  created_by_staff_id = EXCLUDED.created_by_staff_id,
  updated_at = NOW();

-- Verify the seed
SELECT a.id, a.title, a.date, a.start_time, a.location, a.program_type, a.wheelchair_accessible, a.payment_required, u.email as created_by
FROM activities a
LEFT JOIN users u ON a.created_by_staff_id = u.id
ORDER BY a.date, a.start_time;
