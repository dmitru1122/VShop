"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const http_1 = __importDefault(require("http"));
const os_1 = __importDefault(require("os"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const swagger_1 = __importDefault(require("./swagger"));
const cors_opts_1 = __importStar(require("./cors-opts"));
const app = express_1.default();
const env = process.env.NODE_ENV || 'dev';
class ExpressServer {
    constructor() {
        const root = path_1.default.normalize(__dirname + '/../');
        const publicDir = `${root}public`;
        app.use(cors_1.default(cors_opts_1.corsOptions));
        app.use(body_parser_1.default.json({ limit: process.env.REQUEST_LIMIT || '2000mb' }));
        app.use(body_parser_1.default.urlencoded({ extended: true, limit: process.env.REQUEST_LIMIT || '2000mb' }));
        app.use(body_parser_1.default.text({ limit: process.env.REQUEST_LIMIT || '2000mb' }));
        app.use(cookie_parser_1.default(process.env.SESSION_SECRET));
        // if (env === 'dev') {
        const devDir = path_1.default.normalize(__dirname + '/../..');
        app.use(cors_opts_1.default);
        app.use(express_1.default.static(`${devDir}/public`));
        // } else {
        //   console.log('\nRoot directory: ', root, '\n');
        //   console.log('================');
        //   fs.readdirSync(root).forEach(file => {
        //     console.log(file);
        //   });
        //   console.log('================\n');
        //   console.log('Public directory: ', publicDir, '\n');
        //   console.log('================');
        //   fs.readdirSync(publicDir).forEach(file => {
        //     console.log(file);
        //   });
        //   console.log('================\n');
        //   app.use(express.static(publicDir));
        //   app.use(history());
        //   app.use(express.static(publicDir));
        //   app.get('/', (_req, res) => {
        //     res.sendFile(`${publicDir}/index.html`);
        //   });
        // }
        // if (['production', 'pre-production'].includes(env)) {
        //   app.use(express.static(`${root}/build/public`));
        //   app.use(history());
        //   app.use(express.static(`${root}/build/public`));
        //   app.get('/', (_req, res) => {
        //     res.sendFile(`${root}/build/public/index.html`);
        //   });
        // } else {
        //   app.use(express.static(`${root}/public`));
        // }
    }
    router(routes) {
        this.routes = routes;
        return this;
    }
    listen(port) {
        const welcome = (p) => () => console.log(`Server is up and running in ${env} mode | @Host: ${os_1.default.hostname()} | on port: ${p}}`);
        swagger_1.default(app, this.routes)
            .then(() => {
            http_1.default.createServer(app).listen(port, welcome(port));
        })
            .catch(err => {
            console.log('Starting server ERROR: ', err);
            process.exit(1);
        });
        return app;
    }
}
exports.default = ExpressServer;
