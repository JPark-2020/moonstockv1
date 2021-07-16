const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// Import my Data
const User = require("../models").user;

const authCheck = require("./authCheck.js");

router.get("/register", function (req, res) {
  res.render("user/register", {
    siteTitle: "MoonStock | Register",
    info: "",
    color: "green",
  });
});

router.post("/register", async function (req, res) {
  try {
    const foundAccount = await User.findOne({ username: req.body.username });

    if (!foundAccount) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(req.body.password, salt);

      let qAuth = await User.create({
        username: req.body.username,
        password: hash,
        cash: 0,
        stocks: [],
        watchlist: [],
      });

      res.redirect("/");
    } else {
      res.render("user/register", {
        siteTitle: "MoonStock | Register",
        info: "Registration Failed: Username taken!",
        color: "red",
      });
    }
  } catch (err) {
    console.log(err);

    res.render("user/register", {
      siteTitle: "MoonStock | Register",
      info: "Registration Failed: Database error!",
      color: "red",
    });
  }
});

router.get("/login", function (req, res) {
  res.render("user/login", {
    siteTitle: "MoonStock | Login",
    info: "",
    color: "green",
  });
});

router.post("/login", async function (req, res) {
  try {
    const foundAccount = await User.findOne({ username: req.body.username });

    if (foundAccount) {
      if (await bcrypt.compare(req.body.password, foundAccount.password)) {
        req.session.currentUser = { _id: foundAccount._id };

        res.redirect("/");
      } else {
        res.render("user/login.ejs", {
          siteTitle: "MoonStock | Login",
          info: "Login Failed: Password incorrect!",
          color: "red",
        });
      }
    } else {
      res.render("user/login.ejs", {
        siteTitle: "MoonStock | Login",
        info: "Login Failed: Account does not exist!",
        color: "red",
      });
    }
  } catch (err) {
    console.log(err);

    res.render("user/login.ejs", {
      siteTitle: "MoonStock | Login",
      info: "Login Failed: Database error!",
      color: "red",
    });
  }
});

router.get("/logout", authCheck, async function (req, res) {
  try {
    await req.session.destroy();

    res.redirect("/login");
  } catch {
    console.log(err);
  }
});

router.get("/user", authCheck, async function (req, res) {
  try {
    const foundAccount = await User.findOne({ _id: req.session.currentUser });

    if (foundAccount) {
      res.render("user/show", {
        siteTitle: "MoonStock | Account",
        cash: foundAccount.cash,
        color: "green",
        info: "",
      });
    } else {
      console.log("User not found! Can't show!");
      res.redirect("/login");
    }
  } catch {
    console.log(err);
  }
});

router.delete("/user", authCheck, async function (req, res) {
  try {
    const found = await User.findByIdAndDelete(req.session.currentUser);

    if (!found) console.log("Could not find account. No deletion!");

    await req.session.destroy();

    res.redirect("/login");
  } catch {
    console.log(err);
  }
});

router.post("/cash", authCheck, async function (req, res) {
  try {
    const foundAccount = await User.findOne({ _id: req.session.currentUser });

    if (foundAccount) {
      transfer = parseInt(req.body.cash);

      if (foundAccount.cash >= -transfer) {
        foundAccount.cash += transfer;
        await foundAccount.save();

        res.render("user/show", {
          siteTitle: "MoonStock | Account",
          cash: foundAccount.cash,
          color: "green",
          info: "Funds transferred!",
        });
      } else {
        res.render("user/show", {
          siteTitle: "MoonStock | Account",
          cash: foundAccount.cash,
          color: "red",
          info: "Insufficient funds!",
        });
      }
    } else {
      console.log("User not found! Can't manage cash!");
      res.redirect("/login");
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
