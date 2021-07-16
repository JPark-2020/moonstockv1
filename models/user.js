const mongoose = require("mongoose");

//convert schema to model
const user = mongoose.model(
  "users",
  new mongoose.Schema({
    username: String,
    password: String,
    cash: Number,
    stocks: [
      {
        stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Stock",
        },
        amount: Number,
      },
    ],
    watchlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Stock",
      },
    ],
  })
);

module.exports = user;
