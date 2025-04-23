"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signUpUser = void 0;
const userServices_1 = require("../services/userServices");
const signUpUser = async (req, res) => {
    const registerData = req.body;
    try {
        const userCheck = await (0, userServices_1.userExists)(registerData.phone_number);
        if (userCheck.exists) {
            return res
                .status(409)
                .json({ error: "User already exists and verified" });
        }
        if (userCheck.error === "User found but not verified") {
            return res.status(409).json({ error: "User found but not verified" });
        }
        if (userCheck.error === "Error checking user existence") {
            return res.status(500).json({ error: "Internal server error" });
        }
        const response = await (0, userServices_1.addUser)(registerData);
        if (response.success) {
            return res
                .status(201)
                .json({ success: "User signed up successfully", data: response.data });
        }
        return res.status(400).json({ error: "Unable to register user" });
    }
    catch (error) {
        console.error("Error registering user", error);
        return res.status(500).json({ error: "Error registering user" });
    }
};
exports.signUpUser = signUpUser;
