const { createRestaurant } = require("./restaurant.controller");
const express = require("express");
const router = express.Router();

router.post("/create", createRestaurant);

module.exports = router;
