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
exports.PlayerController = void 0;
const player_service_1 = require("../services/player.service");
const errorMessages_1 = require("../utils/errorMessages");
class PlayerController {
    static getAllPlayers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const players = yield player_service_1.PlayerService.getAllPlayers();
                res.json(players);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static getPlayerById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const player = yield player_service_1.PlayerService.getPlayerById(Number(id));
                if (!player) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.PLAYER_NOT_FOUND });
                    return;
                }
                res.json(player);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static createPlayer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newPlayer = yield player_service_1.PlayerService.createPlayer(req.body);
                res.status(201).json(newPlayer);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static updatePlayer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const updatedPlayer = yield player_service_1.PlayerService.updatePlayer(Number(id), req.body);
                if (!updatedPlayer) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.PLAYER_NOT_FOUND });
                    return;
                }
                res.json(updatedPlayer);
            }
            catch (error) {
                next(error);
            }
        });
    }
    static deletePlayer(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const deleted = yield player_service_1.PlayerService.deletePlayer(Number(id));
                if (!deleted) {
                    res.status(404).json({ message: errorMessages_1.ERROR_MESSAGES.PLAYER_NOT_FOUND });
                    return;
                }
                res.json({ message: 'Jugador eliminado correctamente' });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.PlayerController = PlayerController;
