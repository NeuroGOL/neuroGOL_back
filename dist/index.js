"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./config/server"));
const dotenv_1 = __importDefault(require("dotenv"));
require("./config/db"); // Conectar base de datos
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
server_1.default.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
