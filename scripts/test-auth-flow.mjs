/**
 * Verification test for Registration & Login with Supabase-aligned User Data
 * Tests Name placeholder, DOB, optional phone number, 8-character password enforcement,
 * and seamless login using registered Gmail.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("==============================================================");
  console.log("🚀 STARTING EXPLORER REGISTRATION & GMAIL LOGIN FLOW TESTS");
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
    // TEST 1: Password < 8 characters validation (Must be rejected)
    // ------------------------------------------------------------------------
    console.log("▶️ Test 1: Password Length Enforcement (< 8 characters rejected)");
    const shortPassRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Abhinav Singh",
        email: "abhinav.singh@gmail.com",
        dob: "1998-05-14",
        password: "short", // Only 5 characters
      }),
    });
    assert(shortPassRes.status === 400, `Rejected short password with HTTP 400 (got ${shortPassRes.status})`);
    const shortPassData = await shortPassRes.json();
    assert(
      shortPassData.error.includes("8 characters"),
      `Error specifies 8 characters requirement: "${shortPassData.error}"`
    );

    // ------------------------------------------------------------------------
    // TEST 2: Successful Registration of Explorer Abhinav Singh
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 2: Full Registration of Abhinav Singh with DOB and optional phone");
    const testEmail = `abhinav.singh.${Date.now()}@gmail.com`;
    const testPassword = "MySecurePass2026!";

    const regRes = await fetch(`${BASE_URL}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: "Abhinav Singh",
        email: testEmail,
        dob: "1998-05-14",
        phone_number: "+91 98765 43210",
        password: testPassword,
      }),
    });
    assert(regRes.ok, `Registration accepted with HTTP 200 (got ${regRes.status})`);
    const regData = await regRes.json();
    assert(regData.success === true, "Registration marked success");
    assert(regData.user.full_name === "Abhinav Singh", `Saved full name is Abhinav Singh (got ${regData.user.full_name})`);
    assert(regData.user.email === testEmail, `Saved Gmail is ${testEmail}`);
    assert(regData.user.dob === "1998-05-14", `Saved DOB is 1998-05-14 (got ${regData.user.dob})`);
    assert(regData.user.phone_number === "+91 98765 43210", `Saved phone number is +91 98765 43210`);

    // ------------------------------------------------------------------------
    // TEST 3: Login through that Gmail with Incorrect Password (Must fail)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 3: Login through Gmail with Wrong Password");
    const wrongLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: "WrongPassword999!",
      }),
    });
    assert(wrongLoginRes.status === 401, `Rejected wrong credentials with HTTP 401 (got ${wrongLoginRes.status})`);

    // ------------------------------------------------------------------------
    // TEST 4: Login through that Gmail with Correct Password
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 4: Successful Login through that Gmail");
    const loginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    assert(loginRes.ok, `Login successful with HTTP 200 (got ${loginRes.status})`);
    const loginData = await loginRes.json();
    assert(loginData.success === true, "Login confirmed success");
    assert(loginData.user.full_name === "Abhinav Singh", `Logged in user is Abhinav Singh`);
    assert(loginData.user.dob === "1998-05-14", `Verified DOB preserved on login`);

    // ------------------------------------------------------------------------
    // TEST 5: Active User Session Endpoint (/api/auth/me)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 5: Fetch Active Session (/api/auth/me)");
    const meRes = await fetch(`${BASE_URL}/api/auth/me`);
    assert(meRes.ok, "GET /api/auth/me returned HTTP 200 OK");
    const meData = await meRes.json();
    assert(meData.authenticated === true, "Active user session confirmed authenticated");
    assert(meData.user.full_name === "Abhinav Singh", "Session belongs to Abhinav Singh");

    console.log("\n==============================================================");
    console.log(`🏁 AUTH FLOW TESTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==============================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Unhandled Error:", error);
    process.exit(1);
  }
}

runTests();
