const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
   number: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
   phone: {
    type: String,
    required: true,
  },
   notes: {
    type: String,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  tags: [
    {
      name: {
        type: String,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Order = mongoose.model("order", OrderSchema);
