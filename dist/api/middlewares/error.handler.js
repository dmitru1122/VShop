"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Error handler to display the error as HTML
// eslint-disable-next-line no-unused-vars, no-shadow
function errorHandler(err, _req, res, _next) {
    res.status(err.status || 500);
    res.send(`<h1>${err.status || 500} Error</h1>` + `<pre>${err.message}</pre>`);
}
exports.default = errorHandler;
