const { statement } = require("./statement");
const invoices = require("../invoices.json");
const plays = require("../plays.json");

console.log(statement(invoices, plays));
