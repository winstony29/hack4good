#!/usr/bin/env bash
# =============================================================
# MINDS ActivityHub — Full Demo Seed Runner
# Creates Supabase Auth users + seeds DB via psql
#
# Usage:
#   cd hack4good
#   chmod +x seed_demo.sh
#   ./seed_demo.sh
#
# Prerequisites:
#   - psql installed (sudo apt-get install -y postgresql-client)
#   - backend/.env with SUPABASE_SERVICE_KEY and DIRECT_URL
# =============================================================

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/backend/.env"

# Load env vars
if [ ! -f "$ENV_FILE" ]; then
    echo "ERROR: $ENV_FILE not found"
    exit 1
fi

# Parse .env (handles lines like KEY=value)
export $(grep -v '^#' "$ENV_FILE" | grep -v '^\s*$' | xargs)

SUPABASE_URL="${SUPABASE_URL:?SUPABASE_URL not set in .env}"
SERVICE_KEY="${SUPABASE_SERVICE_KEY:?SUPABASE_SERVICE_KEY not set in .env}"
DB_URL="${DIRECT_URL:?DIRECT_URL not set in .env}"

echo "============================================="
echo " MINDS ActivityHub — Demo Seed Script"
echo "============================================="
echo ""
echo "Supabase URL: $SUPABASE_URL"
echo "DB URL: ${DB_URL%%@*}@..."
echo ""

# --- Step 1: Check connectivity ---
echo ">>> Step 1: Checking Supabase connectivity..."
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 \
    "${SUPABASE_URL}/rest/v1/" \
    -H "apikey: ${SERVICE_KEY}" \
    -H "Authorization: Bearer ${SERVICE_KEY}" \
    2>/dev/null) || HTTP_STATUS="000"

if [ "$HTTP_STATUS" = "000" ]; then
    echo "ERROR: Cannot reach Supabase at $SUPABASE_URL"
    echo "The project may be PAUSED (free tier auto-pause)."
    echo "Go to https://supabase.com/dashboard → select your project → click 'Restore'"
    echo "Then re-run this script."
    exit 1
elif [ "$HTTP_STATUS" -ge 400 ]; then
    echo "ERROR: Supabase returned HTTP $HTTP_STATUS — check your service key"
    exit 1
fi
echo "✓ Supabase is reachable (HTTP $HTTP_STATUS)"
echo ""

# --- Step 2: Create Supabase Auth users ---
echo ">>> Step 2: Creating Supabase Auth users..."

create_auth_user() {
    local email="$1"
    local password="$2"
    local role="$3"
    local full_name="$4"
    local user_id="$5"
    local extra_metadata="${6:-}"

    echo -n "  Creating $email ($role)... "

    local metadata="{\"role\":\"$role\",\"full_name\":\"$full_name\"$extra_metadata}"

    local response
    response=$(curl -s -w "\n%{http_code}" \
        -X POST "${SUPABASE_URL}/auth/v1/admin/users" \
        -H "Authorization: Bearer ${SERVICE_KEY}" \
        -H "apikey: ${SERVICE_KEY}" \
        -H "Content-Type: application/json" \
        -d "{
            \"id\": \"$user_id\",
            \"email\": \"$email\",
            \"password\": \"$password\",
            \"email_confirm\": true,
            \"user_metadata\": $metadata
        }" 2>/dev/null)

    local http_code
    http_code=$(echo "$response" | tail -1)
    local body
    body=$(echo "$response" | head -n -1)

    if [ "$http_code" = "200" ] || [ "$http_code" = "201" ]; then
        echo "✓ Created"
    elif echo "$body" | grep -q "already been registered"; then
        echo "⊘ Already exists (updating...)"
        # Update existing user
        curl -s -o /dev/null \
            -X PUT "${SUPABASE_URL}/auth/v1/admin/users/$user_id" \
            -H "Authorization: Bearer ${SERVICE_KEY}" \
            -H "apikey: ${SERVICE_KEY}" \
            -H "Content-Type: application/json" \
            -d "{
                \"email\": \"$email\",
                \"password\": \"$password\",
                \"email_confirm\": true,
                \"user_metadata\": $metadata
            }" 2>/dev/null
        echo "    → Updated"
    else
        echo "✗ Failed (HTTP $http_code)"
        echo "    $body" | head -3
    fi
}

# Participant: Alex Chen
create_auth_user "participant@minds.demo" "Demo2026!" "participant" "Alex Chen" \
    "00000000-0000-4000-b000-000000000001" \
    ",\"membership_type\":\"once_weekly\",\"phone\":\"+65 9123 4567\",\"caregiver_phone\":\"+65 9876 5432\""

# Additional participants
create_auth_user "jane.smith@minds.demo" "Demo2026!" "participant" "Jane Smith" \
    "00000000-0000-4000-b000-000000000002" \
    ",\"membership_type\":\"twice_weekly\",\"phone\":\"+65 9234 5678\""

create_auth_user "michael.chen@minds.demo" "Demo2026!" "participant" "Michael Chen" \
    "00000000-0000-4000-b000-000000000003" \
    ",\"membership_type\":\"ad_hoc\",\"phone\":\"+65 9345 6789\",\"preferred_language\":\"zh\""

create_auth_user "sarah.lee@minds.demo" "Demo2026!" "participant" "Sarah Lee" \
    "00000000-0000-4000-b000-000000000004" \
    ",\"membership_type\":\"once_weekly\",\"phone\":\"+65 9456 7890\""

create_auth_user "david.kumar@minds.demo" "Demo2026!" "participant" "David Kumar" \
    "00000000-0000-4000-b000-000000000005" \
    ",\"membership_type\":\"3_plus\",\"phone\":\"+65 9567 8901\""

# Volunteer: David Tan
create_auth_user "volunteer@minds.demo" "Demo2026!" "volunteer" "David Tan" \
    "00000000-0000-4000-b000-000000000010" \
    ",\"phone\":\"+65 8123 4567\""

# Staff: Sarah Wong
create_auth_user "staff@minds.demo" "Demo2026!" "staff" "Sarah Wong" \
    "00000000-0000-4000-b000-000000000020" \
    ",\"phone\":\"+65 8234 5678\""

# Staff: Winston Yang (existing)
create_auth_user "wyang020@e.ntu.edu.sg" "Demo2026!" "staff" "Winston Yang" \
    "00000000-0000-4000-b000-000000000021" ""

echo ""

# --- Step 3: Run SQL seed ---
echo ">>> Step 3: Running database seed SQL..."
psql "$DB_URL" -f "$SCRIPT_DIR/backend/sql/seed_demo.sql"

echo ""
echo "============================================="
echo " ✅ Demo seed complete!"
echo "============================================="
echo ""
echo "Login credentials (all passwords: Demo2026!):"
echo "  Participant: participant@minds.demo"
echo "  Volunteer:   volunteer@minds.demo"
echo "  Staff:       staff@minds.demo"
echo "  Staff (alt): wyang020@e.ntu.edu.sg"
echo ""
echo "Data seeded:"
echo "  - 8 users (5 participants + 1 volunteer + 2 staff)"
echo "  - 13 activities (Jan 31 – Feb 6, 2026)"
echo "  - 24 registrations across 11 activities"
echo "  - 5 volunteer matches"
echo ""
echo "Next steps:"
echo "  cd backend && python -m uvicorn app.main:app --reload"
echo "  cd frontend && npm run dev"
