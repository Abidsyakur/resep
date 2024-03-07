const express = require('express');
const router = express.Router();
const MahasiswaModel = require('../model/MahasiswaModel');

router.get('/', async (req, res, next) => {
  try {
    let rows = await MahasiswaModel.getAll();
    res.render('mahasiswa/index', { data: rows, messages: req.flash() });
  } catch (error) {
    next(error);
  }
});

router.get('/create', (req, res) => {
  res.render('mahasiswa/create');
});

router.post("/store", async (req, res, next) => {
    try {
      const mahasiswaData = req.body;
      await MahasiswaModel.store(mahasiswaData);
      req.flash("success", "Berhasil menyimpan data Mahasiswa");
      res.redirect("/mahasiswa");
    } catch (error) {
      console.log(error); // Tambahkan ini
      req.flash("error", "Gagal menyimpan data Mahasiswa");
      res.redirect("/mahasiswa");
    }
  });
  

router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    let rows = await MahasiswaModel.getById(id);
    res.render('mahasiswa/edit', { data: rows[0], messages: req.flash() });
  } catch (error) {
    next(error);
  }
});

router.post('/update/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const mahasiswaData = req.body;
    await MahasiswaModel.update(id, mahasiswaData);
    req.flash('success', 'Berhasil menyimpan data Mahasiswa');
    res.redirect('/mahasiswa');
  } catch (error) {
    req.flash('error', 'Gagal menyimpan data Mahasiswa');
    res.redirect('/mahasiswa');
  }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
      const id = req.params.id;
      await MahasiswaModel.delete(id);
      req.flash('success', 'Berhasil menghapus data Mahasiswa');
      res.redirect('/mahasiswa');
    } catch (error) {
      req.flash('error', 'Gagal menghapus data Mahasiswa');
      res.redirect('/mahasiswa');
    }
  });

module.exports = router;
