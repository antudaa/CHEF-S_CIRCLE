// import { join } from "path";
// import { Booking } from "../bookings/bookings.model";
// import { verifyPayment } from "./payment.utils";
// import { readFileSync } from "fs";
// import { Types } from "mongoose";  // Ensure you import Types from mongoose

// // Define interfaces for Facility and User
// interface IFacility {
//   _id: Types.ObjectId;
//   name: string;
//   pricePerHour: number;
//   location: string;
//   images: string[];
// }

// interface IUser {
//   _id: Types.ObjectId;
//   name: string;
//   email: string;
// }

// // Extend Booking Interface with Populated Fields
// interface IBookingPopulated {
//   transactionId: string;
//   paymentStatus: string;
//   startTime: string;
//   endTime: string;
//   date: string;
//   payableAmount: number;
//   facility: IFacility;
//   user: IUser;
// }

// const paymentConfirmationService = async (
//   transactionId: string,
//   consumerName: string,
//   status: string
// ) => {
//   // Step 1: Verify Payment
//   const verifyResponse = await verifyPayment(transactionId);

//   let template: string;

//   // Step 2: Fetch Booking Info with facility and user populated
//   const bookingInfo = await Booking.findOne({ transactionId })
//     .populate<IBookingPopulated>('facility')  // Explicitly populate with IFacility
//     .populate<IBookingPopulated>('user');  // Explicitly populate with IUser


//   // Step 3: Update Payment Status if Successful
//   if (verifyResponse && verifyResponse.pay_status === "Successful") {
//     await Booking.findOneAndUpdate(
//       { transactionId },
//       { paymentStatus: "paid" },
//       { new: true }
//     );
//     const filePathPaymentSuccess = join(__dirname, "../../../../public/Confirmation.html");

//     try {
//       template = readFileSync(filePathPaymentSuccess, "utf-8");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`Failed to read template file: ${error.message}`);
//       } else {
//         throw new Error("Unknown error occurred while reading template file");
//       }
//     }

//     // Step 5: Replace Template Placeholders with Booking Info
//     template = template
//       .replace("{{customerName}}", consumerName || "Customer")
//       .replace("{{message}}", status || "Your payment was successful")
//       .replace("{{facilityName}}", bookingInfo?.facility.name || "Facility Name")
//       .replace("{{startTime}}", bookingInfo?.startTime || "Start Time")
//       .replace("{{endTime}}", bookingInfo?.endTime || "End Time")
//       .replace("{{pricePerHour}}", bookingInfo?.facility.pricePerHour.toString() || "0")
//       .replace("{{bookedDate}}", bookingInfo?.date || "N/A")
//       .replace("{{address}}", bookingInfo?.facility.location || "Facility Location")
//       .replace("{{subtotal}}", bookingInfo?.payableAmount.toString() || "0")
//       .replace("{{total}}", bookingInfo?.payableAmount.toString() || "0")
//       .replace("{{facilityImage}}", bookingInfo?.facility.images?.[0] || "");

//     return template;

//   } else {


//     const filePathPaymentFailed = join(__dirname, "../../../../public/ConfirmationFailed.html")

//     try {
//       template = readFileSync(filePathPaymentFailed, "utf-8");
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new Error(`Failed to read template file: ${error.message}`);
//       } else {
//         throw new Error("Unknown error occurred while reading template file");
//       }
//     }

//     template = template
//       .replace("{{customerName}}", consumerName || "Customer")
//     return template;
//   }

//   // Step 4: Read HTML Template

// };

// export const PaymentServices = {
//   paymentConfirmationService,
// };
