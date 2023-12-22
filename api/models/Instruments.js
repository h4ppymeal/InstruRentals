const mongoose = require("mongoose");

const instrumentSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  address: String,
  photos: [String],
  description: String,
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  price: Number,
});

const InstrumentModel = mongoose.model("Instrument", instrumentSchema);

module.exports = InstrumentModel;
