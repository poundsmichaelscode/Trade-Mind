from app.core.security import create_access_token, create_refresh_token, decode_access_token, decode_refresh_token, hash_password, verify_password


def test_hash_and_verify_password_round_trip():
    hashed = hash_password("Password123")
    assert hashed
    assert verify_password("Password123", hashed) is True
    assert verify_password("wrong", hashed) is False


def test_access_and_refresh_token_types_are_distinct():
    access = create_access_token("1")
    refresh = create_refresh_token("1")
    assert decode_access_token(access)["type"] == "access"
    assert decode_refresh_token(refresh)["type"] == "refresh"
