from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import bcrypt

from app.core.auth import supabase, get_current_user
from app.core.deps import get_db
from app.models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from app.db.models import User

router = APIRouter()

# Password hashing helper functions
def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    # Convert to bytes and truncate to 72 bytes if needed
    password_bytes = password.encode('utf-8')[:72]
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    password_bytes = plain_password.encode('utf-8')[:72]
    hashed_bytes = hashed_password.encode('utf-8')
    return bcrypt.checkpw(password_bytes, hashed_bytes)


@router.post("/signup", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Create a new user account

    - **email**: Valid email address
    - **password**: Minimum 6 characters
    - **role**: participant, volunteer, or staff
    - **membership_type**: Required for participants (ad_hoc, once_weekly, twice_weekly, 3_plus)
    """
    try:
        # Check if user already exists in database (case-insensitive email check)
        from sqlalchemy import func as sql_func
        existing_user = db.query(User).filter(
            sql_func.lower(User.email) == user_data.email.lower()
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # Create user in Supabase Auth
        auth_response = supabase.auth.sign_up({
            "email": user_data.email,
            "password": user_data.password,
            "options": {
                "data": {
                    "role": user_data.role.value,
                    "membership_type": user_data.membership_type.value if user_data.membership_type else None,
                    "full_name": user_data.full_name,
                    "phone": user_data.phone,
                    "caregiver_phone": user_data.caregiver_phone,
                    "preferred_language": user_data.preferred_language.value,
                    "wheelchair_required": user_data.wheelchair_required
                }
            }
        })

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user in auth system"
            )
        
        # Check if user already exists in PostgreSQL by Supabase Auth ID
        # (handles case where Supabase returns existing user for duplicate email)
        existing_user_by_id = db.query(User).filter(User.id == auth_response.user.id).first()
        if existing_user_by_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User with this email already exists"
            )

        # Create user in PostgreSQL database
        db_user = User(
            id=auth_response.user.id,  # Use same ID as Supabase Auth
            email=user_data.email,
            hashed_password=hash_password(user_data.password),
            role=user_data.role,
            membership_type=user_data.membership_type,
            full_name=user_data.full_name,
            phone=user_data.phone,
            caregiver_phone=user_data.caregiver_phone,
            preferred_language=user_data.preferred_language.value,
            wheelchair_required=user_data.wheelchair_required
        )
        db.add(db_user)
        db.commit()
        db.refresh(db_user)

        # Handle case where email confirmation is required (session will be None)
        if auth_response.session is None:
            # Email confirmation required - return without token
            raise HTTPException(
                status_code=status.HTTP_201_CREATED,
                detail="Account created. Please check your email to confirm your account before logging in."
            )

        # Return token and user info
        return TokenResponse(
            access_token=auth_response.session.access_token,
            user=UserResponse(
                id=auth_response.user.id,
                email=auth_response.user.email,
                role=user_data.role,
                membership_type=user_data.membership_type,
                full_name=user_data.full_name,
                phone=user_data.phone,
                preferred_language=user_data.preferred_language.value,
                created_at=auth_response.user.created_at
            )
        )
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Login with email and password

    Returns JWT access token
    """
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": credentials.email,
            "password": credentials.password
        })

        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )

        user_metadata = auth_response.user.user_metadata

        # Check if user exists in PostgreSQL database
        db_user = db.query(User).filter(User.id == auth_response.user.id).first()

        # If user doesn't exist in database, create it (handles legacy users)
        if not db_user:
            # This handles the case where user was created in Supabase Auth
            # but not in PostgreSQL (due to previous bug or email confirmation issues)
            db_user = User(
                id=auth_response.user.id,
                email=auth_response.user.email,
                hashed_password=hash_password(credentials.password),
                role=user_metadata.get('role', 'participant'),
                membership_type=user_metadata.get('membership_type'),
                full_name=user_metadata.get('full_name'),
                phone=user_metadata.get('phone'),
                caregiver_phone=user_metadata.get('caregiver_phone'),
                preferred_language=user_metadata.get('preferred_language', 'en'),
                wheelchair_required=user_metadata.get('wheelchair_required', False)
            )
            db.add(db_user)
            db.commit()
            db.refresh(db_user)

        return TokenResponse(
            access_token=auth_response.session.access_token,
            user=UserResponse(
                id=auth_response.user.id,
                email=auth_response.user.email,
                role=user_metadata.get('role', 'participant'),
                membership_type=user_metadata.get('membership_type'),
                full_name=user_metadata.get('full_name'),
                phone=user_metadata.get('phone'),
                preferred_language=user_metadata.get('preferred_language', 'en'),
                created_at=auth_response.user.created_at
            )
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )


@router.post("/logout")
async def logout(current_user = Depends(get_current_user)):
    """Logout current user"""
    try:
        supabase.auth.sign_out()
        return {"message": "Successfully logged out"}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    user_metadata = current_user.user_metadata
    
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        role=user_metadata.get('role', 'participant'),
        membership_type=user_metadata.get('membership_type'),
        full_name=user_metadata.get('full_name'),
        phone=user_metadata.get('phone'),
        preferred_language=user_metadata.get('preferred_language', 'en'),
        created_at=current_user.created_at
    )
