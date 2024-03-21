const express = require("express");
const Model_Users = require("../model/modelUser");
const router = express.Router();

/* GET users listing. */
router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      res.render("users/index", {
        email: Data[0].email,
      });
    } else {
        res.redirect("/login");
    }
  } catch (error) {
    res.status(501).json("Butuh akses login");
  }
});

module.exports = router;
