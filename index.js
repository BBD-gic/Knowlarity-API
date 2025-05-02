require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TABLE_NAME = process.env.AIRTABLE_TABLE_NAME;
const API_AUTH_KEY = process.env.API_AUTH_KEY;
const airtableURL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`;

app.post("/api/v1/CallLogPush", async (req, res) => {
  const clientKey = req.headers["x-api-key"];
  if (clientKey !== API_AUTH_KEY) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const payload = req.body;

    const record = {
      records: [
        {
          fields: {
            call_uuid: payload.call_uuid || "",
            call_date: payload.call_date || "",
            call_time: payload.call_time || "",
            customer_status: payload.customer_status || "",
            customer_number: payload.customer_number || "",
            call_number: payload.call_number || "",
            call_duration: payload.call_duration ? Number(payload.call_duration) : 0,
            call_transfer_duration: payload.call_transfer_duration ? Number(payload.call_transfer_duration) : 0,
            recording_url: payload.recording_url || "",
            call_status: payload.call_status || ""
          }
        }
      ]
    };

    console.log("📤 Sending to Airtable:", JSON.stringify(record, null, 2));

    const response = await axios.post(airtableURL, record, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    res.status(200).send({ success: true, airtableId: response.data.records[0].id });
  } catch (err) {
    console.error("❌ Airtable error:", err.response?.data || err.message);
    res.status(500).send({ success: false, error: err.response?.data || err.message });
  }
});

app.get("/", (req, res) => {
  res.send("📡 Knowlarity API is live. Use POST /api/v1/CallLogPush");
});

app.listen(3000, () => {
  console.log("✅ Server running at http://localhost:3000");
});
