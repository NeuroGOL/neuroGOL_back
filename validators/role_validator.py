from utils.error_handlers import APIError

def validate_role_data(data):
    nombre = data.get("nombre")

    if not nombre or not isinstance(nombre, str):
        raise APIError("El nombre del rol es requerido y debe ser texto", 400)

    if len(nombre.strip()) < 3:
        raise APIError("El nombre del rol debe tener al menos 3 caracteres", 400)

    return {"nombre": nombre.strip()}
