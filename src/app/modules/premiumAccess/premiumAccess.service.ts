import mongoose, { Types } from "mongoose";
import { TPremiumAccess } from "./premiumAccess.interface";
import AppError from "../../Errors/AppError";
import httpStatus from "http-status";
import { User } from "../user/user.model";
import { PremiumAccess } from "./premiumAccess.model";
import { initiatePayment } from "../payment/payment.utils";

const purchasePremium = async (payload: TPremiumAccess) => {
    const { user, startDate, endDate, pricePerMonth } = payload;
    const session = await mongoose.startSession();

    try {
        session.startTransaction();

        // Fetch user information
        const userInfo = await User.findById(user).session(session);

        if (!userInfo) {
            throw new AppError(httpStatus.BAD_REQUEST, "User does not exist");
        }

        // Generate transaction ID and create a new PremiumAccess document
        const transactionId = `TXN-${Date.now()}-${userInfo?._id}`;
        const premiumaccess = new PremiumAccess({
            user,
            startDate,
            endDate,
            paymentStatus: "pending",
            transactionId,
            payableAmount: pricePerMonth,
        });

        // Save premium access record within the session
        await premiumaccess.save({ session });

        // Prepare payment data
        const paymentData = {
            userId: user,
            transactionId,
            payableAmount: pricePerMonth,
            userName: userInfo?.name,
            userEmail: userInfo?.email,
        };

        // Initiate payment
        const paymentSession = await initiatePayment(paymentData);

        // Commit transaction if payment initiation is successful
        await session.commitTransaction();
        return paymentSession;

    } catch (error) {
        await session.abortTransaction();
        console.error("Error during Premium Access Purchase:", error);
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to Purchase Premium Access");
    } finally {
        session.endSession();
    }
};


export const PremiumAccessServices = {
    purchasePremium,
}