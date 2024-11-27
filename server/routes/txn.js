const express = require("express");
const { getTransactions } = require("../controllers/txn.js");

const router = express.Router();

router.get("/:address", getTransactions);

module.exports = router;
