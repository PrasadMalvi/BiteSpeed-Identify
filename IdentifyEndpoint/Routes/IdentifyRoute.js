const express = require("express");
const { identifyController } = require("../Controller/IdentifyController");
const router = express.Router();

router.post("/", identifyController);

module.exports = router;
