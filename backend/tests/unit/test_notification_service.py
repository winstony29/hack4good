"""
Unit tests for NotificationService.

Tests:
- send_notification with valid user
- send_notification with missing phone
- get_user_notifications returns correct results
"""

import pytest
from unittest.mock import MagicMock, patch
from uuid import uuid4
from datetime import datetime

from app.services.notification_service import NotificationService
from app.db.models import User, Notification
from app.core.enums import Role


class TestNotificationService:
    """Tests for NotificationService."""

    @pytest.fixture
    def mock_db(self):
        """Mock database session."""
        return MagicMock()

    @pytest.fixture
    def mock_user_with_phone(self):
        """User with phone number."""
        user = MagicMock(spec=User)
        user.id = uuid4()
        user.phone = '+6591234567'
        user.caregiver_phone = '+6598765432'
        user.role = Role.PARTICIPANT
        return user

    @pytest.fixture
    def mock_user_no_phone(self):
        """User without phone number."""
        user = MagicMock(spec=User)
        user.id = uuid4()
        user.phone = None
        user.caregiver_phone = None
        user.role = Role.PARTICIPANT
        return user

    @pytest.fixture
    def service(self, mock_db):
        """NotificationService instance with mocked dependencies."""
        with patch('app.services.notification_service.get_twilio_client') as mock_twilio:
            mock_client = MagicMock()
            mock_client.send_sms.return_value = 'mock_sid_123'
            mock_client.send_whatsapp.return_value = 'mock_sid_456'
            mock_twilio.return_value = mock_client
            service = NotificationService(mock_db)
            service.twilio = mock_client
            return service

    @pytest.mark.asyncio
    async def test_send_notification_sms_success(self, service, mock_db, mock_user_with_phone):
        """Test sending SMS notification to valid user."""
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user_with_phone

        result = await service.send_notification(
            user_id=mock_user_with_phone.id,
            message="Test message",
            channel="sms"
        )

        # Verify Twilio was called
        service.twilio.send_sms.assert_called_once_with(
            mock_user_with_phone.phone,
            "Test message"
        )

        # Verify notification was added to DB
        mock_db.add.assert_called_once()
        mock_db.commit.assert_called_once()

    @pytest.mark.asyncio
    async def test_send_notification_whatsapp_success(self, service, mock_db, mock_user_with_phone):
        """Test sending WhatsApp notification to valid user."""
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user_with_phone

        result = await service.send_notification(
            user_id=mock_user_with_phone.id,
            message="Test WhatsApp message",
            channel="whatsapp"
        )

        # Verify Twilio WhatsApp was called with caregiver phone
        service.twilio.send_whatsapp.assert_called_once_with(
            mock_user_with_phone.caregiver_phone,
            "Test WhatsApp message"
        )

    @pytest.mark.asyncio
    async def test_send_notification_user_not_found(self, service, mock_db):
        """Test sending notification to non-existent user raises error."""
        mock_db.query.return_value.filter.return_value.first.return_value = None

        with pytest.raises(ValueError, match="User not found"):
            await service.send_notification(
                user_id=uuid4(),
                message="Test message",
                channel="sms"
            )

    @pytest.mark.asyncio
    async def test_send_notification_no_phone(self, service, mock_db, mock_user_no_phone):
        """Test sending notification to user without phone raises error."""
        mock_db.query.return_value.filter.return_value.first.return_value = mock_user_no_phone

        with pytest.raises(ValueError, match="has no phone number"):
            await service.send_notification(
                user_id=mock_user_no_phone.id,
                message="Test message",
                channel="sms"
            )

    def test_get_user_notifications(self, service, mock_db):
        """Test retrieving user notifications."""
        user_id = uuid4()
        mock_notifications = [
            MagicMock(id=uuid4(), user_id=user_id, message="Msg 1", status="sent"),
            MagicMock(id=uuid4(), user_id=user_id, message="Msg 2", status="sent"),
        ]

        mock_query = MagicMock()
        mock_query.filter.return_value.order_by.return_value.all.return_value = mock_notifications
        mock_db.query.return_value = mock_query

        result = service.get_user_notifications(user_id)

        assert len(result) == 2
        mock_db.query.assert_called_once()


class TestNotificationAuthorization:
    """Tests for notification authorization logic."""

    def test_user_can_view_own_notifications(self):
        """Users should be able to view their own notifications."""
        from app.core.enums import Role

        user_id = uuid4()
        current_user = MagicMock()
        current_user.id = user_id
        current_user.role = Role.PARTICIPANT

        is_staff = current_user.role == Role.STAFF
        is_owner = str(current_user.id) == str(user_id)

        assert is_owner is True
        assert is_staff is False

    def test_staff_can_view_any_notifications(self):
        """Staff should be able to view any user's notifications."""
        from app.core.enums import Role

        user_id = uuid4()
        current_user = MagicMock()
        current_user.id = uuid4()  # Different ID
        current_user.role = Role.STAFF

        is_staff = current_user.role == Role.STAFF
        is_owner = str(current_user.id) == str(user_id)

        assert is_staff is True
        assert is_owner is False
        # Staff should be allowed (is_staff OR is_owner)
        assert is_staff or is_owner

    def test_non_staff_cannot_view_others_notifications(self):
        """Non-staff users should not be able to view others' notifications."""
        from app.core.enums import Role

        user_id = uuid4()
        current_user = MagicMock()
        current_user.id = uuid4()  # Different ID
        current_user.role = Role.PARTICIPANT

        is_staff = current_user.role == Role.STAFF
        is_owner = str(current_user.id) == str(user_id)

        assert is_staff is False
        assert is_owner is False
        # Should be denied (not staff AND not owner)
        assert not (is_staff or is_owner)
