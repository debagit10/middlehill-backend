"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBusiness = exports.updateBusinessSuspension = exports.businessTxn = exports.businessDetails = exports.getBusinesses = void 0;
const businessServices_1 = require("../services/businessServices");
const getBusinesses = async (req, res) => {
    try {
        const response = await businessServices_1.business_Services.businessList();
        if (response.businesses == null) {
            res.status(404).json({ error: "No businesses found" });
            return;
        }
        res.status(200).json(response);
        return;
    }
    catch (error) {
        console.log("Error in get businesses controller", error);
        res.status(500).json({ error: "Failed to get businesses" });
        return;
    }
};
exports.getBusinesses = getBusinesses;
const businessDetails = async (req, res) => {
    const { business_id } = req.params;
    try {
        const response = await businessServices_1.business_Services.businessDetails(business_id);
        if (response.error) {
            res.status(500).json({ error: response.error });
            return;
        }
        res.status(200).json(response);
        return;
    }
    catch (error) {
        console.log("Error in get business details controller", error);
        res.status(500).json({ error: "Failed to get business details" });
        return;
    }
};
exports.businessDetails = businessDetails;
const businessTxn = async (req, res) => {
    const { business_id } = req.params;
    try {
        const response = await businessServices_1.business_Services.businessTxn(business_id);
        if (response.transactions == null) {
            res.status(404).json({ error: response.error });
            return;
        }
        res.status(200).json(response);
        return;
    }
    catch (error) {
        console.log("Error in get business transaction controller", error);
        res.status(500).json({ error: "Failed to get business transactions" });
        return;
    }
};
exports.businessTxn = businessTxn;
const updateBusinessSuspension = async (req, res) => {
    const { business_id } = req.params;
    const { suspend } = req.body;
    try {
        const response = await businessServices_1.business_Services.toggleBusinessSuspension(business_id, suspend);
        if (response.error) {
            res.status(400).json(response);
            return;
        }
        res.status(200).json(response);
        return;
    }
    catch (error) {
        console.log("Error in update business suspension controller", error);
        res
            .status(500)
            .json({ error: "Failed to update business suspension transactions" });
        return;
    }
};
exports.updateBusinessSuspension = updateBusinessSuspension;
const deleteBusiness = async (req, res) => {
    const { business_id } = req.params;
    try {
        const response = await businessServices_1.business_Services.deleteBusiness(business_id);
        if (response.error) {
            res.status(400).json(response);
            return;
        }
        res.status(200).json(response);
        return;
    }
    catch (error) {
        console.log("Error in delete business controller", error);
        res.status(500).json({ error: "Failed to delete business" });
        return;
    }
};
exports.deleteBusiness = deleteBusiness;
