import os
import logging
from typing import Optional

logger = logging.getLogger(__name__)

# Check if we're in mock mode
USE_MOCK_NOTIFICATIONS = os.getenv("USE_MOCK_NOTIFICATIONS", "true").lower() == "true"


class TwilioClient:
    """
    Twilio client wrapper with mock mode support.

    When USE_MOCK_NOTIFICATIONS=true (default), logs notifications to console.
    When USE_MOCK_NOTIFICATIONS=false, sends real SMS/WhatsApp via Twilio.
    """

    def __init__(self):
        self.mock_mode = USE_MOCK_NOTIFICATIONS

        if not self.mock_mode:
            try:
                from twilio.rest import Client
                account_sid = os.getenv("TWILIO_ACCOUNT_SID")
                auth_token = os.getenv("TWILIO_AUTH_TOKEN")
                self.from_phone = os.getenv("TWILIO_FROM_PHONE")
                self.whatsapp_from = os.getenv("TWILIO_WHATSAPP_FROM")

                if not all([account_sid, auth_token, self.from_phone]):
                    logger.warning("Twilio credentials incomplete, falling back to mock mode")
                    self.mock_mode = True
                else:
                    self.client = Client(account_sid, auth_token)
                    logger.info("Twilio client initialized in LIVE mode")
            except ImportError:
                logger.warning("Twilio package not installed, using mock mode")
                self.mock_mode = True

        if self.mock_mode:
            logger.info("Twilio client initialized in MOCK mode")

    def send_sms(self, to_phone: str, message: str) -> Optional[str]:
        """
        Send SMS message.

        Returns message SID on success, None on failure.
        In mock mode, logs to console and returns fake SID.
        """
        if self.mock_mode:
            logger.info(f"[MOCK SMS] To: {to_phone}")
            logger.info(f"[MOCK SMS] Message: {message}")
            return "MOCK_SMS_SID_" + to_phone[-4:]

        try:
            msg = self.client.messages.create(
                body=message,
                from_=self.from_phone,
                to=to_phone
            )
            logger.info(f"SMS sent to {to_phone}, SID: {msg.sid}")
            return msg.sid
        except Exception as e:
            logger.error(f"Failed to send SMS to {to_phone}: {e}")
            return None

    def send_whatsapp(self, to_phone: str, message: str) -> Optional[str]:
        """
        Send WhatsApp message.

        Returns message SID on success, None on failure.
        In mock mode, logs to console and returns fake SID.
        """
        if self.mock_mode:
            logger.info(f"[MOCK WhatsApp] To: {to_phone}")
            logger.info(f"[MOCK WhatsApp] Message: {message}")
            return "MOCK_WA_SID_" + to_phone[-4:]

        try:
            # WhatsApp requires whatsapp: prefix
            to_whatsapp = f"whatsapp:{to_phone}" if not to_phone.startswith("whatsapp:") else to_phone
            from_whatsapp = self.whatsapp_from or f"whatsapp:{self.from_phone}"

            msg = self.client.messages.create(
                body=message,
                from_=from_whatsapp,
                to=to_whatsapp
            )
            logger.info(f"WhatsApp sent to {to_phone}, SID: {msg.sid}")
            return msg.sid
        except Exception as e:
            logger.error(f"Failed to send WhatsApp to {to_phone}: {e}")
            return None


# Singleton instance
_twilio_client: Optional[TwilioClient] = None


def get_twilio_client() -> TwilioClient:
    """Get singleton Twilio client instance."""
    global _twilio_client
    if _twilio_client is None:
        _twilio_client = TwilioClient()
    return _twilio_client
