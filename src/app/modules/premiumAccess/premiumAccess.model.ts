import mongoose, { Schema, model } from "mongoose";
import { PremiumAccessModel, TPremiumAccess } from "./premiumAccess.interface";
import { User } from "../user/user.model";
import AppError from "../../Errors/AppError";

const premiumAccessSchema = new Schema<TPremiumAccess, PremiumAccessModel>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            unique: true,
            required: [true, "User reference is required"],
        },
        date: {
            type: Date,
            required: [true, "Date is required"],
            default: Date.now(),
        },
        startDate: {
            type: Date,
            required: [true, "Start date is required"],
        },
        endDate: {
            type: Date,
            required: [true, "End date is required"],
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "successful", "failed"],
            default: "pending",
        },
        transactionId: {
            type: String,
            required: [true, "Transaction ID is required"],
        },
        payableAmount: {
            type: Number,
            required: [true, "Payable amount is required"],
            min: [0, "Payable amount cannot be negative"],
        },
        isPremiumMember: {
            type: Boolean,
            default: true,
        },
        isAccessExpired: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,  // Adds createdAt and updatedAt fields
    }
);

// Middleware to verify user existence before saving
premiumAccessSchema.pre("save", async function (next) {
    const premiumAccess = this;
    const userExists = await User.exists({ _id: premiumAccess.user });

    if (!userExists) {
        return next(new AppError(400, "User not found!"));
    }

    next();
});

// Method to calculate payable amount based on date range
premiumAccessSchema.statics.calculatePayableAmount = function (
    startDate: Date,
    endDate: Date,
    price: number
): number {
    const months = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
    return months * price;
};

// Method to check if access has expired
premiumAccessSchema.methods.checkIfExpired = function (): boolean {
    return new Date() > this.endDate;
};

// Method to update the user's premium access status
premiumAccessSchema.statics.updateAccessStatus = async function (
    userId: mongoose.Types.ObjectId,
    status: "successful" | "failed"
): Promise<void> {
    const premiumAccess = await this.findOne({ user: userId });
    if (premiumAccess) {
        premiumAccess.paymentStatus = status;
        premiumAccess.isAccessExpired = status === "successful" ? false : true;
        await premiumAccess.save();
    }
};

export const PremiumAccess = model<TPremiumAccess, PremiumAccessModel>(
    "PremiumAccess",
    premiumAccessSchema
);
