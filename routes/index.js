var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
var Model_Users = require("../model/modelUser");

/* GET home page. */
router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await Model_Users.getId(id);
    if (Data.length > 0) {
      res.render("index", {
        email: Data[0].email,
      });
    } else {
      res.status(401).json({ error: "user tidak ada" });
    }
  } catch (error) {
    res.status(501).json("Butuh akses login");
  }
});

router.get("/register", function (req, res, next) {
  res.render("auth/register");
});

router.get("/login", function (req, res, next) {
  res.render("auth/login");
});

router.post("/saveusers", async (req, res) => {
  try {
    const { email, password } = req.body;
    const enkripsi = await bcrypt.hash(password, 10);
    const Data = {
      email: email,
      password: enkripsi,
      level_users: 2
    };
    await Model_Users.Store(Data);
    req.flash("success", "Berhasil Login");
    res.redirect("/login");
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    res.redirect("/login");
  }
});

router.post('/log', async (req, res) => {
  try {
    const { email, password } = req.body;
    let Data = await Model_Users.Login(email);
    
    if (Data.length > 0) {
      let enkripsi = Data[0].password;
      let cek = await bcrypt.compare(password, enkripsi);
      
      if (cek) {
        req.session.userId = Data[0].id_users;
        // Tambahkan kondisi pengecekan level pada user yang login
        if (Data[0].level_users == 1) {
          req.flash('success', 'Berhasil login');
          res.redirect('/superusers');
        } else if (Data[0].level_users == 2) {
          req.flash('success', 'Berhasil login');
          res.redirect('/users');
        } else {
          res.redirect('/login');
        }
        // Akhir kondisi
      } else {
        req.flash('error', 'Email atau password salah');
        res.redirect("/login");
      }
    } else {
      req.flash('error', 'Akun tidak ditemukan');
      res.redirect('/login');
    }
  } catch (err) {
    req.flash('error', 'Error pada fungsi');
    res.redirect('/login');
  }
});


router.get("/logout", function (req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.error(err);
    } else {
      res.redirect("/login");
    }
  });
});

module.exports = router;
