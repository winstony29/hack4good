from typing import Optional
from twilio.rest import Client

from app.core.config import settings


class TwilioClient:
    """
    Wrapper for Twilio SMS and WhatsApp services
    
    Handles message sending with error handling
    """
    
    def __init__(self):
        if settings.TWILIO_ACCOUNT_SID and settings.TWILIO_AUTH_TOKEN:
            self.client = Client(
                settings.TWILIO_ACCOUNT_SID,
                settings.TWILIO_AUTH_TOKEN
            )
            self.phone_number = settings.TWILIO_PHONE_NUMBER
            self.whatsapp_number = settings.TWILIO_WHATSAPP_NUMBER
        else:
            self.client = None
    
    def send_sms(self, to: str, message: str) -> Optional[str]:
        """
        Send SMS message
        
        Args:
            to: Recipient phone number (E.164 format)
            message: Message text
        
        Returns:
            Message SID if successful, None if failed
        """
        if not self.client:
            print(f"[SMS Mock] To: {to}, Message: {message}")
            return "mock_sid"
        
        try:
            message = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to
            )
            return message.sid
        except Exception as e:
            print(f"Failed to send SMS: {e}")
            return None
    
    def send_whatsapp(self, to: str, message: str) -> Optional[str]:
        """
        Send WhatsApp message
        
        Args:
            to: Recipient phone number (E.164 format, without whatsapp: prefix)
            message: Message text
        
        Returns:
            Message SID if successful, None if failed
        """
        if not self.client:
            print(f"[WhatsApp Mock] To: {to}, Message: {message}")
            return "mock_sid"
        
        try:
            # Add whatsapp: prefix to numbers
            from_number = f"whatsapp:{self.whatsapp_number}"
            to_number = f"whatsapp:{to}"
            
            message = self.client.messages.create(
                body=message,
                from_=from_number,
                to=to_number
            )
            return message.sid
        except Exception as e:
            print(f"Failed to send WhatsApp: {e}")
            return None
