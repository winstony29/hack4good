/**
 * Mock Activities Data
 * For testing without backend
 */

export const mockActivities = [
  {
    id: '1',
    title: 'Morning Yoga Session',
    description: 'Start your day with gentle stretching and breathing exercises. Perfect for all fitness levels. Bring your own mat or use ours!',
    date: '2026-01-22',
    start_time: '09:00:00',
    end_time: '10:30:00',
    location: 'Main Hall',
    max_capacity: 20,
    current_participants: 12,
    program_type: 'wellness'
  },
  {
    id: '2',
    title: 'Arts & Crafts Workshop',
    description: 'Create beautiful handmade cards and decorations. All materials provided. Great for developing fine motor skills!',
    date: '2026-01-22',
    start_time: '14:00:00',
    end_time: '16:00:00',
    location: 'Creative Studio',
    max_capacity: 15,
    current_participants: 8,
    program_type: 'arts'
  },
  {
    id: '3',
    title: 'Basketball Practice',
    description: 'Fun basketball drills and friendly games. Coach will be present to guide everyone. Sports shoes required.',
    date: '2026-01-23',
    start_time: '10:00:00',
    end_time: '12:00:00',
    location: 'Sports Hall',
    max_capacity: 25,
    current_participants: 18,
    program_type: 'sports'
  },
  {
    id: '4',
    title: 'Music Jam Session',
    description: 'Bring your instruments or use ours! Play together, learn new songs, and enjoy making music with friends.',
    date: '2026-01-23',
    start_time: '15:00:00',
    end_time: '17:00:00',
    location: 'Music Room',
    max_capacity: 12,
    current_participants: 10,
    program_type: 'music'
  },
  {
    id: '5',
    title: 'Swimming Lessons',
    description: 'Learn to swim or improve your technique with certified instructors. Swimwear and towel required.',
    date: '2026-01-24',
    start_time: '11:00:00',
    end_time: '12:30:00',
    location: 'Swimming Pool',
    max_capacity: 10,
    current_participants: 10,
    program_type: 'sports'
  },
  {
    id: '6',
    title: 'Cooking Class: Healthy Snacks',
    description: 'Learn to make delicious and nutritious snacks. Take home recipes and samples of what you make!',
    date: '2026-01-25',
    start_time: '10:00:00',
    end_time: '12:00:00',
    location: 'Kitchen',
    max_capacity: 12,
    current_participants: 7,
    program_type: 'educational'
  },
  {
    id: '7',
    title: 'Dance Party',
    description: 'Move to the beat! Fun dance routines and free dancing. No experience needed, just bring your energy!',
    date: '2026-01-25',
    start_time: '15:00:00',
    end_time: '16:30:00',
    location: 'Main Hall',
    max_capacity: 30,
    current_participants: 22,
    program_type: 'social'
  },
  {
    id: '8',
    title: 'Gardening Workshop',
    description: 'Learn about plants and help maintain our community garden. Get your hands dirty and watch things grow!',
    date: '2026-01-26',
    start_time: '09:00:00',
    end_time: '11:00:00',
    location: 'Garden Area',
    max_capacity: 15,
    current_participants: 9,
    program_type: 'educational'
  },
  {
    id: '9',
    title: 'Movie Afternoon',
    description: 'Watch a fun, feel-good movie together with popcorn and drinks. Voting on movie choice will happen at the start.',
    date: '2026-01-26',
    start_time: '14:00:00',
    end_time: '16:30:00',
    location: 'Theater Room',
    max_capacity: 40,
    current_participants: 28,
    program_type: 'social'
  },
  {
    id: '10',
    title: 'Painting Class',
    description: 'Express yourself through colors! Learn basic painting techniques or create your own masterpiece.',
    date: '2026-01-27',
    start_time: '10:00:00',
    end_time: '12:00:00',
    location: 'Art Studio',
    max_capacity: 15,
    current_participants: 11,
    program_type: 'arts'
  },
  {
    id: '11',
    title: 'Table Tennis Tournament',
    description: 'Friendly competition for all skill levels. Prizes for winners! Sign up for singles or doubles.',
    date: '2026-01-28',
    start_time: '14:00:00',
    end_time: '16:00:00',
    location: 'Recreation Room',
    max_capacity: 16,
    current_participants: 14,
    program_type: 'sports'
  },
  {
    id: '12',
    title: 'Mindfulness & Meditation',
    description: 'Calm your mind and reduce stress through guided meditation and mindfulness practices.',
    date: '2026-01-29',
    start_time: '09:00:00',
    end_time: '10:00:00',
    location: 'Quiet Room',
    max_capacity: 20,
    current_participants: 13,
    program_type: 'wellness'
  },
  {
    id: '13',
    title: 'Past Activity: Board Games Day',
    description: 'A fun day of board games (already completed)',
    date: '2026-01-15',
    start_time: '14:00:00',
    end_time: '17:00:00',
    location: 'Recreation Room',
    max_capacity: 20,
    current_participants: 18,
    program_type: 'social'
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
