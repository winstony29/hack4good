-- =============================================================
-- MINDS ActivityHub — Full Demo Seed Script
-- For Jan 31 – Feb 6, 2026 demo
-- Run via: psql "$DIRECT_URL" -f backend/sql/seed_demo.sql
-- =============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==================== SCHEMA ====================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('participant', 'volunteer', 'staff')),
    membership_type VARCHAR(20) CHECK (membership_type IN ('ad_hoc', 'once_weekly', 'twice_weekly', '3_plus')),
    preferred_language VARCHAR(5) DEFAULT 'en',
    phone VARCHAR(20),
    caregiver_phone VARCHAR(20),
    full_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Add wheelchair_required column if missing (model has it, schema doesn't)
ALTER TABLE users ADD COLUMN IF NOT EXISTS wheelchair_required BOOLEAN DEFAULT FALSE;

-- Activities table
CREATE TABLE IF NOT EXISTS activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    max_capacity INTEGER NOT NULL,
    current_participants INTEGER DEFAULT 0,
    program_type VARCHAR(50),
    wheelchair_accessible BOOLEAN DEFAULT TRUE,
    payment_required BOOLEAN DEFAULT FALSE,
    created_by_staff_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Add translation columns if missing
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_zh VARCHAR(255);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_ms VARCHAR(255);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS title_ta VARCHAR(255);
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_zh TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_ms TEXT;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS description_ta TEXT;

-- Registrations table
CREATE TABLE IF NOT EXISTS registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(user_id, activity_id)
);

-- Volunteer matches table
CREATE TABLE IF NOT EXISTS volunteer_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    volunteer_id UUID REFERENCES users(id) ON DELETE CASCADE,
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
    matched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(volunteer_id, activity_id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date);
