"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addUser = exports.userExists = void 0;
const userModel_1 = require("../models/userModel");
const userExists = async (phone_number) => {
    try {
        const user = await userModel_1.User.findOne({
            where: { phone_number, deleted: false, suspended: false },
        });
        if (!user) {
            return { exists: false };
        }
        if (user.dataValues.verified) {
            return { exists: true };
        }
        return { exists: false, error: "User found but not verified" };
    }
    catch (error) {
        console.error("Error checking if user exists", error);
        return { exists: false, error: "Error checking user existence" };
    }
};
exports.userExists = userExists;
const addUser = async (data) => {
    try {
        const newUser = await userModel_1.User.create({ ...data, verified: false });
        return { success: true, data: newUser };
    }
    catch (error) {
        console.log("Error registering user", error);
        return { error: { "Error registering user": error } };
    }
};
exports.addUser = addUser;
