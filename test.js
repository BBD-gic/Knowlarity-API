const axios = require("axios");
const fs = require("fs");

const payload = JSON.parse(fs.readFileSync("./payload.json", "utf-8"));

async function testCallLogPush() {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/CallLogPush",
      payload,
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );
    console.log("✅ Response:", response.data);
  } catch (err) {
    console.error("❌ Error:", err.response?.data || err.message);
  }
}

testCallLogPush();
