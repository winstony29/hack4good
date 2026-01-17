from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.auth import supabase, get_current_user
from app.core.deps import get_db
from app.models.user import UserCreate, UserLogin, UserResponse, TokenResponse

router = APIRouter()


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
                    "preferred_language": user_data.preferred_language.value
                }
            }
        })
        
        if not auth_response.user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to create user"
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
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin):
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
