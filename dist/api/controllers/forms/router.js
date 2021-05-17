"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
exports.default = express_1.default
    .Router()
    .post('/with-resume', controller_1.default.sendWithResumeForm)
    .post('/without-resume', controller_1.default.sendWithoutResumeForm)
    .get('/without-resume', controller_1.default.getWithoutResumeForm);
