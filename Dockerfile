# Imagen base oficial de Python
FROM python:3.11-slim

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar e instalar dependencias
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar todo el código
COPY . .

# Variables por defecto (puerto y logs sin buffer)
ENV PORT=8080
ENV PYTHONUNBUFFERED=1

# Arranque con Gunicorn
CMD ["gunicorn", "app:app", "--bind", "0.0.0.0:8080"]
