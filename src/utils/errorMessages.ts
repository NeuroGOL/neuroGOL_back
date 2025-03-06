export const ERROR_MESSAGES: Record<string, string> = {
  // 🔹 Validaciones Generales
  INVALID_ID: 'El ID debe ser un número entero',
  NAME_TOO_SHORT: 'El nombre debe tener al menos 3 caracteres',
  INVALID_EMAIL: 'Debe ser un email válido',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
  INVALID_ROLE: 'Rol inválido',
  MISSING_FIELDS: 'Todos los campos son obligatorios',
  INVALID_DATE: 'Fecha inválida',

  // 🔹 Usuarios
  GET_USERS_ERROR: 'Error obteniendo usuarios',
  USER_NOT_FOUND: 'Usuario no encontrado',
  CREATE_USER_ERROR: 'Error creando usuario',
  UPDATE_USER_ERROR: 'Error actualizando usuario',
  DELETE_USER_ERROR: 'Error eliminando usuario',
  EMAIL_ALREADY_EXISTS: 'El email ya está en uso',
  INVALID_CREDENTIALS: 'Correo o contraseña incorrectos',
  REGISTRATION_ERROR: 'Error registrando usuario',
  LOGIN_ERROR: 'Error iniciando sesión',

  // 🔹 Roles
  GET_ROLES_ERROR: 'Error obteniendo roles',
  ROLE_NOT_FOUND: 'Rol no encontrado',
  CREATE_ROLE_ERROR: 'Error creando rol',
  UPDATE_ROLE_ERROR: 'Error actualizando rol',
  DELETE_ROLE_ERROR: 'Error eliminando rol',
  ROLE_NAME_TOO_SHORT: 'El nombre del rol debe tener al menos 3 caracteres',

  // 🔹 Jugadores
  GET_PLAYERS_ERROR: 'Error obteniendo jugadores',
  PLAYER_NOT_FOUND: 'Jugador no encontrado',
  CREATE_PLAYER_ERROR: 'Error creando jugador',
  UPDATE_PLAYER_ERROR: 'Error actualizando jugador',
  DELETE_PLAYER_ERROR: 'Error eliminando jugador',

  // 🔹 Análisis (Manual)
  ANALYSIS_NOT_FOUND: 'Análisis no encontrado',
  ANALYSIS_TEXT_NOT_FOUND: 'El análisis seleccionado no tiene texto válido para procesar.',
  INVALID_ANALYSIS: 'Análisis inválido',
  CREATE_ANALYSIS_ERROR: 'Error creando análisis',
  UPDATE_ANALYSIS_ERROR: 'Error actualizando análisis',
  DELETE_ANALYSIS_ERROR: 'Error eliminando análisis',

  // 🔹 Análisis NLP (IA)
  GET_NLP_ANALYSIS_ERROR: 'Error obteniendo análisis NLP',
  NLP_ANALYSIS_NOT_FOUND: 'Análisis NLP no encontrado',
  CREATE_NLP_ANALYSIS_ERROR: 'Error creando análisis NLP',
  DELETE_NLP_ANALYSIS_ERROR: 'Error eliminando análisis NLP',

  // 🔹 Reportes
  GET_REPORTS_ERROR: 'Error obteniendo reportes',
  REPORT_NOT_FOUND: 'Reporte no encontrado',
  CREATE_REPORT_ERROR: 'Error creando reporte',
  DELETE_REPORT_ERROR: 'Error eliminando reporte',

  // 🔹 Modelos de IA (si se usan predicciones)
  GET_AI_MODELS_ERROR: 'Error obteniendo predicciones de IA',
  AI_MODEL_NOT_FOUND: 'Predicción de IA no encontrada',
  CREATE_AI_MODEL_ERROR: 'Error creando predicción de IA',
  DELETE_AI_MODEL_ERROR: 'Error eliminando predicción de IA',

  // 🔹 API Externa (Gemini / OpenAI)
  OPENAI_QUOTA_EXCEEDED: 'Has superado tu cuota actual en OpenAI. Por favor, revisa tu plan y detalles de facturación.',

  // 🔹 Otros errores generales
  UNKNOWN_ERROR: 'Ocurrió un error desconocido',
};
