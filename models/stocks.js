const mongoose = require("mongoose");

// defining schema
const stockSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
    enum: ["Financial Services", "Healthcare", "Technology", "Consumer Goods"], //sample industries
  },
});

const Stock = mongoose.model("Stock", stockSchema);
module.exports = Stock;
