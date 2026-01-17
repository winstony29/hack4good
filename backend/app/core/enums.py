from enum import Enum


class Role(str, Enum):
    PARTICIPANT = "participant"
    VOLUNTEER = "volunteer"
    STAFF = "staff"


class MembershipType(str, Enum):
    AD_HOC = "ad_hoc"
    ONCE_WEEKLY = "once_weekly"
    TWICE_WEEKLY = "twice_weekly"
    THREE_PLUS = "3_plus"


class RegistrationStatus(str, Enum):
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    WAITLIST = "waitlist"


class Language(str, Enum):
    ENGLISH = "en"
    MANDARIN = "zh"
    MALAY = "ms"
    TAMIL = "ta"
