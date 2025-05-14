"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const role_routes_1 = __importDefault(require("../routes/role.routes"));
const player_routes_1 = __importDefault(require("../routes/player.routes"));
const report_routes_1 = __importDefault(require("../routes/report.routes"));
const declaration_routes_1 = __importDefault(require("../routes/declaration.routes"));
const nlp_analysis_routes_1 = __importDefault(require("../routes/nlp_analysis.routes"));
const errorHandler_1 = require("../middleware/errorHandler");
const app = (0, express_1.default)();
// Middlewares
app.use(express_1.default.json());
app.use((0, cors_1.default)());
// Rutas
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/roles', role_routes_1.default);
app.use('/api/players', player_routes_1.default);
app.use('/api/declarations', declaration_routes_1.default);
app.use('/api/reports', report_routes_1.default);
app.use('/api/nlp', nlp_analysis_routes_1.default);
// Middleware de manejo de errores
app.use(errorHandler_1.errorHandler);
exports.default = app;