CREATE INDEX IF NOT EXISTS idx_activities_program_type ON activities(program_type);
CREATE INDEX IF NOT EXISTS idx_activities_created_by ON activities(created_by_staff_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_activity ON registrations(activity_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_matches_volunteer ON volunteer_matches(volunteer_id);
CREATE INDEX IF NOT EXISTS idx_volunteer_matches_activity ON volunteer_matches(activity_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Only create triggers if they don't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_users_updated_at') THEN
        CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_activities_updated_at') THEN
        CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_registrations_updated_at') THEN
        CREATE TRIGGER update_registrations_updated_at BEFORE UPDATE ON registrations
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_volunteer_matches_updated_at') THEN
        CREATE TRIGGER update_volunteer_matches_updated_at BEFORE UPDATE ON volunteer_matches
            FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- ==================== SEED USERS ====================
-- These UUIDs will be used to link to Supabase Auth users (created via API)
-- The hashed_password is bcrypt of "Demo2026!" — but actual auth goes through Supabase Auth

INSERT INTO users (id, email, hashed_password, role, membership_type, preferred_language, phone, caregiver_phone, full_name, wheelchair_required)
VALUES
  -- Participant: Alex Chen
  ('00000000-0000-4000-b000-000000000001', 'participant@minds.demo',
   '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
   'participant', 'once_weekly', 'en', '+65 9123 4567', '+65 9876 5432', 'Alex Chen', FALSE),

  -- More participants (matching mock data users)
  ('00000000-0000-4000-b000-000000000002', 'jane.smith@minds.demo',
   '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
   'participant', 'twice_weekly', 'en', '+65 9234 5678', NULL, 'Jane Smith', FALSE),

  ('00000000-0000-4000-b000-000000000003', 'michael.chen@minds.demo',
   '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
   'participant', 'ad_hoc', 'zh', '+65 9345 6789', '+65 8234 5678', 'Michael Chen', TRUE),

  ('00000000-0000-4000-b000-000000000004', 'sarah.lee@minds.demo',
   '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
   'participant', 'once_weekly', 'en', '+65 9456 7890', NULL, 'Sarah Lee', FALSE),

  ('00000000-0000-4000-b000-000000000005', 'david.kumar@minds.demo',
   '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
   'participant', '3_plus', 'en', '+65 9567 8901', '+65 8345 6789', 'David Kumar', FALSE),

  -- Volunteer: David Tan
  ('00000000-0000-4000-b000-000000000010', 'volunteer@minds.demo',
   '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
   'volunteer', NULL, 'en', '+65 8123 4567', NULL, 'David Tan', FALSE),

  -- Staff: Sarah Wong
  ('00000000-0000-4000-b000-000000000020', 'staff@minds.demo',
   '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
   'staff', NULL, 'en', '+65 8234 5678', NULL, 'Sarah Wong', FALSE)
ON CONFLICT (email) DO UPDATE SET
  role = EXCLUDED.role,
  membership_type = EXCLUDED.membership_type,
  full_name = EXCLUDED.full_name,
  phone = EXCLUDED.phone,
  caregiver_phone = EXCLUDED.caregiver_phone,
  preferred_language = EXCLUDED.preferred_language,
  wheelchair_required = EXCLUDED.wheelchair_required;

-- Also ensure wyang020@e.ntu.edu.sg exists as staff (existing user)
INSERT INTO users (id, email, hashed_password, role, full_name)
VALUES ('00000000-0000-4000-b000-000000000021', 'wyang020@e.ntu.edu.sg',
        '$2b$12$LJ3m4ys3Lx0YpXQvKjQpXOqJ5VYNqOPFgKsZmT3RZjMDBx5NRHT6K',
        'staff', 'Winston Yang')
ON CONFLICT (email) DO NOTHING;

-- ==================== SEED ACTIVITIES ====================
-- Dates: Jan 31 – Feb 6, 2026 (matching frontend mock data exactly)

INSERT INTO activities (id, title, description, date, start_time, end_time, location, max_capacity, current_participants, program_type, wheelchair_accessible, payment_required, title_zh, title_ms, title_ta, description_zh, description_ms, description_ta, created_by_staff_id, created_at)
VALUES
  ('00000000-0000-4000-a000-000000000001', 'Morning Yoga Session',
   'Start your day with gentle stretching and breathing exercises. Perfect for all fitness levels. Bring your own mat or use ours!',
   '2026-01-31', '09:00:00', '10:30:00', 'Main Hall', 20, 12, 'wellness', TRUE, FALSE,
   '晨间瑜伽课程', 'Sesi Yoga Pagi', 'காலை யோகா அமர்வு',
   '以舒缓的伸展和呼吸练习开启美好的一天。适合所有健身水平。您可以自带瑜伽垫，也可以使用我们的！',
   'Mulakan hari anda dengan senaman regangan dan pernafasan yang lembut. Sesuai untuk semua tahap kecergasan. Bawa tikar sendiri atau gunakan tikar kami!',
   'மென்மையான நீட்சி மற்றும் சுவாசப் பயிற்சிகளுடன் உங்கள் நாளைத் தொடங்குங்கள். அனைத்து உடற்தகுதி நிலைகளுக்கும் ஏற்றது.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000002', 'Arts & Crafts Workshop',
   'Create beautiful handmade cards and decorations. All materials provided. Great for developing fine motor skills!',
   '2026-01-31', '14:00:00', '16:00:00', 'Creative Studio', 15, 8, 'arts', TRUE, FALSE,
   '艺术与手工艺工作坊', 'Bengkel Seni & Kraftangan', 'கலை & கைவினைப் பட்டறை',
   '制作精美的手工卡片和装饰品。所有材料均已提供。非常适合锻炼精细动作技能！',
   'Cipta kad dan hiasan buatan tangan yang cantik. Semua bahan disediakan. Bagus untuk membangunkan kemahiran motor halus!',
   'அழகான கையால் செய்யப்பட்ட அட்டைகள் மற்றும் அலங்காரங்களை உருவாக்குங்கள்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000003', 'Basketball Practice',
   'Fun basketball drills and friendly games. Coach will be present to guide everyone. Sports shoes required.',
   '2026-02-01', '10:00:00', '12:00:00', 'Sports Hall', 25, 18, 'sports', FALSE, FALSE,
   '篮球训练', 'Latihan Bola Keranjang', 'கூடைப்பந்து பயிற்சி',
   '趣味篮球训练和友谊赛。教练将在场指导。请穿运动鞋。',
   'Latihan bola keranjang yang menyeronokkan dan permainan persahabatan. Jurulatih akan hadir untuk membimbing semua orang.',
   'வேடிக்கையான கூடைப்பந்து பயிற்சிகள் மற்றும் நட்பு விளையாட்டுகள்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000004', 'Music Jam Session',
   'Bring your instruments or use ours! Play together, learn new songs, and enjoy making music with friends.',
   '2026-02-01', '15:00:00', '17:00:00', 'Music Room', 12, 10, 'music', TRUE, FALSE,
   '音乐即兴演奏会', 'Sesi Muzik Jam', 'இசை ஜாம் அமர்வு',
   '自带乐器或使用我们的乐器！一起演奏，学习新歌，享受与朋友们一起创作音乐的乐趣。',
   'Bawa alat muzik anda atau gunakan alat muzik kami! Bermain bersama, belajar lagu baru.',
   'உங்கள் இசைக்கருவிகளைக் கொண்டு வாருங்கள் அல்லது எங்களுடையதை பயன்படுத்துங்கள்!',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000005', 'Swimming Lessons',
   'Learn to swim or improve your technique with certified instructors. Swimwear and towel required.',
   '2026-02-02', '11:00:00', '12:30:00', 'Swimming Pool', 10, 10, 'sports', TRUE, TRUE,
   '游泳课', 'Pelajaran Berenang', 'நீச்சல் பாடங்கள்',
   '在认证教练的指导下学习游泳或提高游泳技巧。请自备泳衣和毛巾。',
   'Belajar berenang atau tingkatkan teknik anda dengan pengajar bertauliah.',
   'சான்றளிக்கப்பட்ட பயிற்றுவிப்பாளர்களிடம் நீச்சல் கற்றுக்கொள்ளுங்கள்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000006', 'Cooking Class: Healthy Snacks',
   'Learn to make delicious and nutritious snacks. Take home recipes and samples of what you make!',
   '2026-02-03', '10:00:00', '12:00:00', 'Kitchen', 12, 7, 'educational', TRUE, TRUE,
   '烹饪课：健康零食', 'Kelas Memasak: Snek Sihat', 'சமையல் வகுப்பு: ஆரோக்கியமான சிற்றுண்டிகள்',
   '学习制作美味又营养的小吃。还能把食谱和自制样品带回家！',
   'Belajar membuat snek yang lazat dan berkhasiat. Bawa pulang resipi dan sampel apa yang anda buat!',
   'சுவையான மற்றும் சத்தான சிற்றுண்டிகளை தயாரிக்க கற்றுக்கொள்ளுங்கள்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000007', 'Dance Party',
   'Move to the beat! Fun dance routines and free dancing. No experience needed, just bring your energy!',
   '2026-02-03', '15:00:00', '16:30:00', 'Main Hall', 30, 22, 'social', TRUE, FALSE,
   '舞会', 'Parti Tarian', 'நடன விருந்து',
   '跟着节奏舞动起来！趣味舞蹈编排和自由舞蹈。无需任何经验，只需带上你的活力！',
   'Bergerak mengikut rentak! Rutin tarian yang menyeronokkan dan tarian bebas.',
   'தாளத்திற்கு இசையுங்கள்! வேடிக்கையான நடன நடைமுறைகள் மற்றும் இலவச நடனம்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000008', 'Gardening Workshop',
   'Learn about plants and help maintain our community garden. Get your hands dirty and watch things grow!',
   '2026-02-04', '09:00:00', '11:00:00', 'Garden Area', 15, 9, 'educational', FALSE, FALSE,
   '园艺工作坊', 'Bengkel Berkebun', 'தோட்டக்கலை பட்டறை',
   '了解植物知识，并帮助维护我们的社区花园。亲自动手，见证植物生长！',
   'Ketahui tentang tumbuhan dan bantu menyelenggara taman komuniti kami.',
   'தாவரங்களைப் பற்றி அறிந்துகொண்டு, எங்கள் சமூகத் தோட்டத்தைப் பராமரிக்க உதவுங்கள்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000009', 'Movie Afternoon',
   'Watch a fun, feel-good movie together with popcorn and drinks. Voting on movie choice will happen at the start.',
   '2026-02-04', '14:00:00', '16:30:00', 'Theater Room', 40, 28, 'social', TRUE, FALSE,
   '电影下午', 'Petang Filem', 'திரைப்பட மதியம்',
   '大家可以一起看一部轻松愉快的电影，配上爆米花和饮料。',
   'Tonton filem yang menyeronokkan dan menggembirakan bersama-sama dengan popcorn dan minuman.',
   'பாப்கார்ன் மற்றும் பானங்களுடன் சேர்ந்து ஒரு வேடிக்கையான திரைப்படத்தைப் பாருங்கள்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000010', 'Painting Class',
   'Express yourself through colors! Learn basic painting techniques or create your own masterpiece.',
   '2026-02-05', '10:00:00', '12:00:00', 'Art Studio', 15, 11, 'arts', TRUE, TRUE,
   '绘画课', 'Kelas Melukis', 'ஓவிய வகுப்பு',
   '用色彩表达自我！学习基础绘画技巧或创作属于你自己的杰作。',
   'Ekspresikan diri anda melalui warna! Pelajari teknik melukis asas atau cipta karya agung anda sendiri.',
   'வண்ணங்கள் மூலம் உங்களை வெளிப்படுத்துங்கள்!',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000011', 'Table Tennis Tournament',
   'Friendly competition for all skill levels. Prizes for winners! Sign up for singles or doubles.',
   '2026-02-05', '14:00:00', '16:00:00', 'Recreation Room', 16, 14, 'sports', TRUE, FALSE,
   '乒乓球锦标赛', 'Kejohanan Tenis Meja', 'டேபிள் டென்னிஸ் போட்டி',
   '适合所有水平的友好比赛。获胜者有奖！报名参加单打或双打。',
   'Pertandingan persahabatan untuk semua peringkat kemahiran. Hadiah untuk pemenang!',
   'அனைத்து திறன் நிலைகளுக்கும் நட்புரீதியான போட்டி.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000012', 'Mindfulness & Meditation',
   'Calm your mind and reduce stress through guided meditation and mindfulness practices.',
   '2026-02-06', '09:00:00', '10:00:00', 'Quiet Room', 20, 13, 'wellness', TRUE, FALSE,
   '正念与冥想', 'Kesedaran & Meditasi', 'மனநிறைவு & தியானம்',
   '通过引导冥想和正念练习来平静你的思绪，减轻压力。',
   'Tenangkan fikiran anda dan kurangkan tekanan melalui meditasi berpandu dan amalan kesedaran.',
   'வழிகாட்டப்பட்ட தியானம் மற்றும் நினைவாற்றல் பயிற்சிகள் மூலம் மன அழுத்தத்தைக் குறைக்கவும்.',
   '00000000-0000-4000-b000-000000000020', NOW()),

  ('00000000-0000-4000-a000-000000000013', 'Board Games Day',
   'A fun day of board games with friends. Chess, Scrabble, Monopoly, and more!',
   '2026-02-06', '14:00:00', '17:00:00', 'Recreation Room', 20, 18, 'social', TRUE, FALSE,
   '桌游日', 'Hari Permainan Papan', 'பலகை விளையாட்டு தினம்',
   '和朋友们一起玩桌游。国际象棋、拼字游戏、大富翁等等！',
   'Hari yang menyeronokkan dengan permainan papan bersama rakan-rakan. Catur, Scrabble, Monopoli!',
   'நண்பர்களுடன் பலகை விளையாட்டுகள் விளையாடும் ஒரு வேடிக்கையான நாள்.',
   '00000000-0000-4000-b000-000000000020', NOW())
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
  title_zh = EXCLUDED.title_zh,
  title_ms = EXCLUDED.title_ms,
  title_ta = EXCLUDED.title_ta,
  description_zh = EXCLUDED.description_zh,
  description_ms = EXCLUDED.description_ms,
  description_ta = EXCLUDED.description_ta,
  created_by_staff_id = EXCLUDED.created_by_staff_id,
  updated_at = NOW();

-- ==================== SEED REGISTRATIONS ====================
-- Matches mock data from registrations.mock.js
-- user-1=Alex Chen (b001), user-2=Jane Smith (b002), user-3=Michael Chen (b003),
-- user-4=Sarah Lee (b004), user-5=David Kumar (b005)

-- Clear old registrations first to avoid conflicts
DELETE FROM registrations WHERE user_id IN (
  '00000000-0000-4000-b000-000000000001',
  '00000000-0000-4000-b000-000000000002',
  '00000000-0000-4000-b000-000000000003',
  '00000000-0000-4000-b000-000000000004',
  '00000000-0000-4000-b000-000000000005'
);

INSERT INTO registrations (id, user_id, activity_id, status, created_at) VALUES
  -- Morning Yoga (Activity 1) — Jan 31
  ('00000000-0000-4000-c000-000000000001', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000001', 'confirmed', '2026-01-27T08:00:00Z'),
  ('00000000-0000-4000-c000-000000000002', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000001', 'confirmed', '2026-01-27T09:30:00Z'),
  ('00000000-0000-4000-c000-000000000003', '00000000-0000-4000-b000-000000000004', '00000000-0000-4000-a000-000000000001', 'confirmed', '2026-01-28T10:00:00Z'),

  -- Arts & Crafts (Activity 2) — Jan 31
  ('00000000-0000-4000-c000-000000000004', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000002', 'confirmed', '2026-01-27T11:00:00Z'),
  ('00000000-0000-4000-c000-000000000005', '00000000-0000-4000-b000-000000000004', '00000000-0000-4000-a000-000000000002', 'confirmed', '2026-01-28T11:00:00Z'),
  ('00000000-0000-4000-c000-000000000006', '00000000-0000-4000-b000-000000000005', '00000000-0000-4000-a000-000000000002', 'confirmed', '2026-01-28T14:00:00Z'),

  -- Basketball Practice (Activity 3) — Feb 1
  ('00000000-0000-4000-c000-000000000007', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000003', 'confirmed', '2026-01-28T09:00:00Z'),
  ('00000000-0000-4000-c000-000000000008', '00000000-0000-4000-b000-000000000005', '00000000-0000-4000-a000-000000000003', 'confirmed', '2026-01-28T10:00:00Z'),

  -- Music Jam (Activity 4) — Feb 1
  ('00000000-0000-4000-c000-000000000009', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000004', 'confirmed', '2026-01-29T08:00:00Z'),
  ('00000000-0000-4000-c000-000000000010', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000004', 'confirmed', '2026-01-29T09:00:00Z'),

  -- Swimming (Activity 5) — Feb 2
  ('00000000-0000-4000-c000-000000000011', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000005', 'confirmed', '2026-01-28T10:00:00Z'),
  ('00000000-0000-4000-c000-000000000012', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000005', 'confirmed', '2026-01-28T10:30:00Z'),
  ('00000000-0000-4000-c000-000000000013', '00000000-0000-4000-b000-000000000004', '00000000-0000-4000-a000-000000000005', 'confirmed', '2026-01-29T08:00:00Z'),

  -- Cooking Class (Activity 6) — Feb 3
  ('00000000-0000-4000-c000-000000000014', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000006', 'confirmed', '2026-01-29T11:00:00Z'),
  ('00000000-0000-4000-c000-000000000015', '00000000-0000-4000-b000-000000000005', '00000000-0000-4000-a000-000000000006', 'confirmed', '2026-01-29T12:00:00Z'),

  -- Dance Party (Activity 7) — Feb 3
  ('00000000-0000-4000-c000-000000000016', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000007', 'confirmed', '2026-01-29T14:00:00Z'),
  ('00000000-0000-4000-c000-000000000017', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000007', 'confirmed', '2026-01-29T15:00:00Z'),

  -- Gardening (Activity 8) — Feb 4
  ('00000000-0000-4000-c000-000000000018', '00000000-0000-4000-b000-000000000002', '00000000-0000-4000-a000-000000000008', 'confirmed', '2026-01-30T08:00:00Z'),
  ('00000000-0000-4000-c000-000000000019', '00000000-0000-4000-b000-000000000004', '00000000-0000-4000-a000-000000000008', 'confirmed', '2026-01-30T09:00:00Z'),

  -- Movie Afternoon (Activity 9) — Feb 4
  ('00000000-0000-4000-c000-000000000020', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000009', 'confirmed', '2026-01-30T10:00:00Z'),
  ('00000000-0000-4000-c000-000000000021', '00000000-0000-4000-b000-000000000005', '00000000-0000-4000-a000-000000000009', 'confirmed', '2026-01-30T10:30:00Z'),

  -- Painting Class (Activity 10) — Feb 5
  ('00000000-0000-4000-c000-000000000022', '00000000-0000-4000-b000-000000000003', '00000000-0000-4000-a000-000000000010', 'confirmed', '2026-01-30T11:00:00Z'),

  -- Table Tennis (Activity 11) — Feb 5
  ('00000000-0000-4000-c000-000000000023', '00000000-0000-4000-b000-000000000001', '00000000-0000-4000-a000-000000000011', 'confirmed', '2026-01-30T12:00:00Z'),
  ('00000000-0000-4000-c000-000000000024', '00000000-0000-4000-b000-000000000005', '00000000-0000-4000-a000-000000000011', 'confirmed', '2026-01-30T12:30:00Z')
ON CONFLICT (user_id, activity_id) DO UPDATE SET
  status = EXCLUDED.status;

-- ==================== SEED VOLUNTEER MATCHES ====================
-- Volunteer: David Tan (b010) — matches mock data

DELETE FROM volunteer_matches WHERE volunteer_id = '00000000-0000-4000-b000-000000000010';

INSERT INTO volunteer_matches (id, volunteer_id, activity_id, status, matched_at) VALUES
  ('00000000-0000-4000-d000-000000000001', '00000000-0000-4000-b000-000000000010', '00000000-0000-4000-a000-000000000001', 'confirmed', '2026-01-27T10:00:00Z'),
  ('00000000-0000-4000-d000-000000000002', '00000000-0000-4000-b000-000000000010', '00000000-0000-4000-a000-000000000003', 'confirmed', '2026-01-28T09:00:00Z'),
  ('00000000-0000-4000-d000-000000000003', '00000000-0000-4000-b000-000000000010', '00000000-0000-4000-a000-000000000005', 'confirmed', '2026-01-28T14:00:00Z'),
  ('00000000-0000-4000-d000-000000000004', '00000000-0000-4000-b000-000000000010', '00000000-0000-4000-a000-000000000007', 'confirmed', '2026-01-29T11:00:00Z'),
  ('00000000-0000-4000-d000-000000000005', '00000000-0000-4000-b000-000000000010', '00000000-0000-4000-a000-000000000010', 'confirmed', '2026-01-30T08:00:00Z')
ON CONFLICT (volunteer_id, activity_id) DO UPDATE SET
  status = EXCLUDED.status;

-- ==================== VERIFY ====================

SELECT '=== USERS ===' AS section;
SELECT id, email, role, full_name, membership_type FROM users ORDER BY role, email;

SELECT '=== ACTIVITIES ===' AS section;
SELECT id, title, date, start_time, location, program_type, current_participants || '/' || max_capacity AS capacity
FROM activities ORDER BY date, start_time;

SELECT '=== REGISTRATIONS ===' AS section;
SELECT r.id, u.full_name, a.title, a.date, r.status
FROM registrations r
JOIN users u ON r.user_id = u.id
JOIN activities a ON r.activity_id = a.id
ORDER BY a.date, a.start_time, u.full_name;

SELECT '=== VOLUNTEER MATCHES ===' AS section;
SELECT vm.id, u.full_name, a.title, a.date, vm.status
FROM volunteer_matches vm
JOIN users u ON vm.volunteer_id = u.id
JOIN activities a ON vm.activity_id = a.id
ORDER BY a.date, a.start_time;

SELECT '=== COUNTS ===' AS section;
SELECT
  (SELECT COUNT(*) FROM users) AS total_users,
  (SELECT COUNT(*) FROM activities) AS total_activities,
  (SELECT COUNT(*) FROM registrations) AS total_registrations,
  (SELECT COUNT(*) FROM volunteer_matches) AS total_volunteer_matches;
