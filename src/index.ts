import app from './config/server';
import dotenv from 'dotenv';
import './config/db'; // Conectar base de datos

dotenv.config();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
