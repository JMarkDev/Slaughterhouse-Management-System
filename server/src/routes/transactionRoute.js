const express = require("express");
const router = express.Router();
const transactionController = require("../controllers/transactionController");

router.put("/:id", transactionController.updateTransaction);

module.exports = router;
