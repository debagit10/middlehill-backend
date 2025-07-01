"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStatement = exports.connectMono = void 0;
const axios_1 = __importDefault(require("axios"));
const userModel_1 = require("../models/userModel");
const mono_node_1 = require("mono-node");
const monoClient = new mono_node_1.Mono({ secretKey: String(process.env.MONO_SEC_KEY) });
const connectMono = async (req, res) => {
    const user_id = res.locals.user_id;
    try {
        const { code } = req.body;
        const response = await axios_1.default.post("https://api.withmono.com/account/auth", { code }, {
            headers: {
                "mono-sec-key": process.env.MONO_SEC_KEY,
            },
        });
        const { id: accountId } = response.data;
        await userModel_1.User.update({ mono_id: accountId }, { where: { id: user_id } });
        res.status(200).json({
            success: true,
            message: "Account linked successfully",
        });
        return;
    }
    catch (error) {
        console.error("Error in connectMono:", error);
        res
            .status(500)
            .json({ error: "Error connecting to mono", message: error.data });
        return;
    }
};
exports.connectMono = connectMono;
const getStatement = async (accountId) => {
    if (accountId == null || undefined) {
        return { error: "Account ID not found" };
    }
    // const response = await axios.get(
    //   `https://api.withmono.com/accounts/${accountId}/transactions`,
    //   {
    //     headers: {
    //       "mono-sec-key": process.env.MONO_SEC_KEY,
    //     },
    //   }
    // );
    // return response.data;
    const response = await monoClient.account.getAccountStatement({
        accountId: accountId,
        output: "json",
        period: "",
    }, (err, results) => {
        if (err)
            console.error("Statement error:", err);
        else
            console.log("Statement data:", results);
    });
    return response;
};
exports.getStatement = getStatement;
