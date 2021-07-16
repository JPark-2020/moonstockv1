// packages required
require("dotenv").config();
const express = require("express");
const app = express();
const methodOverride = require("method-override");
const session = require("express-session");

const controllers = require("./controllers");
const Stock = require("./models/stocks.js");
const user = require("./models/user.js");
const authCheck = require("./controllers/authCheck.js");

app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// view ejs files in models
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SECRET || "moon",
    resave: false,
    saveUninitialized: false,
  })
);

// Index route
app.get("/", authCheck, async (req, res) => {
  try {
    const findUser = await user.findById(req.session.currentUser);
    const stockArray = [];
    const portfolioArray = [];
    const foundStock = await Stock.findById(req.params.id);
    if (findUser) {
      for (let index = 0; index < findUser.watchlist.length; index++) {
        const element = await Stock.findById(findUser.watchlist[index]);
        stockArray.push(element);
      }
      for (let index = 0; index < findUser.stocks.length; index++) {
        const addStock = await Stock.findById(findUser.stocks[index].stock);
        portfolioArray.push(addStock);
      }
      res.render("index", {
        siteTitle: "Moon Stock | Home",
        findUser: findUser,
        stockArray: stockArray,
        portfolioArray: portfolioArray,
      });
    }
  } catch (err) {
    console.log(err);
    console.log("Didn't work");
  }
});

app.post("/stock/:id/watchlist", authCheck, async (req, res) => {
  try {
    const findUser = await user.findOne({ _id: req.session.currentUser });

    if (findUser) {
      findUser.watchlist.push(req.params.id);
      await findUser.save();
      res.redirect("/");
    } else {
      console.log("no stock");
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

// Buy/Sell
app.post("/stock/:id/buy", async (req, res) => {
  try {
    const findUser = await user.findOne({ _id: req.session.currentUser });
    const foundStock = await Stock.findById(req.params.id);

    if (findUser) {
      for (i = 0; i < findUser.stocks.length; i++) {
        if (findUser.stocks[i].stock.equals(req.params.id)) {
          findUser.stocks[i].amount += parseInt(req.body.amount);
          findUser.cash -= parseInt(req.body.amount) * foundStock.price;
          await findUser.save();
          return res.redirect("/");
        }
      }
      findUser.stocks.push({ stock: req.params.id, amount: req.body.amount });
      findUser.cash -= parseInt(req.body.amount) * foundStock.price;
      await findUser.save();
      res.redirect("/");
    } else {
      console.log("didn't work");
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

// OG SELL
app.post("/stock/:id/sell", async (req, res) => {
  try {
    const findUser = await user.findOne({ _id: req.session.currentUser });
    const foundStock = await Stock.findById(req.params.id);

    if (findUser) {
      for (i = 0; i < findUser.stocks.length; i++) {
        if (findUser.stocks[i].stock.equals(req.params.id)) {
          findUser.stocks[i].amount -= parseInt(req.body.amount);
          findUser.cash += parseInt(req.body.amount) * foundStock.price;
          await findUser.save();
        }
      }
      res.redirect("/");
    } else {
      console.log("didn't work");
      res.redirect("/");
    }
  } catch (err) {
    console.log(err);
  }
});

// routes - STOCKS
// Index: Made a route for all available stocks
app.get("/stock", async (req, res) => {
  const stocks = await Stock.find({});
  res.render("stock/index", { stocks });
});

app.get("/stock/watchlist", authCheck, async (req, res) => {
  try {
    const findUser = await user.findOne({ _id: req.session.currentUser });
    const stockArray = [];

    if (findUser) {
      for (let index = 0; index < findUser.watchlist.length; index++) {
        const element = await Stock.findById(findUser.watchlist[index]);
        stockArray.push(element);
      }
      res.render("stock/watchlist", { stockArray: stockArray });
    }
  } catch (err) {
    console.log(err);
    console.log("Didn't work");
  }
});

// Show: route for stock by ID - also the new route
app.get("/stock/:id", async (req, res) => {
  const stocks = await Stock.findById(req.params.id);
  const findUser = await user.findOne({ _id: req.session.currentUser });
  res.render("stock/show", { stocks: stocks, findUser: findUser });
});

// auth routes
app.use("/", controllers.user);

app.listen(process.env.PORT || 3000, (req, res) => {
  console.log("Is this thing on?");
});
