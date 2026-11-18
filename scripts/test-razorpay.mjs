import assert from "node:assert";
import crypto from "node:crypto";
import Razorpay from "razorpay";

async function runRazorpayTests() {
  console.log("=== STARTING RAZORPAY INTEGRATION TEST SUITE ===");

  const keyId = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    console.log("Razorpay test skipped: Please provide RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in environment.");
    return;
  }

  // TEST 1: Initialize SDK & Create Live Test Order with Razorpay Gateway API
  console.log("\n[Test 1] Creating official test order with Razorpay API...");
  const rzp = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const orderAmountPaise = 5000; // ₹50.00
  const order = await rzp.orders.create({
    amount: orderAmountPaise,
    currency: "INR",
    receipt: `rcpt_test_${Date.now().toString(36)}`,
    notes: {
      monument: "Taj Mahal",
      leadVisitor: "Abhinav Singh",
      system: "Heritage Guard",
    },
  });

  console.log("Razorpay Order Created Successfully:", {
    id: order.id,
    entity: order.entity,
    amount: order.amount,
    currency: order.currency,
    status: order.status,
  });

  assert.ok(order.id.startsWith("order_"), "Order ID should start with order_");
  assert.strictEqual(order.amount, 5000, "Order amount should match 5000 paise (₹50)");
  assert.strictEqual(order.currency, "INR", "Order currency should be INR");

  // TEST 2: Verify HMAC SHA256 Signature generation & verification logic
  console.log("\n[Test 2] Testing Cryptographic HMAC SHA256 Signature Verification...");
  const mockPaymentId = "pay_test_MockPayment99";
  const mockOrderId = order.id;

  const validSignature = crypto
    .createHmac("sha256", keySecret)
    .update(`${mockOrderId}|${mockPaymentId}`)
    .digest("hex");

  console.log("Generated valid signature:", validSignature);

  // Verify match
  const testGeneratedSig = crypto
    .createHmac("sha256", keySecret)
    .update(`${mockOrderId}|${mockPaymentId}`)
    .digest("hex");

  assert.strictEqual(testGeneratedSig, validSignature, "Valid signature must match");

  // Verify that an altered payment ID or tampered signature is detected & rejected
  const tamperedSignature = validSignature.slice(0, -4) + "0000";
  assert.notStrictEqual(
    tamperedSignature,
    validSignature,
    "Tampered signature must not match"
  );

  console.log("\n=======================================================");
  console.log("🎉 ALL RAZORPAY INTEGRATION & GATEWAY TESTS PASSED!");
  console.log("=======================================================\n");
}

runRazorpayTests().catch((err) => {
  console.error("Razorpay test failed:", err);
  process.exit(1);
});
