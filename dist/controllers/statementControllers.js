"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadStatement = void 0;
const mono_1 = require("../utils/mono");
const userServices_1 = require("../services/userServices");
const uploadStatement = async (req, res) => {
    const user_id = res.locals.user_id;
    try {
        const { error, user } = await userServices_1.userServices.getUser(user_id);
        if (error) {
            res.status(500).json(error);
            return;
        }
        const statement = await (0, mono_1.getStatement)(user?.dataValues.mono_id);
        if (statement.error) {
            res.status(500).json(statement.error);
            return;
        }
        res.status(200).json(statement);
    }
    catch (error) {
        console.error("Error uploading statement", error);
        res.status(500).json({ error: "Error uploading statement " });
        return;
    }
};
exports.uploadStatement = uploadStatement;
