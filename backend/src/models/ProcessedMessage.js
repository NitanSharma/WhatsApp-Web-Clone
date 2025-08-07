const mongoose = require("mongoose");

const ProcessedMessageSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true }, // WhatsApp msg id
  sender: String,
  senderName: String,
  body: String,
  timestamp: Number,
  status: { type: String, default: "received" }, // received/sent/delivered/read
  meta_msg_id: String, // for status updates reference
});

module.exports = mongoose.model("ProcessedMessage", ProcessedMessageSchema);
