// routes/pendidikan.js
const express = require('express');
const router = express.Router();
const PendidikanModel = require('../model/PendidikanModel');
const MahasiswaModel = require('../model/MahasiswaModel');  // Import MahasiswaModel

router.get("/", async (req, res, next) => {
  try {
    let rows = await PendidikanModel.getAll();
    res.render("pendidikan/index", { data: rows });
  } catch (error) {
    next(error);
  }
});

router.get("/create", async (req, res, next) => {
  try {
    let mahasiswaRows = await MahasiswaModel.getAll();
    res.render("pendidikan/create", { mahasiswaData: mahasiswaRows });
  } catch (error) {
    next(error);
  }
});

router.post("/store", async (req, res, next) => {
  try {
    const pendidikanData = req.body;
    await PendidikanModel.store(pendidikanData);
    req.flash("success", "Berhasil menyimpan data Pendidikan");
    res.redirect("/pendidikan");
  } catch (error) {
    req.flash("error", "Gagal menyimpan data Pendidikan");
    res.redirect("/pendidikan");
  }
});

router.get("/edit/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    let rows = await PendidikanModel.getById(id);
    res.render("pendidikan/edit", { data: rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post("/update/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const pendidikanData = req.body;
      await PendidikanModel.update(id, pendidikanData);
      req.flash("success", "Berhasil menyimpan data Pendidikan");
      res.redirect("/pendidikan");
    } catch (error) {
      req.flash("error", "Gagal menyimpan data Pendidikan");
      res.redirect("/pendidikan");
    }
  });
  

router.get("/delete/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    await PendidikanModel.delete(id);
    req.flash("success", "Berhasil menghapus data Pendidikan");
    res.redirect("/pendidikan");
  } catch (error) {
    req.flash("error", "Gagal menghapus data Pendidikan");
    res.redirect("/pendidikan");
  }
});

module.exports = router;
