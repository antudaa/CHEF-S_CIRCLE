import { RequestHandler } from "express";
import catchAsync from "../../utils/catchAsync";
import { PaymentServices } from "./payment.service";

const confirmPayment: RequestHandler = catchAsync(async (req, res) => {
    const { userId, consumerName, transactionId } = req.query;

    const result = await PaymentServices.paymentConfirmationService(userId as string, transactionId as string, consumerName as string);

    res.send(result);
});


export const PaymentControllers = {
    confirmPayment,
}