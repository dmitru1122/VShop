"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const router_1 = __importDefault(require("./api/controllers/ping-sf/router"));
const router_2 = __importDefault(require("./api/controllers/sending-email/router"));
const router_3 = __importDefault(require("./api/controllers/product/router"));
const mainRoute = '/api/v1';
function routes(app) {
    app.use(`${mainRoute}/ping-sf`, router_1.default);
    app.use(`${mainRoute}/send-email`, router_2.default);
    app.use(`${mainRoute}/product`, router_3.default);
}
exports.default = routes;
