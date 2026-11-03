#!/usr/bin/env node

/**
 * Master E2E Test Runner for TOEIC Master (noble-franklin)
 * Executes Tier 1 (Features), Tier 2 (Boundaries), Tier 3 (Pairwise), and Tier 4 (Scenarios).
 * Reports aggregated statistics and exits with code 0 on full pass, or non-zero on failure.
 */

const tier1 = require('./tier1_features.test');
const tier2 = require('./tier2_boundaries.test');
const tier3 = require('./tier3_pairwise.test');
const tier4 = require('./tier4_scenarios.test');

async function runAll() {
  console.log('================================================================');
  console.log('   TOEIC MASTER E2E TEST SUITE — ACCEPTANCE VERIFICATION GATE   ');
  console.log('   Target Project: noble-franklin (Tôi Đi Đâu Đó)              ');
  console.log('================================================================\n');

  const overallStart = Date.now();
  const suites = [tier1, tier2, tier3, tier4];
  const results = [];

  for (const s of suites) {
    const res = await s.run();
    results.push(res);
  }

  const overallDuration = ((Date.now() - overallStart) / 1000).toFixed(2);

  let totalTests = 0;
  let totalPassed = 0;
  let totalFailed = 0;

  console.log('\n================================================================');
  console.log('                   E2E TEST SUMMARY REPORT                      ');
  console.log('================================================================');
  console.log('Tier                     | Total | Passed | Failed | Status');
  console.log('-------------------------|-------|--------|--------|--------');

  for (const r of results) {
    totalTests += r.total;
    totalPassed += r.passed;
    totalFailed += r.failed;
    const status = r.failed === 0 ? '✅ PASS' : '❌ FAIL';
    const namePadded = r.suite.padEnd(24);
    const totStr = String(r.total).padStart(5);
    const passStr = String(r.passed).padStart(6);
    const failStr = String(r.failed).padStart(6);
    console.log(`${namePadded} | ${totStr} | ${passStr} | ${failStr} | ${status}`);
  }

  console.log('-------------------------|-------|--------|--------|--------');
  const totPadded = String(totalTests).padStart(5);
  const passPadded = String(totalPassed).padStart(6);
  const failPadded = String(totalFailed).padStart(6);
  const overallStatus = totalFailed === 0 ? '✅ ALL PASSED' : '❌ FAILED';
  console.log(`TOTAL                    | ${totPadded} | ${passPadded} | ${failPadded} | ${overallStatus}`);
  console.log(`\nTotal Execution Time: ${overallDuration}s`);
  console.log(`Coverage Threshold Minimum: >= 288 tests`);
  console.log(`Actual Executed Tests:     ${totalTests} tests`);

  if (totalFailed === 0 && totalTests >= 288) {
    console.log('\n🎉 ALL ACCEPTANCE CRITERIA SATISFIED! TEST SUITE PASSED 100%!');
    process.exit(0);
  } else {
    console.error('\n⚠️ TEST SUITE FAILED OR COVERAGE THRESHOLD NOT MET.');
    process.exit(1);
  }
}

runAll().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
