"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const swagger_express_middleware_1 = __importDefault(require("swagger-express-middleware"));
const error_handler_1 = __importDefault(require("../api/middlewares/error.handler"));
function default_1(app, routes) {
    return new Promise((resolve, reject) => {
        swagger_express_middleware_1.default(path_1.default.join(__dirname, 'api.yml'), app, function (err, _middleware) {
            if (err) {
                return reject(err);
            }
            // Enable Express' case-sensitive and strict options
            // (so "/entities", "/Entities", and "/Entities/" are all different)
            app.enable('case sensitive routing');
            app.enable('strict routing');
            app.use(_middleware.metadata());
            app.use(_middleware.files(app, {
                apiPath: process.env.SWAGGER_API_SPEC,
            }));
            app.use(_middleware.parseRequest({
                // Configure the cookie parser to use secure cookies
                cookie: {
                    secret: process.env.SESSION_SECRET,
                },
                // Don't allow JSON content over 100kb (default is 1mb)
                json: {
                    limit: process.env.REQUEST_LIMIT,
                },
            }));
            // These two middleware don't have any options (yet)
            app.use(_middleware.CORS(), _middleware.validateRequest());
            routes(app);
            // eslint-disable-next-line no-unused-vars, no-shadow
            app.use(error_handler_1.default);
            resolve();
        });
    });
}
exports.default = default_1;
