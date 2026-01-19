/**
 * Mock Activities Data
 * For testing without backend
 * 
 * IMPORTANT: These UUIDs are synchronized with backend/app/db/seed.py
 * Any changes to activities should be made in both files to keep them in sync.
 */

// Fixed UUIDs for activities - MUST match backend/app/db/seed.py
export const ACTIVITY_UUIDS = {
  1: '00000000-0000-4000-a000-000000000001',
  2: '00000000-0000-4000-a000-000000000002',
  3: '00000000-0000-4000-a000-000000000003',
  4: '00000000-0000-4000-a000-000000000004',
  5: '00000000-0000-4000-a000-000000000005',
  6: '00000000-0000-4000-a000-000000000006',
  7: '00000000-0000-4000-a000-000000000007',
  8: '00000000-0000-4000-a000-000000000008',
  9: '00000000-0000-4000-a000-000000000009',
  10: '00000000-0000-4000-a000-000000000010',
  11: '00000000-0000-4000-a000-000000000011',
  12: '00000000-0000-4000-a000-000000000012',
  13: '00000000-0000-4000-a000-000000000013'
}

// Staff point of contact info - matches wyang020@e.ntu.edu.sg in the database
export const STAFF_CONTACT = {
  id: 'staff-poc-001',
  full_name: 'Winston Yang',
  email: 'wyang020@e.ntu.edu.sg',
  phone: '+65 9123 4567'
}

