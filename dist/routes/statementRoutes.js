"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.statementRouter = void 0;
const express_1 = require("express");
const statementControllers_1 = require("../controllers/statementControllers");
const authorize_1 = require("../middlewares/authorize");
exports.statementRouter = (0, express_1.Router)();
exports.statementRouter.post("/upload", authorize_1.authUser, statementControllers_1.uploadStatement);
