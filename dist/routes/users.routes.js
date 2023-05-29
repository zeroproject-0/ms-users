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
const express_1 = require("express");
const bcrypt_ts_1 = require("bcrypt-ts");
const db_1 = require("../db");
const router = (0, express_1.Router)();
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.Prisma.user.findMany();
    res.json(users);
}));
router.get('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.Prisma.user.findUnique({
        where: {
            id: Number(req.params.id),
        },
    });
    if (user === null)
        return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(user);
}));
router.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const user = yield db_1.Prisma.user.update({
        where: {
            id: id,
        },
        data: {
            state: false,
        },
    });
    if (user === null)
        return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado', data: user });
}));
router.put('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = Number(req.params.id);
    const user = yield db_1.Prisma.user.update({
        where: {
            id: id,
        },
        data: req.body,
    });
    if (user === null)
        return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json({ message: 'Usuario eliminado', data: user });
}));
router.post('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.body;
    const fields = ['name', 'email', 'password', 'nickname', 'name', 'lastname'];
    if (!validateJson(user, fields))
        return res.status(400).json({ message: 'Campos incompletos' });
    const salt = yield (0, bcrypt_ts_1.genSalt)(10);
    const hashedPassword = yield (0, bcrypt_ts_1.hash)(user.password, salt);
    user.password = hashedPassword;
    console.log(user);
    const newUser = yield db_1.Prisma.user.create({
        data: user,
    });
    res.json({ message: 'Usuario creado', data: newUser });
}));
function validateJson(json, fields) {
    for (const field of fields) {
        if (json[field] === null || json[field] === undefined)
            return false;
    }
    return true;
}
exports.default = router;
//# sourceMappingURL=users.routes.js.map