export const ERROR_MESSAGES: Record<string, string> = {
  INVALID_ID: 'El ID debe ser un número entero',
  NAME_TOO_SHORT: 'El nombre debe tener al menos 3 caracteres',
  INVALID_EMAIL: 'Debe ser un email válido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
  INVALID_ROLE: 'Rol inválido',
  MISSING_FIELDS: 'Todos los campos son obligatorios',
  INVALID_DATE: 'Fecha inválida',

  GET_USERS_ERROR: 'Error obteniendo usuarios',
  USER_NOT_FOUND: 'Usuario no encontrado',
  CREATE_USER_ERROR: 'Error creando usuario',
  UPDATE_USER_ERROR: 'Error actualizando usuario',
  DELETE_USER_ERROR: 'Error eliminando usuario',

  GET_ROLES_ERROR: 'Error obteniendo roles',
  ROLE_NOT_FOUND: 'Rol no encontrado',
  CREATE_ROLE_ERROR: 'Error creando rol',
  UPDATE_ROLE_ERROR: 'Error actualizando rol',
  DELETE_ROLE_ERROR: 'Error eliminando rol',
  ROLE_NAME_TOO_SHORT: 'El nombre del rol debe tener al menos 3 caracteres',

  GET_PLAYERS_ERROR: 'Error obteniendo jugadores',
  PLAYER_NOT_FOUND: 'Jugador no encontrado',
  CREATE_PLAYER_ERROR: 'Error creando jugador',
  UPDATE_PLAYER_ERROR: 'Error actualizando jugador',
  DELETE_PLAYER_ERROR: 'Error eliminando jugador',

  GET_EMOTIONS_ERROR: 'Error obteniendo emociones',
  EMOTION_NOT_FOUND: 'Emoción no encontrada',
  CREATE_EMOTION_ERROR: 'Error creando emoción',
  DELETE_EMOTION_ERROR: 'Error eliminando emoción',

  GET_REPORTS_ERROR: 'Error obteniendo reportes',
  REPORT_NOT_FOUND: 'Reporte no encontrado',
  CREATE_REPORT_ERROR: 'Error creando reporte',
  DELETE_REPORT_ERROR: 'Error eliminando reporte',

  GET_NLP_ERROR: 'Error obteniendo análisis de texto',
  NLP_NOT_FOUND: 'Análisis de texto no encontrado',
  CREATE_NLP_ERROR: 'Error creando análisis de texto',
  DELETE_NLP_ERROR: 'Error eliminando análisis de texto',

  GET_AI_MODELS_ERROR: 'Error obteniendo predicciones de IA',
  AI_MODEL_NOT_FOUND: 'Predicción de IA no encontrada',
  CREATE_AI_MODEL_ERROR: 'Error creando predicción de IA',
  DELETE_AI_MODEL_ERROR: 'Error eliminando predicción de IA',

  EMAIL_ALREADY_EXISTS: 'El email ya está en uso',
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  REGISTRATION_ERROR: 'Error registrando usuario',
  LOGIN_ERROR: 'Error iniciando sesión',
  UNKNOWN_ERROR: 'Ocurrió un error desconocido',

  OPENAI_QUOTA_EXCEEDED: 'Has superado tu cuota actual en OpenAI. Por favor, revisa tu plan y detalles de facturación.',
};
