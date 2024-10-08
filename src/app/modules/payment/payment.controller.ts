// import { RequestHandler } from "express";
// import catchAsync from "../../utils/catchAsync";
// import { PaymentServices } from "./payment.service";



// const confirmPayment: RequestHandler = catchAsync(async (req, res) => {
//     const { transactionId, consumerName, status } = req.query;
//     const result = await PaymentServices.paymentConfirmationService(transactionId as string, consumerName as string, status as string);

//     res.send(result);
// });


// export const PaymentControllers = {
//     confirmPayment,
// }