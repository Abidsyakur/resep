const express = require('express');
const router = express.Router();
const connection = require('../config/database');
const Model_Kategori = require('../model/Model_Kategori');

router.get('/', async (req, res, next) => {
  try {
    let rows = await Model_Kategori.getAll();
    res.render('kategori/index', { data: rows });
  } catch (error) {
    next(error);
  }
});


router.get("/create", function (req, res, next) {
  res.render("kategori/create", {
    
    nama_kategori: "",
  });
});

router.post('/store', async (req, res, next) => {
  try {
    const { nama_kategori } = req.body;
    const data = { nama_kategori };

    await Model_Kategori.store(data);
    
    req.flash('success', 'Berhasil menyimpan data');
    res.redirect('/kategori');
  } catch (error) {
    req.flash('error', 'Gagal menyimpan data');
    res.redirect('/kategori');
  }
});


router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await Model_Kategori.getId(id);

    res.render('kategori/edit', {
      id: rows[0].id_kategori,
      nama_kategori: rows[0].nama_kategori
    });
  } catch (error) {
    next(error);
  }
});


router.post('/update/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { nama_kategori } = req.body;
    const data = { nama_kategori };

    await Model_Kategori.update(id, data);

    req.flash('success', 'Berhasil menyimpan data');
    res.redirect('/kategori');
  } catch (error) {
    req.flash('error', 'Gagal menyimpan data');
    res.redirect('/kategori');
  }
});


router.get('/delete/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await Model_Kategori.delete(id);

    req.flash('success', 'Berhasil menghapus data');
    res.redirect('/kategori');
  } catch (error) {
    req.flash('error', 'Gagal menghapus data');
    res.redirect('/kategori');
  }
});

module.exports = router;