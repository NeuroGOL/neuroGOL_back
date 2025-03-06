-- 🔹 Crear tabla de roles
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
);

-- Insertar roles por defecto
INSERT INTO role (nombre) VALUES ('admin'), ('analista');

-- 🔹 Crear tabla de usuarios
CREATE TABLE user (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena TEXT NOT NULL,
    role_id INT REFERENCES role(id) ON DELETE SET NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de jugadores
CREATE TABLE player (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    equipo VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    profile_picture TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de análisis (Datos ingresados manualmente)
CREATE TABLE analysis (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    categoria_texto VARCHAR(50) NOT NULL, -- "Previo al partido", "Post-partido", "Durante entrenamiento", "Lesión"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de análisis de emociones (Generado por IA)
CREATE TABLE nlp_analysis (
    id SERIAL PRIMARY KEY,
    analysis_id INT NOT NULL REFERENCES analysis(id) ON DELETE CASCADE,
    emocion_detectada VARCHAR(50) NOT NULL, -- "Felicidad", "Ansiedad", "Ira", etc.
    situacion_emocional VARCHAR(100) NOT NULL, -- "Frustración post-partido", "Confianza en pretemporada"
    analisis TEXT NOT NULL, -- Explicación detallada del análisis generado por IA
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 🔹 Crear tabla de reportes (Consolidado final con información de la IA)
CREATE TABLE reports (
    id SERIAL PRIMARY KEY,
    player_id INT NOT NULL REFERENCES player(id) ON DELETE CASCADE,
    analysis_id INT NOT NULL REFERENCES analysis(id) ON DELETE CASCADE,
    nlp_analysis_id INT NOT NULL REFERENCES nlp_analysis(id) ON DELETE CASCADE,
    emociones_detectadas TEXT NOT NULL, -- Lista de emociones más frecuentes durante el período analizado
    tendencia_emocional TEXT NOT NULL, -- Cómo han cambiado las emociones con el tiempo
    impacto_en_rendimiento VARCHAR(50) NOT NULL, -- "Positivo", "Negativo" o "Neutro"
    impacto_en_equipo VARCHAR(50) NOT NULL, -- "Positivo", "Negativo" o "Neutro"
    estado_actual_emocional VARCHAR(50) NOT NULL, -- "Estable", "Inestable", "En riesgo"
    rendimiento_predicho VARCHAR(50) NOT NULL, -- "Alto", "Medio", "Bajo"
    resumen_general TEXT NOT NULL, -- Explicación global sobre el estado emocional del jugador
    acciones_recomendadas TEXT NOT NULL, -- Sugerencias basadas en el análisis
    generado_por INT NOT NULL REFERENCES user(id) ON DELETE CASCADE, -- Usuario que generó el reporte
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
