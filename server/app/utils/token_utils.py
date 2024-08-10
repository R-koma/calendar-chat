import logging
from app import jwt

logging.basicConfig(level=logging.INFO)

BLACKLIST = set()


def revoke_token(jti):
    BLACKLIST.add(jti)


@jwt.token_in_blocklist_loader
def check_if_token_in_blacklist(jwt_header, jwt_payload):
    jti = jwt_payload.get('jti')
    return jti in BLACKLIST
