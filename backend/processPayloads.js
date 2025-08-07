require("dotenv").config();
const fs = require("fs");
const path = require("path");
const connectToDb = require("./src/db/db.config");
const ProcessedMessage = require("./src/models/ProcessedMessage");
const mongoose = require('mongoose');

async function processPayload(filePath) {
  const rawData = fs.readFileSync(filePath, "utf8");
  const payload = JSON.parse(rawData);

  // Your payload structure might differ, adapt as needed:
  // Check if it's a message or status update:
  const metaData = payload.metaData || payload; // accommodate wrapper
  if (!metaData.entry) return;

  for (const entry of metaData.entry) {
    for (const change of entry.changes) {
      const value = change.value;
      if (value.messages) {
        // Process new messages (Insert if not exists)
        for (const msg of value.messages) {
          const contact = value.contacts ? value.contacts[0] : {};
          try {
            await ProcessedMessage.updateOne(
              { id: msg.id },
              {
                $setOnInsert: {
                  id: msg.id,
                  sender: msg.from,
                  senderName: contact.profile ? contact.profile.name : "",
                  body: msg.text ? msg.text.body : "",
                  timestamp: Number(msg.timestamp),
                  status: "received",
                  meta_msg_id: msg.id,
                },
              },
              { upsert: true }
            );
            console.log(`Inserted message id: ${msg.id}`);
          } catch (e) {
            console.error("Error inserting message id:", msg.id, e.message);
          }
        }
      }

      if (value.statuses) {
        // Process status updates (update 'status' field)
        for (const status of value.statuses) {
          try {
            const filter = status.id ? { id: status.id } : { meta_msg_id: status.meta_msg_id };
            await ProcessedMessage.updateOne(filter, { status: status.status });
            console.log(`Updated status for message id: ${status.id || status.meta_msg_id}`);
          } catch (e) {
            console.error("Error updating status for:", status.id || status.meta_msg_id, e.message);
          }
        }
      }
    }
  }
}

async function main() {
  await connectToDb();

  const dirPath = "D:/Download/whatsapp sample payloads";

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    console.log("Processing", file);
    await processPayload(path.join(dirPath, file));
  }

  mongoose.connection.close();
}

main();
