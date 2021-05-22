const { statement } = require("./statement");
const invoices = require("../invoices.json");
const plays = require("../plays.json");

const result = `청구 내역 (고객명: BigCo)
 Hamlet: $650.00 (55석)
 As You Like It: $580.00 (35석)
 Othello: $500.00 (40석)
총액: $1,730.00
적립 포인트: 47점`;

test("statement", () => {
  expect(statement(invoices, plays)).toMatch(result);
});
