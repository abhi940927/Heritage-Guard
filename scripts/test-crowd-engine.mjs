/**
 * Automated Verification Suite for Heritage Site Crowd Monitoring & Prediction Engine
 * Tests formulas, classification, short-term predictions, wait-time calculations,
 * QR ticket turnstile scanning with duplicate rejection, and admin calibration audit trail.
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("==============================================================");
  console.log("🚀 STARTING HERITAGE SITE SMART CROWD MONITORING ENGINE TESTS");
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
    // TEST 1: Global Telemetry API & Transparency Labelling
    // ------------------------------------------------------------------------
    console.log("▶️ Test 1: Fetching Global Crowd Telemetry (/api/crowd)");
    const resAll = await fetch(`${BASE_URL}/api/crowd`);
    assert(resAll.ok, `HTTP status is 200 OK (got ${resAll.status})`);
    
    const allData = await resAll.json();
    assert(Array.isArray(allData.data), "Response contains data array of monument summaries");
    assert(allData.data.length >= 10, `Found ${allData.data.length} monument summaries`);
    assert(allData.data_label.includes("DEMO DATA"), `Transparent data labeling present: "${allData.data_label}"`);
    assert(Boolean(allData.timestamp), `Fresh ISO timestamp present: ${allData.timestamp}`);

    // Pick Taj Mahal for summary inspection
    const tajSummary = allData.data.find((m) => m.slug === "taj-mahal");
    assert(Boolean(tajSummary), "Found Taj Mahal summary in /api/crowd");

    // ------------------------------------------------------------------------
    // TEST 2: Single Monument Detailed Telemetry Route (/api/crowd/[slug])
    // Fetches deep telemetry (config, snapshot, predictions, audit)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 2: Dynamic Monument Telemetry Route (/api/crowd/taj-mahal)");
    const resSingle = await fetch(`${BASE_URL}/api/crowd/taj-mahal`);
    assert(resSingle.ok, "GET /api/crowd/taj-mahal returned HTTP 200 OK");
    const taj = await resSingle.json();
    assert(taj.slug === "taj-mahal", `Returned data has correct slug: ${taj.slug}`);
    assert(Boolean(taj.snapshot), "Live snapshot present in single monument payload");
    assert(Boolean(taj.config), "Carrying capacity config present in single monument payload");
    assert(Boolean(taj.predictions), "Predictions present in single monument payload");

    // ------------------------------------------------------------------------
    // TEST 3: Mathematical Formula Verification on Taj Mahal
    // Current Visitors = Previous Visitors + Total Entries - Total Exits
    // Occupancy % = (Current Visitors / Max Capacity) * 100
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 3: Mathematical Formula Verification on Taj Mahal");
    const { snapshot, config, predictions } = taj;
    
    console.log(`  📊 Max Approved Capacity: ${config.max_approved_capacity}`);
    console.log(`  📊 Previous: ${snapshot.previous_visitors}, Entries: ${snapshot.total_entries}, Exits: ${snapshot.total_exits}`);
    console.log(`  📊 Current Visitors: ${snapshot.current_visitors}`);
    console.log(`  📊 Occupancy Percentage: ${snapshot.occupancy_percentage.toFixed(2)}%`);

    const expectedVisitors = Math.max(
      0,
      snapshot.previous_visitors + snapshot.total_entries - snapshot.total_exits
    );
    assert(
      snapshot.current_visitors === expectedVisitors,
      `Formula V_curr = V_prev + In - Out holds: ${snapshot.current_visitors} === ${expectedVisitors}`
    );

    const expectedOccupancy = (snapshot.current_visitors / config.max_approved_capacity) * 100;
    assert(
      Math.abs(snapshot.occupancy_percentage - expectedOccupancy) < 0.05,
      `Formula Occupancy% = (V_curr / MaxCap) * 100 holds: ${snapshot.occupancy_percentage.toFixed(2)}% === ${expectedOccupancy.toFixed(2)}%`
    );

    // ------------------------------------------------------------------------
    // TEST 4: Configurable Classification Thresholds
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 4: Crowd Classification Thresholds");
    const occ = snapshot.occupancy_percentage;
    let expectedCategory = "Low";
    if (occ >= config.threshold_high) expectedCategory = "Very High";
    else if (occ >= config.threshold_moderate) expectedCategory = "High";
    else if (occ >= config.threshold_low) expectedCategory = "Moderate";

    assert(
      snapshot.crowd_status === expectedCategory,
      `Occupancy ${occ.toFixed(1)}% correctly mapped to category '${snapshot.crowd_status}' (Expected: ${expectedCategory})`
    );

    // ------------------------------------------------------------------------
    // TEST 5: Waiting Time Calculation vs Occupancy Distinction
    // Waiting Time = Queue Length / Processing Rate Per Minute
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 5: Entrance Queue Waiting Time Distinction");
    const queueLen = snapshot.queue_length;
    const rate = config.queue_service_rate_per_min;
    const expectedWait = Math.ceil(queueLen / rate);
    assert(
      snapshot.estimated_wait_time_minutes === expectedWait,
      `Entrance wait time strictly based on queue (${queueLen}) / rate (${rate}/min) = ${expectedWait}m (got ${snapshot.estimated_wait_time_minutes}m)`
    );

    // ------------------------------------------------------------------------
    // TEST 6: Short-Term Prediction Engine (+15, +30, +60 mins)
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 6: Short-Term Prediction Engine Verification");
    const forecastList = [predictions.m15, predictions.m30, predictions.m60];
    assert(forecastList.length === 3, "Expected 3 forecast windows (+15, +30, +60)");

    for (const pred of forecastList) {
      console.log(`  ⏱️ Horizon +${pred.horizon_minutes}m:`);
      console.log(`     Predicted In: ${pred.predicted_entries}, Out: ${pred.predicted_exits}`);
      console.log(`     Expected Visitors: ${pred.expected_visitors} (${pred.predicted_occupancy_percentage.toFixed(1)}% - ${pred.expected_crowd_category})`);
      
      const mathExpected = Math.max(
        0,
        snapshot.current_visitors + pred.predicted_entries - pred.predicted_exits
      );
      assert(
        pred.expected_visitors === mathExpected,
        `+${pred.horizon_minutes}m expected visitors (${pred.expected_visitors}) matches V_curr + PredIn - PredOut (${mathExpected})`
      );
      assert(
        pred.predicted_occupancy_percentage >= 0 && pred.predicted_occupancy_percentage <= 120,
        `+${pred.horizon_minutes}m occupancy is within plausible percentage bounds`
      );
    }

    // ------------------------------------------------------------------------
    // TEST 7: Turnstile QR Scanning & Duplicate Prevention Flow
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 7: Turnstile QR Scanning & Duplicate Prevention");
    const testTicket = `TEST-TKT-${Date.now()}`;
    const destId = taj.destination.id;
    const initialVisitors = taj.snapshot.current_visitors;

    // Scan 1: Valid ENTRY
    console.log(`  🎟️ Step 7A: Scanning Entry for ticket ${testTicket}`);
    const scanEntry1 = await fetch(`${BASE_URL}/api/crowd/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination_id: destId,
        ticket_reference: testTicket,
        scan_type: "entry",
        gate_id: "EAST_TURNSTILE_01",
      }),
    });
    assert(scanEntry1.ok, `Entry scan accepted with HTTP 200 (got ${scanEntry1.status})`);
    const entryData1 = await scanEntry1.json();
    assert(entryData1.success === true, "Entry recorded successfully");
    assert(entryData1.new_visitor_count === initialVisitors + 1, `Visitor count incremented: ${initialVisitors} -> ${entryData1.new_visitor_count}`);

    // Scan 2: Duplicate ENTRY with same ticket (Should be REJECTED with 409 Conflict)
    console.log(`  🎟️ Step 7B: Scanning Duplicate Entry for same ticket ${testTicket}`);
    const scanEntry2 = await fetch(`${BASE_URL}/api/crowd/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination_id: destId,
        ticket_reference: testTicket,
        scan_type: "entry",
        gate_id: "EAST_TURNSTILE_01",
      }),
    });
    assert(scanEntry2.status === 409, `Duplicate entry correctly rejected with HTTP 409 (got ${scanEntry2.status})`);
    const entryData2 = await scanEntry2.json();
    assert(entryData2.rejection_reason === "ALREADY_CHECKED_IN", `Rejection reason is 'ALREADY_CHECKED_IN' (got: ${entryData2.rejection_reason})`);

    // Scan 3: Valid EXIT
    console.log(`  🎟️ Step 7C: Scanning Exit for ticket ${testTicket}`);
    const scanExit1 = await fetch(`${BASE_URL}/api/crowd/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination_id: destId,
        ticket_reference: testTicket,
        scan_type: "exit",
        gate_id: "WEST_EXIT_TURNSTILE_01",
      }),
    });
    assert(scanExit1.ok, `Exit scan accepted with HTTP 200 (got ${scanExit1.status})`);
    const exitData1 = await scanExit1.json();
    assert(exitData1.success === true, "Exit recorded successfully");
    assert(exitData1.new_visitor_count === initialVisitors, `Visitor count decremented back to: ${exitData1.new_visitor_count}`);

    // Scan 4: Duplicate EXIT without active entry (Should be REJECTED with 400 Bad Request)
    console.log(`  🎟️ Step 7D: Scanning Duplicate Exit for same ticket ${testTicket}`);
    const scanExit2 = await fetch(`${BASE_URL}/api/crowd/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination_id: destId,
        ticket_reference: testTicket,
        scan_type: "exit",
        gate_id: "WEST_EXIT_TURNSTILE_01",
      }),
    });
    assert(scanExit2.status === 400, `Exit without active entry correctly rejected with HTTP 400 (got ${scanExit2.status})`);
    const exitData2 = await scanExit2.json();
    assert(exitData2.rejection_reason === "NO_ACTIVE_ENTRY", `Rejection reason is 'NO_ACTIVE_ENTRY' (got: ${exitData2.rejection_reason})`);

    // ------------------------------------------------------------------------
    // TEST 8: Administrative Calibration & Immutable Audit Trail
    // ------------------------------------------------------------------------
    console.log("\n▶️ Test 8: Administrative Calibration & Audit Trail");
    const testOverrideVisitors = 8500;
    const testAdminEmail = "chief.conservator@asi.gov.in";

    const calibRes = await fetch(`${BASE_URL}/api/crowd/calibrate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        destination_id: destId,
        visitor_count: testOverrideVisitors,
        actor_email: testAdminEmail,
        trend: "falling",
      }),
    });
    assert(calibRes.ok, `Calibration POST returned HTTP 200 (got ${calibRes.status})`);
    const calibData = await calibRes.json();
    assert(calibData.success === true, "Calibration confirmed successful");
    assert(calibData.snapshot.current_visitors === testOverrideVisitors, `Snapshot visitor count updated to ${testOverrideVisitors}`);

    // Inspect Audit Trail records
    const auditRes = await fetch(`${BASE_URL}/api/crowd/calibrate?destination_id=${destId}`);
    assert(auditRes.ok, "GET /api/crowd/calibrate returned HTTP 200");
    const auditData = await auditRes.json();
    assert(Array.isArray(auditData.data), "Audit trail returned list of records");
    const latestAudit = auditData.data[0];
    assert(Boolean(latestAudit), "Found latest audit record");
    assert(latestAudit.actor_email === testAdminEmail, `Audit record logged correct officer email: ${latestAudit.actor_email}`);
    assert(latestAudit.action_type === "manual_calibration", `Audit action type is manual_calibration`);

    console.log("\n==============================================================");
    console.log(`🏁 TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
    console.log("==============================================================");

    if (failed > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Unhandled Test Error:", error);
    process.exit(1);
  }
}

runTests();
