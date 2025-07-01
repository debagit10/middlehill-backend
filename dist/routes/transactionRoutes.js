"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionRouter = void 0;
const express_1 = require("express");
const transactionControllers_1 = require("../controllers/transactionControllers");
const authorize_1 = require("../middlewares/authorize");
const authenticate_1 = require("../middlewares/authenticate");
exports.transactionRouter = (0, express_1.Router)();
exports.transactionRouter.post("/add", authorize_1.authUser, transactionControllers_1.addTransaction);
exports.transactionRouter.get("/get", authorize_1.authUser, transactionControllers_1.getTransactions);
exports.transactionRouter.get("/getAll", authorize_1.authAdmin, (0, authenticate_1.authorizeAdmin)("admin"), transactionControllers_1.allTransactions); // auth admin
exports.transactionRouter.delete("/delete/:transaction_id", authorize_1.authUser, transactionControllers_1.deleteTransaction);
