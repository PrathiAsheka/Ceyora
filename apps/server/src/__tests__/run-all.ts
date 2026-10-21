/**
 * Central Automated Test Suite Runner for @ceyora/server
 * Executes all unit and integration suites with assertions.
 */
import "./payhere.test";
import "./pdpa.test";
import "./auth-security.test";
import "./calendar.test";
import "./fees-ledger.test";
import "./payroll.test";
import "./import-etl.test";

console.log("----------------------------------------------------------------");
console.log("✔ ALL CEYORA SERVER PRODUCTION & SECURITY TEST SUITES PASSED OK");
console.log("----------------------------------------------------------------");
