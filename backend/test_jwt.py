import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.core.security import create_access_token, decode_access_token

token = create_access_token({"sub": 1})
print("Token:", token)
payload = decode_access_token(token)
print("Payload:", payload)
print("Type of sub:", type(payload.get("sub")))
