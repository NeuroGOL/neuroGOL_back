from utils.error_handlers import APIError

def validate_refresh_token(data):
    refresh_token = data.get("refresh_token")
    if not refresh_token:
        raise APIError("El refresh token es requerido", 400)
    return refresh_token
