"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
__exportStar(require("axios"), exports);
const axios = axios_1.default.create();
axios.interceptors.request.use(config => {
    config.headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    console.log('Axios Request: ');
    console.log(JSON.stringify(config, null, 2));
    return config;
});
axios.interceptors.response.use(response => {
    // console.log('response => ', response);
    return response;
}, err => {
    console.log('Axios request ERROR: ');
    console.log(err);
    console.log('=====================');
    const { data } = err.response;
    const message = data && data.message ? data.message : 'Unhandled server error!';
    throw new Error(`${message}`);
});
exports.default = axios;
