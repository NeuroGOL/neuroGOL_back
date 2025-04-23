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
exports.RoleController = void 0;
const role_service_1 = require("../services/role.service");
const errorMessages_1 = require("../utils/errorMessages");
class RoleController {
    static getAllRoles(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = yield role_service_1.RoleService.getAllRoles();
                res.json(roles);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getRoleById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const role = yield role_service_1.RoleService.getRoleById(Number(id));
                if (!role) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.ROLE_NOT_FOUND });
                    return;
                }
                res.json(role);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newRole = yield role_service_1.RoleService.createRole(req.body);
                res.status(201).json(newRole);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedRole = yield role_service_1.RoleService.updateRole(Number(id), req.body);
                if (!updatedRole) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.ROLE_NOT_FOUND });
                    return;
                }
                res.json(updatedRole);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteRole(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield role_service_1.RoleService.deleteRole(Number(id));
                if (!deleted) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.ROLE_NOT_FOUND });
                    return;
                }
                res.json({ message: 'Rol eliminado correctamente' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.RoleController = RoleController;
