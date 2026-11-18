import Razorpay from "razorpay";

export const getRazorpayClient = () => {
  const keyId =
    process.env.RAZORPAY_KEY_ID ||
    process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ||
    "rzp_test_U1eOl0c8ar5xna";
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET || "xwhNxGdMhPsZeqJfr2lYLKOy";

  if (!keyId || !keySecret) {
    console.warn("Razorpay credentials missing from environment.");
  }

  return new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });
};
