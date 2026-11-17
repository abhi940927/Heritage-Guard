import QRCode from "qrcode";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("==============================================================");
  console.log("🚀 TESTING BOOKING CREATION & DYNAMIC QR CODE GENERATION");
  console.log(`🌐 Target: ${BASE_URL}`);
  console.log("==============================================================\n");

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // ------------------------------------------------------------------------
    // TEST 1: Booking 1 - Red Fort (Lal Qila) for Abhinav Singh
    // ------------------------------------------------------------------------
    console.log("▶️ Test 1: Booking 1 - Red Fort for Abhinav Singh");
    const res1 = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationId: "a2222222-2222-2222-2222-222222222222",
        destinationName: "Red Fort (Lal Qila)",
        destinationSlug: "red-fort",
        timeSlotId: "slot-gen-1",
        slotLabel: "Morning Batch (09:30 - 12:00)",
        visitDate: "2026-11-18",
        leadName: "Abhinav Singh",
        email: "abhisingh940927@gmail.com",
        phone: "+91 98765 43210",
        visitors: [
          {
            fullName: "Abhinav Singh",
            age: 28,
            categoryName: "Indian Citizen",
            idProofType: "Aadhaar Card",
            idProofNumber: "XXXX-XXXX-4512",
          },
        ],
        totalAmount: 50,
      }),
    });

    assert(res1.ok, `Booking 1 accepted with HTTP 201 (got ${res1.status})`);
    const b1 = await res1.json();
    assert(Boolean(b1.booking_reference), `Generated booking reference: ${b1.booking_reference}`);
    console.log(`  🎟️ Booking 1 Reference: ${b1.booking_reference}`);

    // Generate dynamic QR Code for booking 1
    const qr1 = await QRCode.toDataURL(JSON.stringify({ ref: b1.booking_reference, monument: b1.destination_name }));
    assert(qr1.startsWith("data:image/png;base64,"), "Successfully generated authentic QR Code Data URL for Booking 1");

    // ------------------------------------------------------------------------
    // TEST 2: Booking 2 - Second Booking (Must generate a DIFFERENT reference & QR)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 2: Booking 2 - Ensuring Unique Reference & QR Code Every Time");
    const res2 = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationId: "a1111111-1111-1111-1111-111111111111",
        destinationName: "Taj Mahal",
        destinationSlug: "taj-mahal",
        timeSlotId: "slot-gen-1",
        slotLabel: "Sunrise Batch (06:00 - 08:30)",
        visitDate: "2026-11-19",
        leadName: "Abhinav Singh",
        email: "abhisingh940927@gmail.com",
        phone: "+91 98765 43210",
        visitors: [
          {
            fullName: "Abhinav Singh",
            age: 28,
            categoryName: "Indian Citizen",
            idProofType: "Aadhaar Card",
            idProofNumber: "XXXX-XXXX-4512",
          },
        ],
        totalAmount: 50,
      }),
    });

    assert(res2.ok, `Booking 2 accepted with HTTP 201 (got ${res2.status})`);
    const b2 = await res2.json();
    console.log(`  🎟️ Booking 2 Reference: ${b2.booking_reference}`);

    assert(b1.booking_reference !== b2.booking_reference, `New distinct reference generated: ${b1.booking_reference} !== ${b2.booking_reference}`);

    const qr2 = await QRCode.toDataURL(JSON.stringify({ ref: b2.booking_reference, monument: b2.destination_name }));
    assert(qr1 !== qr2, "Every booking produces a unique, distinct dynamic QR Code!");

    // ------------------------------------------------------------------------
    // TEST 3: Turnstile Scan with Newly Issued Reference
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 3: Turnstile Entry Scan with Newly Issued Booking Reference");
    const scanRes = await fetch(`${BASE_URL}/api/crowd/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination_id: b1.destination_id,
        ticket_reference: b1.booking_reference,
        scan_type: "entry",
        gate_id: "DELHI_GATE_01",
      }),
    });
    assert(scanRes.ok, `Turnstile gate scan accepted ticket ${b1.booking_reference} with HTTP 200`);
    const scanData = await scanRes.json();
    assert(scanData.success === true, "Entry recorded in monument telemetry");

    console.log("\n==============================================================");
    console.log(`🏁 TESTS COMPLETED: ${passed} PASSED, ${failed} FAILED`);
    console.log("==============================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Test failed:", err);
    process.exit(1);
  }
}

runTests();
