const express = require('express');
const router = express.Router();
const ModelResep = require('../model/ModelResep'); // Import model ModelResep
const modelUser = require('../model/modelUser'); // Import model modelUser
const ModelFavorit = require('../model/ModelFavorit');


router.use(async function (req, res, next) {
  try {
    let userData = await modelUser.getId(req.session.userId);
    if (userData.length > 0 && userData[0].email == "alif@gmail.com") {
      let userEmail = userData[0].email;
      req.userEmail = userEmail; 
    } else {
      return res.redirect("/logout");
    }
  } catch (error) {
    req.flash("error", error.message || "Terjadi kesalahan pada server");
    return res.redirect("/logout");
  }
  next();
});

router.get('/', async (req, res, next) => {
  try {
    let rows = await ModelFavorit.getAll();
    res.render('favorit/index', { data: rows });
  } catch (error) {
    next(error);
  }
});

router.get('/create', async (req, res, next) => {
  try {
    const reseps = await ModelResep.getAll(); // Mendapatkan semua data resep
    const users = await modelUser.getAll(); // Mendapatkan semua data users
    res.render('favorit/create', { reseps, users }); // Melewatkan data resep dan users ke template
  } catch (error) {
    next(error);
  }
});

router.post('/store', async (req, res) => {
  const id_users = req.body.id_users;
  const id_resep = req.body.resepId;

  // Lakukan penyimpanan resep ke daftar favorit pengguna menggunakan model Favorit
  try {
    const favoritData = {
      id_users: id_users,
      id_resep: id_resep
    };

    const result = await ModelFavorit.create(favoritData);
    if (result) {
      res.sendStatus(200); // Kirim respons sukses
    } else {
      res.status(500).send('Failed to add recipe to favorites.'); // Kirim respons gagal
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to add recipe to favorites.'); // Tangani kesalahan dan kirim respons error
  }
});

router.get('/edit/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const favorit = await ModelFavorit.getAll(); // Mengambil semua data favorit
    const favoritData = favorit.find(item => item.id_favorit.toString() === id); // Mencari data favorit dengan id yang sesuai

    if (!favoritData) {
      // Jika tidak ada data favorit dengan id yang sesuai, lempar error 404
      const error = new Error('Data favorit tidak ditemukan');
      error.status = 404;
      throw error;
    }

    const reseps = await ModelResep.getAll(); // Mendapatkan semua data resep
    const users = await modelUser.getAll(); // Mendapatkan semua data users

    res.render('favorit/edit', {
      id: favoritData.id_favorit,
      id_users: favoritData.id_users,
      id_resep: favoritData.id_resep,
      reseps,
      users
    });
  } catch (error) {
    next(error);
  }
});



router.post('/update/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    const { id_users, id_resep } = req.body;
    const data = { id_users, id_resep };

    const updateResult = await ModelFavorit.update(id, data); // Melakukan update data favorit
    
    if (updateResult) {
      req.flash('success', 'Berhasil menyimpan data');
    } else {
      req.flash('error', 'Gagal menyimpan data');
    }
    
    res.redirect('/favorit');
  } catch (error) {
    req.flash('error', 'Gagal menyimpan data');
    res.redirect('/favorit');
  }
});

router.get('/delete/:id', async (req, res, next) => {
  try {
    const id = req.params.id;
    await ModelFavorit.delete(id);

    req.flash('success', 'Berhasil menghapus data');
    res.redirect('/favorit');
  } catch (error) {
    req.flash('error', 'Gagal menghapus data');
    res.redirect('/favorit');
  }
});



module.exports = router;
