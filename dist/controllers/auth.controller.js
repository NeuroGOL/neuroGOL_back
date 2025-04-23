"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
const errorMessages_1 = require("../utils/errorMessages");
class AuthController {
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield auth_service_1.AuthService.register(req.body);
                res.status(201).json(response);
            }
            catch (error) {
                console.error("❌ Error al registrar usuario:", error); // <-- Agrega esto
                res.status(400).json({ error: errorMessages_1.ERROR_MESSAGES.REGISTRATION_ERROR });
            }
        });
    }
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, contrasena } = req.body;
                const response = yield auth_service_1.AuthService.login(email, contrasena);
                res.json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.AuthController = AuthController;
