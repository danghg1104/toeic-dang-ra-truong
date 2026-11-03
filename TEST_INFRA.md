# TEST INFRASTRUCTURE SPECIFICATION: TOEIC MASTER (noble-franklin)

## 1. Test Philosophy
- **Opaque-Box & Requirement-Driven**: Tests are designed strictly from user requirements (R1–R7) and the 25-feature inventory in `PROJECT.md`. Tests verify observable contracts, state mutations, DOM attributes, mathematical properties, and communication protocols without depending on internal private variables.
- **Progressive Testability & Decoupled Execution**: Every test is self-contained and isolated. A unified browser environment mock (`test_helper.js`) provides standard DOM, Web Audio API, TouchEvent, WebSocket, and LocalStorage APIs in pure Node.js without requiring heavy third-party browser binaries.
- **Authoritative Expected Output Derivation**: Expected outputs are derived mathematically from specified formulas (FSRS v5 differential equations, 2PL Item Response Theory, 7-axis trigonometric polygon coordinates, Gaussian cumulative distribution functions) and canonical domain rules (ETS 12 Bẫy Tử Huyệt, TOEIC 10–990 scaled score tables).
- **Mandatory Integrity & Zero-Facade Guarantee**: All tests execute real logic with strict equality/boundary assertions. No dummy passes, tautological comparisons, or hardcoded success states.

---

## 2. Test Architecture
The test suite is structured as a standalone, zero-dependency Node.js executable system:

```
tests/e2e/
├── run_all_e2e.js              # Master test runner (executes all tiers, aggregates stats, exit code)
├── test_helper.js              # DOM, Web Audio, TouchEvent, WebSocket mocks & assertion helpers
├── tier1_features.test.js      # Tier 1: Feature Coverage (25 features x 5 = 125 tests)
├── tier2_boundaries.test.js    # Tier 2: Boundary & Corner Cases (25 features x 5 = 125 tests)
├── tier3_pairwise.test.js      # Tier 3: Pairwise Cross-Feature Interactions (25 tests)
└── tier4_scenarios.test.js     # Tier 4: Real-World End-to-End User Journeys (13 scenarios)
```

### Execution Commands:
- **Run all E2E tests**:
  ```bash
  node tests/e2e/run_all_e2e.js
  ```
- **Run individual tiers**:
  ```bash
  node tests/e2e/tier1_features.test.js
  node tests/e2e/tier2_boundaries.test.js
  node tests/e2e/tier3_pairwise.test.js
  node tests/e2e/tier4_scenarios.test.js
  ```

---

## 3. Coverage Thresholds & Hierarchy

| Test Tier | Description | Target Features | Minimum Threshold | Target Suite Count |
|---|---|---|---|---|
| **Tier 1: Feature Coverage** | Primary behavior & contract verification for each feature | Features 1 – 25 | $\ge 5$ tests / feature | 125 tests |
| **Tier 2: Boundary & Corner Cases** | Edge values, zero/max bounds, timeouts, offline fallbacks | Features 1 – 25 | $\ge 5$ tests / feature | 125 tests |
| **Tier 3: Pairwise Combinations** | Cross-feature interactions and state transitions | Key feature pairs | $\ge 25$ tests | 25 tests |
| **Tier 4: Real-World Scenarios** | Multi-step end-to-end user workflows | Full system flows | $\ge 13$ scenarios | 13 tests |
| **TOTAL** | Complete acceptance gate for noble-franklin | All 25 Features | **$\ge 288$ tests** | **288 tests** |

---

## 4. Feature-to-Tier Mapping Matrix (Features 1 – 25)

