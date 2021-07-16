require("dotenv").config({ path: "../.env" });
const mongoose = require("mongoose");
const Stock = require("../models/stocks");
const user = require("../models/user");

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/moonstock", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo connection open!");
  })
  .catch((err) => {
    console.log("Error!");
    console.log(err);
  });

// Inserted 20 stocks into stocks collection in MoonStock DB

Stock.insertMany([
  { name: "AMD", price: 82.04, category: "Technology" },
  { name: "MU", price: 85.14, category: "Technology" },
  { name: "JPM", price: 151.12, category: "Financial Services" },
  { name: "JNJ", price: 165.52, category: "Healthcare" },
  { name: "PFE", price: 38.66, category: "Healthcare" },
  { name: "PLTR", price: 23.53, category: "Technology" },
  { name: "DDOG", price: 92.5, category: "Technology" },
  { name: "LRCX", price: 637.3, category: "Technology" },
  { name: "AAPL", price: 134.52, category: "Technology" },
  { name: "SBUX", price: 95, category: "Consumer Goods" },
  { name: "LYFT", price: 44, category: "Technology" },
  { name: "UPS", price: 175.69, category: "Consumer Goods" },
  { name: "NFLX", price: 500, category: "Technology" },
  { name: "FB", price: 239.23, category: "Technology" },
  { name: "WDC", price: 72.34, category: "Technology" },
  { name: "WMT", price: 124, category: "Consumer Goods" },
  { name: "GOOS", price: 42, category: "Consumer Goods" },
  { name: "MSFT", price: 264, category: "Consumer Goods" },
  { name: "AXP", price: 150.44, category: "Financial Services" },
  { name: "BAC", price: 39.53, category: "Financial Services" },
  { name: "C", price: 72.45, category: "Financial Services" },
])
  .then((msg) => {
    console.log("Stocks inputted to database");
    console.log(msg);
  })
  .catch((err) => {
    console.log("Something went wrong.");
    console.log(err);
  });
