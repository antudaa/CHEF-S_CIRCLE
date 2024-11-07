import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { getUserIdFromToken } from "../../middlewares/auth";
import { PremiumAccessServices } from "./premiumAccess.service";
import sendResponse from "../../utils/sendResponse";
import httpStatus from "http-status";

const purchasePremiumAccess: RequestHandler = catchAsync(async (req, res) => {
    const userId = getUserIdFromToken(req);

    const PremiumAccessInfo = { ...req.body, user: userId };
    const result = await PremiumAccessServices.purchasePremium(PremiumAccessInfo);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Premium Access Successfull",
        data: result,
    })
});

export const purchasePremiumAccessControllers = {
    purchasePremiumAccess,
}