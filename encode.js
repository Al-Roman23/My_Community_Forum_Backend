// Script To Encode Firebase Service Account JSON To Base64
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "./mygopts-firebase-adminsdk.json");

try {
  const key = fs.readFileSync(filePath, "utf8");
  const base64 = Buffer.from(key).toString("base64");
  console.log("\n=== Base64 Encoded Firebase Service Key ===\n");
  console.log(base64);
  console.log("\n=== Copy the above string to your .env file as FIREBASE_SERVICE_KEY ===\n");
} catch (err) {
  console.error("Error reading or encoding file:", err.message);
  console.log("\nMake sure 'mygopts-firebase-adminsdk.json' exists in the ServeR folder.");
}

