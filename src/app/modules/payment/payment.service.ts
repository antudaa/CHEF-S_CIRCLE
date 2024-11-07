import { join } from "path";
// import { Booking } from "../bookings/bookings.model";
import { verifyPayment } from "./payment.utils";
import { readFileSync } from "fs";
import { Types } from "mongoose";  // Ensure you import Types from mongoose
import { User } from "../user/user.model";
import { PremiumAccess } from "../premiumAccess/premiumAccess.model";

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};


const paymentConfirmationService = async (
    userId: string,
    transactionId: string,
    consumerName: string,
) => {
    // Step 1: Verify Payment
    const verifyResponse = await verifyPayment(transactionId);
    console.log("Response Is Verified => ", verifyResponse);

    let template: string;

    const userInfo = await User.findOne({ _id: userId })
    const paymentInfo = await PremiumAccess.findOne({ transactionId });
    console.log("From Payment Service Line 20 => ", paymentInfo)


    // Step 2: Fetch Booking Info with facility and user populated
    // const bookingInfo = await Booking.findOne({ transactionId })
    //     .populate<IBookingPopulated>('facility')
    //     .populate<IBookingPopulated>('user');


    // Step 3: Update Payment Status if Successful
    if (verifyResponse && verifyResponse.pay_status === "Successful") {
        await User.findOneAndUpdate(
            { _id: userId },
            { "paymentInfo.paymentStatus": "paid" },
            { new: true }
        );
        const filePathPaymentSuccess = join(__dirname, "../../../../public/Confirmation.html");

        try {
            template = readFileSync(filePathPaymentSuccess, "utf-8");
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to read template file: ${error.message}`);
            } else {
                throw new Error("Unknown error occurred while reading template file");
            }
        }

        // Step 5: Replace Template Placeholders with Booking Info
        template = template
            .replace("{{customerName}}", consumerName || "Customer")
            .replace("{{message}}", verifyResponse.pay_status || "Your payment was successful")
            .replace("{{facilityName}}", userInfo?.name || "Facility Name")
            .replace(
                "{{date}}",
                paymentInfo?.endDate ? formatDate(paymentInfo.date.toString()) : "Date"
            )
            .replace(
                "{{startTime}}",
                paymentInfo?.startDate ? formatDate(paymentInfo.startDate.toString()) : "Start Time"
            )
            .replace(
                "{{endTime}}",
                paymentInfo?.endDate ? formatDate(paymentInfo.endDate.toString()) : "End Time"
            )
            .replace("{{pricePerHour}}", paymentInfo?.payableAmount.toString() || "0")
            // .replace("{{bookedDate}}", bookingInfo?.date || "N/A")
            // .replace("{{address}}", bookingInfo?.facility.location || "Facility Location")
            .replace("{{subtotal}}", paymentInfo?.payableAmount.toString() || "0")
            .replace("{{total}}", paymentInfo?.payableAmount.toString() || "0")
            .replace("{{userImage}}", userInfo?.profileImage || "");

        return template;

    } else {


        const filePathPaymentFailed = join(__dirname, "../../../../public/ConfirmationFailed.html")

        try {
            template = readFileSync(filePathPaymentFailed, "utf-8");
        } catch (error: unknown) {
            if (error instanceof Error) {
                throw new Error(`Failed to read template file: ${error.message}`);
            } else {
                throw new Error("Unknown error occurred while reading template file");
            }
        }

        template = template
            .replace("{{customerName}}", consumerName || "Customer")
        return template;
    }

    // Step 4: Read HTML Template

};

export const PaymentServices = {
    paymentConfirmationService,
};
