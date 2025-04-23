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
exports.DeclarationController = void 0;
const declaration_service_1 = require("../services/declaration.service");
const errorMessages_1 = require("../utils/errorMessages");
class DeclarationController {
    static getAllDeclarations(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const declarations = yield declaration_service_1.DeclarationService.getAllDeclarations();
                res.json(declarations);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getDeclarationById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const declaration = yield declaration_service_1.DeclarationService.getDeclarationById(Number(id));
                if (!declaration) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND });
                    return;
                }
                res.json(declaration);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createDeclaration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newDeclaration = yield declaration_service_1.DeclarationService.createDeclaration(req.body);
                res.status(201).json(newDeclaration);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateDeclaration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedDeclaration = yield declaration_service_1.DeclarationService.updateDeclaration(Number(id), req.body);
                if (!updatedDeclaration) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND });
                    return;
                }
                res.json(updatedDeclaration);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteDeclaration(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield declaration_service_1.DeclarationService.deleteDeclaration(Number(id));
                if (!deleted) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.DECLARATION_NOT_FOUND });
                    return;
                }
                res.json({ message: 'Declaración eliminada correctamente' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.DeclarationController = DeclarationController;
