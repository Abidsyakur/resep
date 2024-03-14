const express = require('express');
const router = express.Router();
const PemilikModel = require('../model/PemilikModel');

router.get('/', async (req, res, next) => {
    try {
        let rows = await PemilikModel.getAll();
        res.render('pemilik/index', { data: rows, messages: req.flash() });
    } catch (error) {
        next(error);
    }
});

router.get('/create', (req, res) => {
    res.render('pemilik/create');
});

router.post('/store', async (req, res, next) => {
    try {
        let { nama_pemilik, alamat, no_hp } = req.body;
        await PemilikModel.create({ nama_pemilik, alamat, no_hp });
        req.flash('success', 'Berhasil menyimpan data pemilik');
        res.redirect('/pemilik');
    } catch (error) {
        req.flash('error', 'Gagal menyimpan data pemilik');
        res.redirect('/pemilik');
    }
});

router.get('/edit/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let pemilik = await PemilikModel.getById(id);
        res.render('pemilik/edit', {
            id: pemilik.id_pemilik,
            nama_pemilik: pemilik.nama_pemilik,
            alamat: pemilik.alamat,
            no_hp: pemilik.no_hp,
            messages: req.flash()
        });
    } catch (error) {
        next(error);
    }
});

router.post('/update/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        let { nama_pemilik, alamat, no_hp } = req.body;
        await PemilikModel.update(id, { nama_pemilik, alamat, no_hp });
        req.flash('success', 'Berhasil memperbarui data pemilik');
        res.redirect('/pemilik');
    } catch (error) {
        req.flash('error', 'Gagal memperbarui data pemilik');
        res.redirect('/pemilik');
    }
});

router.get('/delete/:id', async (req, res, next) => {
    try {
        let id = req.params.id;
        await PemilikModel.delete(id);
        req.flash('success', 'Berhasil menghapus data pemilik');
        res.redirect('/pemilik');
    } catch (error) {
        req.flash('error', 'Gagal menghapus data pemilik');
        res.redirect('/pemilik');
    }
});

module.exports = router;
