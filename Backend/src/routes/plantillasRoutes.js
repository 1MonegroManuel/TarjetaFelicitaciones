const express = require("express");
const router = express.Router();
const { getPlantillas, createPlantilla } = require("../controllers/plantillasController");

const { poolPromise, sql } = require("../config/db");


router.get("/", getPlantillas);
router.post("/", createPlantilla);

module.exports = router;
