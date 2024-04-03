import secrets

secret_key = secrets.token_hex(16)
print(f'Your JWT secret key: {secret_key}')
