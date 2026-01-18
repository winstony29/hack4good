/**
 * Quick Reference: Expected Backend API Structure
 * For MINDS ActivityHub - Activities Flow
 * 
 * This file documents the expected API responses for the frontend to work correctly.
 */

// ============================================================================
// ACTIVITIES API
// ============================================================================

/**
 * GET /api/activities
 * Query params: ?search=text&program_type=sports&upcoming=true
 */
const getActivitiesResponse = {
  data: [
    {
      id: "uuid",
      title: "Morning Yoga",
      description: "Relaxing yoga session",
      date: "2026-01-20", // YYYY-MM-DD format
      start_time: "09:00:00", // HH:MM:SS format
      end_time: "10:30:00",
      location: "Main Hall",
      max_capacity: 20,
      current_participants: 15,
      program_type: "wellness", // sports | arts | music | social | educational | wellness
      created_at: "2026-01-01T00:00:00Z",
      updated_at: "2026-01-01T00:00:00Z"
    }
  ]
}

/**
 * GET /api/activities/:id
 */
const getActivityByIdResponse = {
  data: {
    id: "uuid",
    title: "Morning Yoga",
    description: "Relaxing yoga session",
    date: "2026-01-20",
    start_time: "09:00:00",
    end_time: "10:30:00",
    location: "Main Hall",
    max_capacity: 20,
    current_participants: 15,
    program_type: "wellness"
  }
}

/**
 * POST /api/activities
 * (Staff only)
 */
const createActivityRequest = {
  title: "Morning Yoga",
  description: "Relaxing yoga session",
  date: "2026-01-20",
  start_time: "09:00:00",
  end_time: "10:30:00",
  location: "Main Hall",
  max_capacity: 20,
  program_type: "wellness"
}

// ============================================================================
// REGISTRATIONS API
// ============================================================================

/**
 * GET /api/registrations
 * Returns registrations for the authenticated user
 */
const getRegistrationsResponse = {
  data: [
    {
      id: "uuid",
      user_id: "uuid",
      activity_id: "uuid",
      status: "confirmed", // confirmed | cancelled | waitlist
      created_at: "2026-01-15T00:00:00Z",
      updated_at: "2026-01-15T00:00:00Z"
    }
  ]
}

/**
 * POST /api/registrations
 * Create a new registration for authenticated user
 */
const createRegistrationRequest = {
  activity_id: "uuid",
  status: "confirmed" // Optional, defaults to 'confirmed'
}

const createRegistrationResponse = {
  data: {
    id: "uuid",
    user_id: "uuid", // From auth token
    activity_id: "uuid",
    status: "confirmed",
    created_at: "2026-01-18T00:00:00Z"
  }
}

/**
 * DELETE /api/registrations/:id
 * Cancel a registration
 */
const cancelRegistrationResponse = {
  message: "Registration cancelled successfully"
}

// ============================================================================
// USER PROFILE STRUCTURE (from Supabase Auth)
// ============================================================================

/**
 * user.user_metadata structure
 * This comes from Supabase auth.getUser() or session.user
 */
const userMetadata = {
  role: "participant", // participant | volunteer | staff
  membership_type: "once_weekly", // ad_hoc | once_weekly | twice_weekly | 3_plus
  full_name: "John Doe",
  phone: "+65 9123 4567",
  caregiver_phone: "+65 9876 5432",
  preferred_language: "en", // en | zh | ms | ta
  // Accessibility preferences (handled by Person 3)
  font_size_preference: "medium",
  high_contrast: false
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

/**
 * Standard error response format
 */
const errorResponse = {
  detail: "Human-readable error message",
  code: "ERROR_CODE", // Optional
  field: "field_name" // Optional, for validation errors
}

// Common error cases:
const errors = {
  // Activity full
  activityFull: {
    status: 400,
    detail: "This activity is full"
  },
  
  // Already registered
  alreadyRegistered: {
    status: 400,
    detail: "You are already registered for this activity"
  },
  
  // Time conflict (optional - can be handled frontend-only)
  timeConflict: {
    status: 400,
    detail: "This activity conflicts with another registration"
  },
  
  // Unauthorized
  unauthorized: {
    status: 401,
    detail: "Authentication required"
  },
  
  // Not found
  notFound: {
    status: 404,
    detail: "Activity not found"
  }
}

// ============================================================================
// BACKEND RECOMMENDATIONS
// ============================================================================

/**
 * Suggested backend validations (on top of frontend validation):
 * 
 * 1. Check activity capacity before registration
 * 2. Prevent duplicate registrations (UNIQUE constraint on user_id, activity_id)
 * 3. Update activity.current_participants count (trigger or manual)
 * 4. Verify user has permission to register (based on role)
 * 5. Check that activity.date is in the future
 * 
 * Optional (can be frontend-only for MVP):
 * - Time conflict detection
 * - Membership limit validation
 * - Waitlist management
 */

// ============================================================================
// DATABASE TRIGGERS (Recommended)
// ============================================================================

/**
 * SQL Trigger: Update current_participants count
 * 
 * CREATE OR REPLACE FUNCTION update_activity_participant_count()
 * RETURNS TRIGGER AS $$
 * BEGIN
 *   IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
 *     UPDATE activities 
 *     SET current_participants = current_participants + 1 
 *     WHERE id = NEW.activity_id;
 *   ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
 *     UPDATE activities 
 *     SET current_participants = current_participants - 1 
 *     WHERE id = OLD.activity_id;
 *   ELSIF TG_OP = 'UPDATE' THEN
 *     IF OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
 *       UPDATE activities 
 *       SET current_participants = current_participants - 1 
 *       WHERE id = NEW.activity_id;
 *     ELSIF OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
 *       UPDATE activities 
 *       SET current_participants = current_participants + 1 
 *       WHERE id = NEW.activity_id;
 *     END IF;
 *   END IF;
 *   RETURN NEW;
 * END;
 * $$ LANGUAGE plpgsql;
 * 
 * CREATE TRIGGER registration_participant_count
 * AFTER INSERT OR UPDATE OR DELETE ON registrations
 * FOR EACH ROW EXECUTE FUNCTION update_activity_participant_count();
 */

// ============================================================================
// SUPABASE RLS POLICIES (If using direct Supabase queries)
// ============================================================================

/**
 * Note: Activities Lead is NOT responsible for RLS policies.
 * This is handled by Person 1 (Auth Lead).
 * 
 * For reference only:
 * 
 * Activities table:
 * - SELECT: Public (everyone can view)
 * - INSERT/UPDATE/DELETE: Staff only
 * 
 * Registrations table:
 * - SELECT: Own registrations only (user_id = auth.uid())
 * - INSERT: Authenticated users (sets user_id = auth.uid())
 * - UPDATE/DELETE: Own registrations only
 */

export {
  getActivitiesResponse,
  getActivityByIdResponse,
  getRegistrationsResponse,
  createRegistrationRequest,
  userMetadata,
  errors
}
