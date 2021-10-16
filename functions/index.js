const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const getBTCBlockHashForDay = require("./blockchain");

const app = express();

// Automatically allow cross-origin requests
app.use(cors({
  origin: true,
}));

// build multiple CRUD interfaces:
app.get("/btchash/", (req, res) => {
  const day = req.query.day;
  const month = req.query.month;
  const year = req.query.year;

  const hash = getBTCBlockHashForDay(day, month, year);

  res.json(hash);
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
