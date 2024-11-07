import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

export const initiatePayment = async (paymentData: any) => {
    const response = await axios.post(process.env.PAYMENT_URL!, {
        store_id: process.env.AMARPAY_STORE_ID,
        signature_key: process.env.AMARPAY_SIGNATURE_KEY,
        tran_id: paymentData.transactionId,
        success_url: `http://localhost:4000/api/payment/confirmation?transactionId=${paymentData.transactionId}&status=Success&consumerName=${paymentData.userName}&userId=${paymentData?.userId}`,
        fail_url: `http://localhost:4000/api/payment/confirmation?status=Failed&consumerName=${paymentData.userName}`,
        cancel_url: `https://athloblitz.vercel.app/`,
        amount: paymentData.payableAmount,
        currency: "BDT",
        desc: "Merchant Registration Payment",
        cus_name: paymentData.userName,
        cus_email: paymentData.userEmail,
        cus_add1: "N/A",
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_state: "N/A",
        cus_postcode: "N/A",
        cus_country: "N/A",
        cus_phone: "N/A",
        type: "json"
    })

    return response.data;
};


export const verifyPayment = async (tnxId: string) => {
    const response = await axios.get(process.env.PAYMENT_VERIFY_URL!, {
        params: {
            store_id: process.env.AMARPAY_STORE_ID,
            signature_key: process.env.AMARPAY_SIGNATURE_KEY,
            type: 'json',
            request_id: tnxId,
        }
    })

    return response.data;
};