"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.business_Services = void 0;
const transactionModel_1 = require("../models/transactionModel");
const userModel_1 = require("../models/userModel");
const userProfileModel_1 = require("../models/userProfileModel");
const businessList = async () => {
    try {
        const businesses = await userModel_1.User.findAll({
            where: { deleted: false, verified: true },
            order: [["createdAt", "DESC"]],
        });
        if (!businesses.length) {
            return { error: "No businesses found.", businesses: null };
        }
        return {
            success: "Businesses retrieved",
            businesses,
            count: businesses.length,
        };
    }
    catch (error) {
        console.error("Error retrieving businesses:", error);
        return { error: "Error getting businesses" };
    }
};
const businessDetails = async (business_id) => {
    try {
        const details = await userModel_1.User.findOne({
            where: {
                id: business_id,
                deleted: false,
                verified: true,
            },
            attributes: [
                "id",
                "first_name",
                "last_name",
                "phone_number",
                "suspended",
            ],
            include: [
                {
                    model: userProfileModel_1.User_Profile,
                    attributes: { exclude: ["createdAt", "updatedAt", "id", "user_id"] },
                },
                {
                    model: transactionModel_1.Transaction,
                    attributes: { exclude: ["updatedAt", "user_id"] },
                },
            ],
        });
        return { success: "Details gotten", details };
    }
    catch (error) {
        console.error("Error retrieving business details:", error);
        return { error: "Error getting business details" };
    }
};
const businessTxn = async (business_id) => {
    try {
        const transactions = await transactionModel_1.Transaction.findAll({
            where: {
                user_id: business_id,
                deleted: false,
            },
            order: [["createdAt", "DESC"]],
        });
        if (!transactions.length) {
            return { error: "No transactions found", transactions: null };
        }
        return {
            success: "Transactions found",
            transactions,
            count: transactions.length,
        };
    }
    catch (error) {
        console.error("Error retrieving business transactions:", error);
        return { error: "Error getting business transactions" };
    }
};
const toggleBusinessSuspension = async (business_id, suspend) => {
    try {
        const result = await userModel_1.User.update({ suspended: suspend }, { where: { id: business_id } });
        if (result[0] === 0) {
            return {
                error: `Failed to ${suspend ? "suspend" : "reinstate"} business.`,
            };
        }
        return {
            success: `Business ${suspend ? "suspended" : "reinstated"} successfully`,
        };
    }
    catch (error) {
        console.error(`Error in ${suspend ? "suspending" : "reinstating"} business:`, error);
        return {
            error: `Error ${suspend ? "suspending" : "reinstating"} business`,
        };
    }
};
const deleteBusiness = async (business_id) => {
    try {
        const result = await userModel_1.User.update({ deleted: true }, { where: { id: business_id } });
        if (result[0] === 0) {
            return { error: "Failed to delete business." };
        }
        return { success: "Business deleted successfully" };
    }
    catch (error) {
        console.log("Error in deleting business", error);
        return { error: "Error deleting business" };
    }
};
exports.business_Services = {
    businessList,
    businessTxn,
    businessDetails,
    toggleBusinessSuspension,
    deleteBusiness,
};
