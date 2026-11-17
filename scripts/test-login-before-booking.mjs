const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("==============================================================");
  console.log("🚀 TESTING AUTHENTICATION ENFORCEMENT ON TICKET BOOKINGS");
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
    // STEP 1: Ensure User is Logged Out
    // ------------------------------------------------------------------------
    console.log("▶️ Step 1: Logging out to simulate unauthenticated visitor");
    const logoutRes = await fetch(`${BASE_URL}/api/auth/logout`, { method: "POST" });
    assert(logoutRes.ok, "Logged out successfully");

    // ------------------------------------------------------------------------
    // STEP 2: Attempting to Book Ticket without Logging In (Must be REJECTED 401)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Step 2: Attempting to book ticket while unauthenticated");
    const unauthBookingRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destinationId: "a2222222-2222-2222-2222-222222222222",
        destinationName: "Red Fort (Lal Qila)",
        timeSlotId: "slot-gen-1",
        visitDate: "2026-11-20",
        totalAmount: 50,
        visitors: [{ fullName: "Anonymous Visitor", age: 25, categoryName: "Indian Citizen" }],
      }),
    });

    assert(
      unauthBookingRes.status === 401,
      `API correctly blocked unauthenticated booking with HTTP 401 Unauthorized (got ${unauthBookingRes.status})`
    );
    const unauthData = await unauthBookingRes.json();
    assert(
      unauthData.error.includes("Authentication required") || unauthData.error.includes("log in"),
      `API returned clear message: "${unauthData.error}"`
    );

    // ------------------------------------------------------------------------
    // STEP 3: Checking /tickets UI for Unauthenticated Visitor
    // ------------------------------------------------------------------------
    console.log("\n▶️ Step 3: Checking /tickets UI displays 'Sign In Required' card");
    const ticketsPageRes = await fetch(`${BASE_URL}/tickets`);
    assert(ticketsPageRes.ok, "/tickets page rendered with HTTP 200");
    const ticketsHtml = await ticketsPageRes.text();
    assert(
      ticketsHtml.includes("Please Log In First to Book Tickets") ||
      ticketsHtml.includes("Explorer Sign In Required"),
      "Tickets page displays 'Please Log In First to Book Tickets' prompt"
    );

    // ------------------------------------------------------------------------
    // STEP 4: Explorer Logs in with Gmail (Abhinav Singh)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Step 4: Explorer logs in through Gmail");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "abhisingh940927@gmail.com",
        password: "Abhinav123!",
      }),
    });
    assert(loginRes.ok, `Login successful with HTTP 200 (got ${loginRes.status})`);
    const loginData = await loginRes.json();
    assert(loginData.success === true, "Login confirmed");
    assert(loginData.user.full_name === "Abhinav Singh", `Authenticated as ${loginData.user.full_name}`);

    // Retrieve cookies from login
    const cookieHeader = loginRes.headers.get("set-cookie") || "";

    // ------------------------------------------------------------------------
    // STEP 5: Booking Ticket after Logging In (Must SUCCEED with HTTP 201)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Step 5: Booking ticket as authenticated user");
    const authBookingRes = await fetch(`${BASE_URL}/api/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
      body: JSON.stringify({
        destinationId: "a2222222-2222-2222-2222-222222222222",
        destinationName: "Red Fort (Lal Qila)",
        destinationSlug: "red-fort",
        timeSlotId: "slot-gen-1",
        slotLabel: "Morning Batch (09:30 - 12:00)",
        visitDate: "2026-11-20",
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

    assert(authBookingRes.status === 201, `Booking accepted with HTTP 201 (got ${authBookingRes.status})`);
    const bookingData = await authBookingRes.json();
    assert(Boolean(bookingData.booking_reference), `Generated Reference: ${bookingData.booking_reference}`);
    assert(bookingData.contact_email === "abhisingh940927@gmail.com", `Pass issued to: ${bookingData.contact_email}`);

    console.log("\n==============================================================");
    console.log(`🏁 AUTH ENFORCEMENT TESTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==============================================================");

    if (failed > 0) process.exit(1);
  } catch (err) {
    console.error("Test error:", err);
    process.exit(1);
  }
}

runTests();
