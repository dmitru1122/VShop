"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
require("./common/env");
const server_1 = __importDefault(require("./common/server"));
const routes_1 = __importDefault(require("./routes"));
const port = parseInt((_a = process.env.PORT) !== null && _a !== void 0 ? _a : '3000');
exports.default = new server_1.default().router(routes_1.default).listen(port);
