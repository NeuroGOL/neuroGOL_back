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
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const errorMessages_1 = require("../utils/errorMessages");
class UserController {
    static getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_service_1.UserService.getAllUsers();
                res.json(users);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const user = yield user_service_1.UserService.getUserById(Number(id));
                if (!user) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND });
                    return;
                }
                res.json(user);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = yield user_service_1.UserService.createUser(req.body);
                res.status(201).json(newUser);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedUser = yield user_service_1.UserService.updateUser(Number(id), req.body);
                if (!updatedUser) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND });
                    return;
                }
                res.json(updatedUser);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield user_service_1.UserService.deleteUser(Number(id));
                if (!deleted) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.USER_NOT_FOUND });
                    return;
                }
                res.json({ message: 'Usuario eliminado correctamente' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
