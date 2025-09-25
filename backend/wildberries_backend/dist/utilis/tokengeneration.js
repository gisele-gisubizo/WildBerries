"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokengeneration = tokengeneration;
const uuid_1 = require("uuid");
function tokengeneration() {
    return (0, uuid_1.v4)();
}
