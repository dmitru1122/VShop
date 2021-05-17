"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prepareBody = (data = {}) => {
    const dataArray = Object.entries(data);
    return Object.entries(data)
        .map((val, ind) => ind === dataArray.length - 1
        ? `${val[0]}=${encodeURIComponent(val[1])}`
        : `${val[0]}=${encodeURIComponent(val[1])}&`)
        .join('');
};
exports.default = prepareBody;