| # | Feature | Milestone | Tier 1 (Coverage) | Tier 2 (Boundaries) | Tier 3 (Pairwise) | Tier 4 (Scenarios) |
|---|---------|-----------|-------------------|---------------------|-------------------|--------------------|
| 1 | Tour Guide Onboarding | M1 | Tests 1.1–1.5 | Tests 1.1–1.5 | T3.19, T3.20 | Scenario 1, 13 |
| 2 | Part 3-4 Indirect Traps | M3 | Tests 2.1–2.5 | Tests 2.1–2.5 | T3.12, T3.15 | Scenario 3, 13 |
| 3 | Pre-Listening Keyword Tips | M3 | Tests 3.1–3.5 | Tests 3.1–3.5 | T3.21 | Scenario 6 |
| 4 | One-Page Cheat Sheet | M3 | Tests 4.1–4.5 | Tests 4.1–4.5 | T3.22 | Scenario 11 |
| 5 | Editorial Warm Sand Theme | M1 | Tests 5.1–5.5 | Tests 5.1–5.5 | T3.01, T3.02, T3.19 | Scenario 1 |
| 6 | Font Switcher (ETS vs Sans) | M1 | Tests 6.1–6.5 | Tests 6.1–6.5 | T3.03 | Scenario 1, 5 |
| 7 | PWA 1-Tap Install | M1 | Tests 7.1–7.5 | Tests 7.1–7.5 | T3.20 | Scenario 12 |
| 8 | Sound Feedback & Confetti | M1 | Tests 8.1–8.5 | Tests 8.1–8.5 | T3.04, T3.16 | Scenario 3, 4 |
| 9 | Pomodoro 25/5 Ambient Audio | M1 | Tests 9.1–9.5 | Tests 9.1–9.5 | T3.05, T3.06 | Scenario 9 |
| 10 | Exam Soundscape & Red Alert | M1 | Tests 10.1–10.5 | Tests 10.1–10.5 | T3.05, T3.25 | Scenario 10 |
| 11 | 7-Axis Competency Radar | M2 | Tests 11.1–11.5 | Tests 11.1–11.5 | T3.07, T3.08, T3.23 | Scenario 2, 3, 13 |
| 12 | Real Test Score Prediction | M2 | Tests 12.1–12.5 | Tests 12.1–12.5 | T3.09 | Scenario 2 |
| 13 | Weekly Progress Report | M2 | Tests 13.1–13.5 | Tests 13.1–13.5 | T3.23, T3.24 | Scenario 9, 13 |
| 14 | 10-Minute Adaptive Test | M2 | Tests 14.1–14.5 | Tests 14.1–14.5 | T3.07, T3.09, T3.25 | Scenario 2, 13 |
| 15 | FSRS v5 Algorithm | M2 | Tests 15.1–15.5 | Tests 15.1–15.5 | T3.10, T3.11 | Scenario 4, 13 |
| 16 | 12 Trap Categories Heat Matrix | M2 | Tests 16.1–16.5 | Tests 16.1–16.5 | T3.08, T3.12, T3.13, T3.24 | Scenario 3 |
| 17 | 180-Second Micro-Capsules | M3 | Tests 17.1–17.5 | Tests 17.1–17.5 | T3.06, T3.11 | Scenario 3, 13 |
| 18 | Realistic Document UI (Part 6-7)| M3 | Tests 18.1–18.5 | Tests 18.1–18.5 | T3.02, T3.03 | Scenario 5 |
| 19 | 80/20 Frequency Tiering | M3 | Tests 19.1–19.5 | Tests 19.1–19.5 | T3.17 | Scenario 4 |
| 20 | Office Paraphrase Clusters | M3 | Tests 20.1–20.5 | Tests 20.1–20.5 | T3.22 | Scenario 6 |
| 21 | Tinder-Style 3D Flashcards | M3 | Tests 21.1–21.5 | Tests 21.1–21.5 | T3.01, T3.04, T3.10 | Scenario 4, 13 |
| 22 | WebSocket 1v1 PvP Arena | M4 | Tests 22.1–22.5 | Tests 22.1–22.5 | T3.16, T3.17, T3.18 | Scenario 7, 13 |
| 23 | Karaoke Lyrics Sync | M3 | Tests 23.1–23.5 | Tests 23.1–23.5 | T3.14, T3.15 | Scenario 6 |
| 24 | Accent Classifier Indicator | M3 | Tests 24.1–24.5 | Tests 24.1–24.5 | T3.14, T3.21 | Scenario 6 |
| 25 | AI "Vì sao em sai?" Engine | M4 | Tests 25.1–25.5 | Tests 25.1–25.5 | T3.13, T3.18 | Scenario 8 |

---

## 5. Exit Codes & CI Integration
- **Exit Code 0**: 100% of test cases passed cleanly.
- **Exit Code 1**: One or more assertions failed, contract violations detected, or unhandled exceptions thrown.
- Master runner prints per-tier passing breakdown, failed assertion stack traces, and total execution time.
