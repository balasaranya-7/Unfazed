const crypto=require("crypto");
const Razorpay=require("razorpay");
const keyId=process.env.RAZORPAY_KEY_ID||"",keySecret=process.env.RAZORPAY_KEY_SECRET||"";
const razorpay=keyId&&keySecret?new Razorpay({key_id:keyId,key_secret:keySecret}):null;
const createOrder=async({amount,currency="INR",receipt,notes={}})=>{if(!razorpay)throw new Error("Razorpay test keys are not configured");return razorpay.orders.create({amount:Math.round(Number(amount)*100),currency,receipt,notes});};
const verifyPaymentSignature=({orderId,paymentId,signature})=>{if(!keySecret||!orderId||!paymentId||!signature)return false;const e=crypto.createHmac("sha256",keySecret).update(`${orderId}|${paymentId}`).digest("hex");return crypto.timingSafeEqual(Buffer.from(e),Buffer.from(signature));};
const verifyWebhookSignature=(raw,signature)=>{if(!keySecret||!signature)return false;const e=crypto.createHmac("sha256",keySecret).update(raw).digest("hex");return crypto.timingSafeEqual(Buffer.from(e),Buffer.from(signature));};
module.exports={keyId,createOrder,verifyPaymentSignature,verifyWebhookSignature};
