const express = require("express");
const { getBalance } = require("../controllers/balance.js");

const router = express.Router();

router.get("/:address/:token", getBalance);

module.exports = router;