export const mockActivities = [
  {
    id: ACTIVITY_UUIDS[1],
    title: 'Morning Yoga Session',
    description: 'Start your day with gentle stretching and breathing exercises. Perfect for all fitness levels. Bring your own mat or use ours!',
    title_zh: '晨间瑜伽课程',
    title_ms: 'Sesi Yoga Pagi',
    title_ta: 'காலை யோகா அமர்வு',
    description_zh: '以舒缓的伸展和呼吸练习开启美好的一天。适合所有健身水平。您可以自带瑜伽垫，也可以使用我们的！',
    description_ms: 'Mulakan hari anda dengan senaman regangan dan pernafasan yang lembut. Sesuai untuk semua tahap kecergasan. Bawa tikar sendiri atau gunakan tikar kami!',
    description_ta: 'மென்மையான நீட்சி மற்றும் சுவாசப் பயிற்சிகளுடன் உங்கள் நாளைத் தொடங்குங்கள். அனைத்து உடற்தகுதி நிலைகளுக்கும் ஏற்றது. உங்கள் சொந்த பாயை கொண்டு வாருங்கள் அல்லது எங்களுடையதை பயன்படுத்துங்கள்!',
    date: '2026-01-22',
    start_time: '09:00:00',
    end_time: '10:30:00',
    location: 'Main Hall',
    max_capacity: 20,
    current_participants: 12,
    program_type: 'wellness',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[2],
    title: 'Arts & Crafts Workshop',
    description: 'Create beautiful handmade cards and decorations. All materials provided. Great for developing fine motor skills!',
    title_zh: '艺术与手工艺工作坊',
    title_ms: 'Bengkel Seni & Kraftangan',
    title_ta: 'கலை & கைவினைப் பட்டறை',
    description_zh: '制作精美的手工卡片和装饰品。所有材料均已提供。非常适合锻炼精细动作技能！',
    description_ms: 'Cipta kad dan hiasan buatan tangan yang cantik. Semua bahan disediakan. Bagus untuk membangunkan kemahiran motor halus!',
    description_ta: 'அழகான கையால் செய்யப்பட்ட அட்டைகள் மற்றும் அலங்காரங்களை உருவாக்குங்கள். அனைத்து பொருட்களும் வழங்கப்படுகின்றன. நுண்ணிய இயக்கத் திறன்களை வளர்க்க சிறந்தது!',
    date: '2026-01-22',
    start_time: '14:00:00',
    end_time: '16:00:00',
    location: 'Creative Studio',
    max_capacity: 15,
    current_participants: 8,
    program_type: 'arts',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[3],
    title: 'Basketball Practice',
    description: 'Fun basketball drills and friendly games. Coach will be present to guide everyone. Sports shoes required.',
    title_zh: '篮球训练',
    title_ms: 'Latihan Bola Keranjang',
    title_ta: 'கூடைப்பந்து பயிற்சி',
    description_zh: '趣味篮球训练和友谊赛。教练将在场指导。请穿运动鞋。',
    description_ms: 'Latihan bola keranjang yang menyeronokkan dan permainan persahabatan. Jurulatih akan hadir untuk membimbing semua orang. Kasut sukan diperlukan.',
    description_ta: 'வேடிக்கையான கூடைப்பந்து பயிற்சிகள் மற்றும் நட்பு விளையாட்டுகள். அனைவருக்கும் வழிகாட்ட பயிற்சியாளர் இருப்பார். விளையாட்டு காலணிகள் தேவை.',
    date: '2026-01-23',
    start_time: '10:00:00',
    end_time: '12:00:00',
    location: 'Sports Hall',
    max_capacity: 25,
    current_participants: 18,
    program_type: 'sports',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[4],
    title: 'Music Jam Session',
    description: 'Bring your instruments or use ours! Play together, learn new songs, and enjoy making music with friends.',
    title_zh: '音乐即兴演奏会',
    title_ms: 'Sesi Muzik Jam',
    title_ta: 'இசை ஜாம் அமர்வு',
    description_zh: '自带乐器或使用我们的乐器！一起演奏，学习新歌，享受与朋友们一起创作音乐的乐趣。',
    description_ms: 'Bawa alat muzik anda atau gunakan alat muzik kami! Bermain bersama, belajar lagu baru, dan nikmati bermain muzik bersama rakan-rakan.',
    description_ta: 'உங்கள் இசைக்கருவிகளைக் கொண்டு வாருங்கள் அல்லது எங்களுடையதை பயன்படுத்துங்கள்! ஒன்றாக இசையுங்கள், புதிய பாடல்களைக் கற்றுக்கொள்ளுங்கள், நண்பர்களுடன் இசை இசைப்பதை மகிழுங்கள்.',
    date: '2026-01-23',
    start_time: '15:00:00',
    end_time: '17:00:00',
    location: 'Music Room',
    max_capacity: 12,
    current_participants: 10,
    program_type: 'music',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[5],
    title: 'Swimming Lessons',
    description: 'Learn to swim or improve your technique with certified instructors. Swimwear and towel required.',
    title_zh: '游泳课',
    title_ms: 'Pelajaran Berenang',
    title_ta: 'நீச்சல் பாடங்கள்',
    description_zh: '在认证教练的指导下学习游泳或提高游泳技巧。请自备泳衣和毛巾。',
    description_ms: 'Belajar berenang atau tingkatkan teknik anda dengan pengajar bertauliah. Pakaian renang dan tuala diperlukan.',
    description_ta: 'சான்றளிக்கப்பட்ட பயிற்றுவிப்பாளர்களிடம் நீச்சல் கற்றுக்கொள்ளுங்கள் அல்லது உங்கள் நுட்பத்தை மேம்படுத்துங்கள். நீச்சலுடை மற்றும் துண்டு தேவை.',
    date: '2026-01-24',
    start_time: '11:00:00',
    end_time: '12:30:00',
    location: 'Swimming Pool',
    max_capacity: 10,
    current_participants: 10,
    program_type: 'sports',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[6],
    title: 'Cooking Class: Healthy Snacks',
    description: 'Learn to make delicious and nutritious snacks. Take home recipes and samples of what you make!',
    title_zh: '烹饪课：健康零食',
    title_ms: 'Kelas Memasak: Snek Sihat',
    title_ta: 'சமையல் வகுப்பு: ஆரோக்கியமான சிற்றுண்டிகள்',
    description_zh: '学习制作美味又营养的小吃。还能把食谱和自制样品带回家！',
    description_ms: 'Belajar membuat snek yang lazat dan berkhasiat. Bawa pulang resipi dan sampel apa yang anda buat!',
    description_ta: 'சுவையான மற்றும் சத்தான சிற்றுண்டிகளை தயாரிக்க கற்றுக்கொள்ளுங்கள். நீங்கள் செய்ததன் சமையல் குறிப்புகள் மற்றும் மாதிரிகளை வீட்டிற்கு எடுத்துச் செல்லுங்கள்!',
    date: '2026-01-25',
    start_time: '10:00:00',
    end_time: '12:00:00',
    location: 'Kitchen',
    max_capacity: 12,
    current_participants: 7,
    program_type: 'educational',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[7],
    title: 'Dance Party',
    description: 'Move to the beat! Fun dance routines and free dancing. No experience needed, just bring your energy!',
    title_zh: '舞会',
    title_ms: 'Parti Tarian',
    title_ta: 'நடன விருந்து',
    description_zh: '跟着节奏舞动起来！趣味舞蹈编排和自由舞蹈。无需任何经验，只需带上你的活力！',
    description_ms: 'Bergerak mengikut rentak! Rutin tarian yang menyeronokkan dan tarian bebas. Tidak perlu pengalaman, hanya bawa tenaga anda!',
    description_ta: 'தாளத்திற்கு இசையுங்கள்! வேடிக்கையான நடன நடைமுறைகள் மற்றும் இலவச நடனம். அனுபவம் தேவையில்லை, உங்கள் ஆற்றலைக் கொண்டு வாருங்கள்!',
    date: '2026-01-25',
    start_time: '15:00:00',
    end_time: '16:30:00',
    location: 'Main Hall',
    max_capacity: 30,
    current_participants: 22,
    program_type: 'social',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[8],
    title: 'Gardening Workshop',
    description: 'Learn about plants and help maintain our community garden. Get your hands dirty and watch things grow!',
    title_zh: '园艺工作坊',
    title_ms: 'Bengkel Berkebun',
    title_ta: 'தோட்டக்கலை பட்டறை',
    description_zh: '了解植物知识，并帮助维护我们的社区花园。亲自动手，见证植物生长！',
    description_ms: 'Ketahui tentang tumbuhan dan bantu menyelenggara taman komuniti kami. Kotorkan tangan anda dan lihat benda-benda tumbuh!',
    description_ta: 'தாவரங்களைப் பற்றி அறிந்துகொண்டு, எங்கள் சமூகத் தோட்டத்தைப் பராமரிக்க உதவுங்கள். உங்கள் கைகளை அழுக்காக்கி, விஷயங்கள் வளர்வதைப் பாருங்கள்!',
    date: '2026-01-26',
    start_time: '09:00:00',
    end_time: '11:00:00',
    location: 'Garden Area',
    max_capacity: 15,
    current_participants: 9,
    program_type: 'educational',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[9],
    title: 'Movie Afternoon',
    description: 'Watch a fun, feel-good movie together with popcorn and drinks. Voting on movie choice will happen at the start.',
    title_zh: '电影下午',
    title_ms: 'Petang Filem',
    title_ta: 'திரைப்பட மதியம்',
    description_zh: '大家可以一起看一部轻松愉快的电影，配上爆米花和饮料。电影选择将在影片开始时进行投票。',
    description_ms: 'Tonton filem yang menyeronokkan dan menggembirakan bersama-sama dengan popcorn dan minuman. Pengundian pilihan filem akan berlaku pada permulaan.',
    description_ta: 'பாப்கார்ன் மற்றும் பானங்களுடன் சேர்ந்து ஒரு வேடிக்கையான, நன்றாக உணரும் திரைப்படத்தைப் பாருங்கள். திரைப்படத் தேர்வுக்கான வாக்கெடுப்பு தொடக்கத்தில் நடைபெறும்.',
    date: '2026-01-26',
    start_time: '14:00:00',
    end_time: '16:30:00',
    location: 'Theater Room',
    max_capacity: 40,
    current_participants: 28,
    program_type: 'social',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[10],
    title: 'Painting Class',
    description: 'Express yourself through colors! Learn basic painting techniques or create your own masterpiece.',
    title_zh: '绘画课',
    title_ms: 'Kelas Melukis',
    title_ta: 'ஓவிய வகுப்பு',
    description_zh: '用色彩表达自我！学习基础绘画技巧或创作属于你自己的杰作。',
    description_ms: 'Ekspresikan diri anda melalui warna! Pelajari teknik melukis asas atau cipta karya agung anda sendiri.',
    description_ta: 'வண்ணங்கள் மூலம் உங்களை வெளிப்படுத்துங்கள்! அடிப்படை ஓவியத் நுட்பங்களைக் கற்றுக்கொள்ளுங்கள் அல்லது உங்கள் சொந்த தலைசிறந்த படைப்பை உருவாக்குங்கள்.',
    date: '2026-01-27',
    start_time: '10:00:00',
    end_time: '12:00:00',
    location: 'Art Studio',
    max_capacity: 15,
    current_participants: 11,
    program_type: 'arts',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[11],
    title: 'Table Tennis Tournament',
    description: 'Friendly competition for all skill levels. Prizes for winners! Sign up for singles or doubles.',
    title_zh: '乒乓球锦标赛',
    title_ms: 'Kejohanan Tenis Meja',
    title_ta: 'டேபிள் டென்னிஸ் போட்டி',
    description_zh: '适合所有水平的友好比赛。获胜者有奖！报名参加单打或双打。',
    description_ms: 'Pertandingan persahabatan untuk semua peringkat kemahiran. Hadiah untuk pemenang! Daftar untuk perseorangan atau bergu.',
    description_ta: 'அனைத்து திறன் நிலைகளுக்கும் நட்புரீதியான போட்டி. வெற்றியாளர்களுக்கு பரிசுகள்! ஒற்றையர் அல்லது இரட்டையருக்கு பதிவு செய்யுங்கள்.',
    date: '2026-01-28',
    start_time: '14:00:00',
    end_time: '16:00:00',
    location: 'Recreation Room',
    max_capacity: 16,
    current_participants: 14,
    program_type: 'sports',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[12],
    title: 'Mindfulness & Meditation',
    description: 'Calm your mind and reduce stress through guided meditation and mindfulness practices.',
    title_zh: '正念与冥想',
    title_ms: 'Kesedaran & Meditasi',
    title_ta: 'மனநிறைவு & தியானம்',
    description_zh: '通过引导冥想和正念练习来平静你的思绪，减轻压力。',
    description_ms: 'Tenangkan fikiran anda dan kurangkan tekanan melalui meditasi berpandu dan amalan kesedaran.',
    description_ta: 'வழிகாட்டப்பட்ட தியானம் மற்றும் நினைவாற்றல் பயிற்சிகள் மூலம் உங்கள் மனதை அமைதிப்படுத்தி மன அழுத்தத்தைக் குறைக்கவும்.',
    date: '2026-01-29',
    start_time: '09:00:00',
    end_time: '10:00:00',
    location: 'Quiet Room',
    max_capacity: 20,
    current_participants: 13,
    program_type: 'wellness',
    point_of_contact: STAFF_CONTACT
  },
  {
    id: ACTIVITY_UUIDS[13],
    title: 'Board Games Day',
    description: 'A fun day of board games with friends. Chess, Scrabble, Monopoly, and more!',
    title_zh: '桌游日',
    title_ms: 'Hari Permainan Papan',
    title_ta: 'பலகை விளையாட்டு தினம்',
    description_zh: '和朋友们一起玩桌游，度过了愉快的一天。国际象棋、拼字游戏、大富翁等等！',
    description_ms: 'Hari yang menyeronokkan dengan permainan papan bersama rakan-rakan. Catur, Scrabble, Monopoli, dan banyak lagi!',
    description_ta: 'நண்பர்களுடன் பலகை விளையாட்டுகள் விளையாடும் ஒரு வேடிக்கையான நாள். செஸ், ஸ்க்ராபிள், மொனோபோலி, மற்றும் பல!',
    date: '2026-01-15',
    start_time: '14:00:00',
    end_time: '17:00:00',
    location: 'Recreation Room',
    max_capacity: 20,
    current_participants: 18,
    program_type: 'social',
    point_of_contact: STAFF_CONTACT
  }
]

/**
 * Get all activities with optional filtering
 */
export const getActivities = (filters = {}) => {
  let filtered = [...mockActivities]

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      activity =>
        activity.title.toLowerCase().includes(searchLower) ||
        activity.description.toLowerCase().includes(searchLower)
    )
  }

  // Program type filter
  if (filters.program_type && filters.program_type !== 'all') {
    filtered = filtered.filter(activity => activity.program_type === filters.program_type)
  }

  return filtered
}

/**
 * Get single activity by ID
 */
export const getActivityById = (id) => {
  return mockActivities.find(activity => activity.id === id)
}
