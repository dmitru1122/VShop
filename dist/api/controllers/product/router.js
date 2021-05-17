"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = __importDefault(require("./controller"));
exports.default = express_1.default
    .Router()
    // .get('/s', controller.getVacancySalesforce)
    // .post('/s', controller.sendVacancySalesforce)
    // .get('/m', controller.getVacancyMongoDb)
    // .post('/m', controller.sendVacancyMongoDb);
    // .get('/jeans', controller.getJeansSalesforce)
    // .post('/jeans', controller.sendJeansSalesforce)
    .get('/jeans', controller_1.default.getJeansMongoDb)
    .post('/jeans', controller_1.default.sendJeansMongoDb);
// .get('/shoes', controller.getShoesSalesforce)
// .post('/shoes', controller.sendShoesSalesforce)
// .get('/shoes', controller.getShoesMongoDb)
// .post('/shoes', controller.sendShoesMongoDb);
// .get('/jacket', controller.getJacketSalesforce)
// .post('/jacket', controller.sendJacketSalesforce)
// .get('/jacket', controller.getJacketMongoDb)
// .post('/jacket', controller.sendJacketMongoDb);
// .get('/shirt', controller.getShirtSalesforce)
// .post('/shirt', controller.sendShirtSalesforce)
// .get('/shirt', controller.getShirtMongoDb)
// .post('/shirt', controller.sendShirtMongoDb);
