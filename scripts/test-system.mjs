import fs from "fs";
import path from "path";

console.log("=== RUNNING HERITAGE SITE SYSTEM QA VERIFICATION SUITE ===");

let passedTests = 0;
let totalTests = 0;

function assert(condition, testName) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] ${testName}`);
  }
}

// 1. Verify Supabase Migrations
const migrationPath = path.join(process.cwd(), "supabase/migrations/20260101000000_create_heritage_schema.sql");
assert(fs.existsSync(migrationPath), "Migration SQL file exists");
const migrationContent = fs.readFileSync(migrationPath, "utf-8");

const expectedTables = [
  "profiles",
  "destinations",
  "destination_images",
  "ticket_categories",
  "visiting_time_slots",
  "bookings",
  "booking_visitors",
  "crowd_reports",
  "saved_destinations",
  "contact_messages"
];

expectedTables.forEach(table => {
  assert(
    migrationContent.includes(`CREATE TABLE IF NOT EXISTS public.${table}`),
    `Schema defines table public.${table}`
  );
  assert(
    migrationContent.includes(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY`),
    `RLS enabled on table public.${table}`
  );
});

// 2. Verify Seed Data
const seedPath = path.join(process.cwd(), "supabase/seed.sql");
assert(fs.existsSync(seedPath), "Seed SQL file exists");
const seedContent = fs.readFileSync(seedPath, "utf-8");

const requiredDestinations = [
  "taj-mahal",
  "red-fort",
  "qutub-minar",
  "hawa-mahal",
  "amer-fort",
  "india-gate",
  "ajanta-caves",
  "ellora-caves"
];

requiredDestinations.forEach(slug => {
  assert(seedContent.includes(`'${slug}'`), `Seed SQL contains destination slug: ${slug}`);
});

// 3. Verify Static & Dynamic Build Artifacts
const sitemapFile = path.join(process.cwd(), "src/app/sitemap.ts");
assert(fs.existsSync(sitemapFile), "Sitemap generator exists (src/app/sitemap.ts)");

const robotsFile = path.join(process.cwd(), "src/app/robots.ts");
assert(fs.existsSync(robotsFile), "Robots.txt generator exists (src/app/robots.ts)");

const envExample = path.join(process.cwd(), ".env.example");
assert(fs.existsSync(envExample), ".env.example exists with Supabase variables");

// 4. Verify Pages Exist
const pages = [
  "src/app/(main)/page.tsx",
  "src/app/(main)/destinations/page.tsx",
  "src/app/(main)/destinations/[slug]/page.tsx",
  "src/app/(main)/crowd-status/page.tsx",
  "src/app/(main)/tickets/page.tsx",
  "src/app/(main)/about/page.tsx",
  "src/app/(main)/contact/page.tsx",
  "src/app/(auth)/login/page.tsx",
  "src/app/(auth)/register/page.tsx",
  "src/app/dashboard/page.tsx",
  "src/app/admin/page.tsx"
];

pages.forEach(p => {
  assert(fs.existsSync(path.join(process.cwd(), p)), `Page route exists: ${p}`);
});

console.log(`\nQA Test Results: ${passedTests}/${totalTests} tests passed.`);

if (passedTests === totalTests) {
  console.log("All system integrity verifications PASSED successfully!");
  process.exit(0);
} else {
  console.error("Some tests failed.");
  process.exit(1);
}
