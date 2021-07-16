const mongoose = require("mongoose");

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

module.exports = {
  stocks: require("./stocks.js"),
  user: require("./user.js"),
};
