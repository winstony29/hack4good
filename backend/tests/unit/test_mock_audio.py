"""
Unit tests for mock_audio utility.
"""

import pytest
import base64
from app.utils.mock_audio import (
    get_mock_audio_base64,
    get_mock_audio_duration,
    MOCK_AUDIO_BASE64
)


class TestMockAudio:
    """Tests for mock audio utility functions."""

    def test_mock_audio_base64_constant_exists(self):
        """MOCK_AUDIO_BASE64 constant should exist and be a string."""
        assert isinstance(MOCK_AUDIO_BASE64, str)
        assert len(MOCK_AUDIO_BASE64) > 0

    def test_mock_audio_base64_is_valid_base64(self):
        """MOCK_AUDIO_BASE64 should be valid base64."""
        # Should not raise an exception
        decoded = base64.b64decode(MOCK_AUDIO_BASE64)
        assert isinstance(decoded, bytes)
        assert len(decoded) > 0

    def test_get_mock_audio_base64_returns_data_url(self):
        """get_mock_audio_base64() should return a data URL."""
        result = get_mock_audio_base64()
        assert result.startswith('data:audio/mp3;base64,')

    def test_get_mock_audio_base64_contains_base64_data(self):
        """get_mock_audio_base64() should contain the base64 data."""
        result = get_mock_audio_base64()
        assert MOCK_AUDIO_BASE64 in result

    def test_get_mock_audio_base64_is_valid_data_url(self):
        """get_mock_audio_base64() should return a valid data URL format."""
        result = get_mock_audio_base64()
        parts = result.split(',')
        assert len(parts) == 2
        assert parts[0] == 'data:audio/mp3;base64'
        # Verify the base64 part is valid
        decoded = base64.b64decode(parts[1])
        assert len(decoded) > 0

    def test_get_mock_audio_duration_returns_float(self):
        """get_mock_audio_duration() should return a float."""
        result = get_mock_audio_duration()
        assert isinstance(result, float)

    def test_get_mock_audio_duration_is_positive(self):
        """get_mock_audio_duration() should return a positive value."""
        result = get_mock_audio_duration()
        assert result > 0

    def test_get_mock_audio_duration_is_reasonable(self):
        """get_mock_audio_duration() should return a reasonable duration."""
        result = get_mock_audio_duration()
        # Should be less than 10 seconds for mock audio
        assert result < 10.0

    def test_get_mock_audio_base64_is_consistent(self):
        """get_mock_audio_base64() should return the same value on multiple calls."""
        result1 = get_mock_audio_base64()
        result2 = get_mock_audio_base64()
        assert result1 == result2

    def test_get_mock_audio_duration_is_consistent(self):
        """get_mock_audio_duration() should return the same value on multiple calls."""
        result1 = get_mock_audio_duration()
        result2 = get_mock_audio_duration()
        assert result1 == result2
