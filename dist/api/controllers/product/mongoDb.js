"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    city_title: { type: String, requared: true },
    category: { type: String, requared: true },
    color: { type: String, requared: true },
    price: { type: String, requared: true },
    size: { type: String, requared: true },
    fit: { type: String, requared: true },
});
exports.default = mongoose_1.model("product", schema);
