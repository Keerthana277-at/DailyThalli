const express = require("express");

const {
    getPublicMenu
} = require("../Controllers/publicController");

const router = express.Router();

router.get("/menu", getPublicMenu);

module.exports = router;