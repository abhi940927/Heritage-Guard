import assert from "node:assert";

const BASE_URL = "http://localhost:3000";

async function runTests() {
  console.log("=== STARTING 3-HOUR QR CODE EXPIRATION TEST SUITE ===");

  const testRef = `HG-TEST-${Math.floor(10000 + Math.random() * 90000)}`;
  const destinationId = "red-fort";
  const now = Date.now();
  const threeHoursMs = 3 * 60 * 60 * 1000;

  // TEST 1: Register fresh ticket issuance with current timestamp
  console.log(`\n[Test 1] Registering fresh QR code issuance for ticket: ${testRef}...`);
  const regRes = await fetch(`${BASE_URL}/api/crowd/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "register",
      ticket_reference: testRef,
      qr_issued_timestamp_ms: now,
    }),
  });

  const regData = await regRes.json();
  console.log("Registration Response:", regData);
  assert.strictEqual(regRes.status, 200, "Registration should succeed with HTTP 200");
  assert.strictEqual(regData.success, true, "Registration success should be true");
  assert.strictEqual(regData.validity_hours, 3, "Pass validity window must be 3 hours");
  assert.strictEqual(regData.is_expired, false, "Fresh ticket must not be expired");

  // TEST 2: Simulate Turnstile Entry Scan within 3-hour window (+1 hour)
  console.log(`\n[Test 2] Simulating Turnstile Entry Scan 1 hour after issuance (within 3h window)...`);
  const validScanRes = await fetch(`${BASE_URL}/api/crowd/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      destination_id: destinationId,
      ticket_reference: testRef,
      scan_type: "entry",
      gate_id: "GATE-NORTH-TEST",
      custom_scan_timestamp_ms: now + 3600 * 1000, // +1 hour
    }),
  });

  const validScanData = await validScanRes.json();
  console.log("Scan Response (Within 3h):", validScanData);
  assert.strictEqual(validScanRes.status, 200, "Scan within 3-hour window should succeed with HTTP 200");
  assert.strictEqual(validScanData.success, true, "Scan should be approved");

  // TEST 3: Simulate Turnstile Scan with an Expired QR Code (>3 hours)
  const expiredRef = `HG-EXPIRED-${Math.floor(10000 + Math.random() * 90000)}`;
  console.log(`\n[Test 3] Simulating Turnstile Scan 3 hours and 15 minutes after issuance: ${expiredRef}...`);
  
  // Register issued 3 hours and 15 minutes ago
  const issuedPast = now - (threeHoursMs + 15 * 60 * 1000);
  await fetch(`${BASE_URL}/api/crowd/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "register",
      ticket_reference: expiredRef,
      qr_issued_timestamp_ms: issuedPast,
    }),
  });

  const expiredScanRes = await fetch(`${BASE_URL}/api/crowd/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      destination_id: destinationId,
      ticket_reference: expiredRef,
      scan_type: "entry",
      custom_scan_timestamp_ms: now,
    }),
  });

  const expiredScanData = await expiredScanRes.json();
  console.log("Scan Response (Expired):", expiredScanData);
  assert.strictEqual(expiredScanRes.status, 410, "Expired QR scan should return HTTP 410 Gone / Expired");
  assert.strictEqual(expiredScanData.success, false, "Scan must be rejected");
  assert.strictEqual(expiredScanData.rejectionCode, "QR_EXPIRED", "Rejection code must be QR_EXPIRED");
  assert.match(expiredScanData.error, /QR Code expired/i, "Error message must state QR code expired");

  // TEST 4: Regenerate / Refresh Expired QR Code and verify Scan now succeeds
  console.log(`\n[Test 4] Regenerating fresh 3-hour gate pass for: ${expiredRef}...`);
  const refreshRes = await fetch(`${BASE_URL}/api/crowd/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "refresh",
      ticket_reference: expiredRef,
      qr_issued_timestamp_ms: Date.now(),
    }),
  });

  const refreshData = await refreshRes.json();
  console.log("Refresh Response:", refreshData);
  assert.strictEqual(refreshRes.status, 200, "Refresh must return HTTP 200");
  assert.strictEqual(refreshData.is_expired, false, "Refreshed pass must be active");

  const scanAfterRefreshRes = await fetch(`${BASE_URL}/api/crowd/scan`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      destination_id: destinationId,
      ticket_reference: expiredRef,
      scan_type: "entry",
    }),
  });

  const scanAfterRefreshData = await scanAfterRefreshRes.json();
  console.log("Scan Response After Renewal:", scanAfterRefreshData);
  assert.strictEqual(scanAfterRefreshRes.status, 200, "Scan after renewal must succeed with HTTP 200");
  assert.strictEqual(scanAfterRefreshData.success, true, "Scan should be valid after renewal");

  console.log("\n=========================================================");
  console.log("🎉 ALL 4 3-HOUR QR EXPIRATION TESTS PASSED PERFECTLY!");
  console.log("=========================================================\n");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
