-- 🔹 Elimina las tablas si ya existen para evitar conflictos
DROP TABLE IF EXISTS ai_models, nlp_analysis, reports, performance, emotion, matches, players, users CASCADE;

-- 🔹 Crear tabla de usuarios
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'analista', 'entrenador')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de jugadores
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    equipo VARCHAR(100) NOT NULL,
    posicion VARCHAR(50) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de partidos
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL, -- Nombre del partido (ej. "Barcelona vs Real Madrid")
    fecha DATE NOT NULL,
    ubicacion VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de rendimiento (Performance)
CREATE TABLE performance (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    match_id INT REFERENCES matches(id) ON DELETE SET NULL, -- Relación con partidos
    minutos_jugados INT NOT NULL CHECK (minutos_jugados >= 0),
    goles INT NOT NULL CHECK (goles >= 0),
    asistencias INT NOT NULL CHECK (asistencias >= 0),
    tarjetas_amarillas INT NOT NULL CHECK (tarjetas_amarillas >= 0),
    tarjetas_rojas INT NOT NULL CHECK (tarjetas_rojas >= 0),
    calificacion NUMERIC(3,1) CHECK (calificacion >= 0 AND calificacion <= 10), -- Evaluación de 0 a 10
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de emociones (Emotion)
CREATE TABLE emotion (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- Ejemplo: "Ansiedad", "Felicidad", "Estrés"
    intensidad INT NOT NULL CHECK (intensidad >= 1 AND intensidad <= 10), -- Nivel de 1 a 10
    descripcion TEXT,
    fecha DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de reportes (Análisis y estadísticas)
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    tipo VARCHAR(50) NOT NULL, -- "Tendencia emocional", "Rendimiento", "Comparación"
    datos JSONB NOT NULL, -- Se almacenarán métricas en formato JSON
    generado_por VARCHAR(50) NOT NULL DEFAULT 'Sistema',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de análisis de texto (NLP)
CREATE TABLE nlp_analysis (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    fuente TEXT NOT NULL, -- "Entrevista", "Redes Sociales", etc.
    texto TEXT NOT NULL, -- Texto analizado
    emocion_detectada VARCHAR(50), -- "Felicidad", "Ansiedad", "Ira", etc.
    confianza NUMERIC(4,3) CHECK (confianza >= 0 AND confianza <= 1), -- Nivel de confianza del modelo (0-1)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de modelos de IA (Predicciones)
CREATE TABLE ai_models (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    modelo VARCHAR(50) NOT NULL, -- "Red neuronal", "Regresión", etc.
    prediccion JSONB NOT NULL, -- Almacena el resultado de la predicción
    precision NUMERIC(4,3) CHECK (precision >= 0 AND precision <= 1), -- Precisión del modelo (0-1)
    creado_por VARCHAR(50) NOT NULL DEFAULT 'Sistema',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
