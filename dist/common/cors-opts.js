"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
exports.corsOptions = {
    origin: process.env.NODE_ENV !== 'production' ? '*' : process.env.HOST_NAME,
    optionsSuccessStatus: 204,
    methods: 'GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS',
    preflightContinue: true,
    allowedHeaders: '*',
    credentials: true,
    exposedHeaders: ['set-cookie'],
};
exports.default = (req, res, next) => {
    if (req.method === 'OPTIONS' || req.method === 'HEAD') {
        const origin = req.headers.origin;
        res.header('Access-Control-Allow-Origin', origin);
        res.header('Access-Control-Allow-Credentials', 'true');
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, Content-Length, Origin, ' + 'X-Requested-With');
        res.sendStatus(200);
        return;
    }
    next();
};
