'use strict';

const path = require('path');
const { spawnSync } = require('child_process');

// Backwards-compatible entry point: run the authenticated synthetic-account suite.
const testFile = path.join(__dirname, 'test_security_regressions.js');
const result = spawnSync(process.execPath, [testFile], { stdio: 'inherit' });
process.exitCode = result.error ? 1 : (result.status === null ? 1 : result.status);
