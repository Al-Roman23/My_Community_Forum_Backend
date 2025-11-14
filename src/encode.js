const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "./mycommunityforum.json");

try {
  const key = fs.readFileSync(filePath, "utf8");
  const base64 = Buffer.from(key).toString("base64");
  console.log("Base64 encoded Firebase key:\n");
  console.log(base64);
} catch (err) {
  console.error("Error reading or encoding file:", err.message);
}
