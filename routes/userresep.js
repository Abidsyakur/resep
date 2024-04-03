var express = require("express");
var router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ModelUserResep = require("../model/ModelUserResep");
const modelUser = require("../model/modelUser");

router.get('/index', function(req, res) {
    res.render('userresep/index', { user: req.user, data: yourDataArray }); // Mengirim objek user dan data resep ke halaman index.ejs
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images/upload");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

router.get("/", async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await modelUser.getId(id);
    if (Data.length > 0) {
      let rows = await ModelUserResep.getAll();
      res.render("userresep/index", {
        data: rows,
      });
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", async function (req, res, next) {
  res.render("userresep/create");
});

router.post('/add', async (req, res) => {
    try {
        const { resepId } = req.body;
        // Panggil method addToFavorites dari ModelUserResep
        const favoritId = await ModelUserResep.addToFavorites(req.session.userId, resepId);
        if (favoritId) {
            res.status(200).json({ success: true, favoritId: favoritId });
        } else {
            res.status(500).json({ success: false, message: 'Failed to add to favorites' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to add to favorites' });
    }
});

router.post(
  "/store",
  upload.single("foto"),
  async function (req, res, next) {
    try {
      let { judul_resep, bahan, langkah_pembuatan } = req.body;
      let Data = {
        judul_resep,
        bahan,
        langkah_pembuatan,
        foto: req.file.filename,
      };
      await ModelUserResep.create(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/userresep");
    } catch (error) {
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/userresep");
    }
  }
);

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let resep = await ModelUserResep.getById(id);
    res.render("resep/edit", {
      id: id,
      judul_resep: resep.judul_resep,
      bahan: resep.bahan,
      langkah_pembuatan: resep.langkah_pembuatan,
      foto: resep.foto, // Pastikan memberikan nilai foto di sini
    });
  } catch (error) {
    next(error);
  }
});

function addToFavorites(resepId) {
    // Kirim permintaan POST ke server untuk menambahkan resep ke favorit
    fetch('/store', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ resepId: resepId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to add recipe to favorites');
        }
        // Tampilkan pesan sukses atau lakukan tindakan lain jika diperlukan
        console.log('Recipe added to favorites');
    })
    .catch(error => {
        console.error(error);
    });
}

router.post('/add', async (req, res) => {
    const { resepId } = req.body;

    try {
        // Panggil model untuk menambahkan resep ke favorit
        const favoritId = await ModelFavorit.addFavorite(resepId);

        res.status(200).json({ success: true, favoritId: favoritId });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'Failed to add to favorites' });
    }
});

router.post(
  "/update/:id",
  upload.single("foto"),
  async function (req, res, next) {
    try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      // Ubah baris berikut:
      let rows = await ModelUserResep.getById(id);
      // Menjadi:
      let resep = await ModelUserResep.getById(id);
      const namaFileLama = resep.foto;

      if (filebaru && namaFileLama) {
        const pathFileLama = path.join(
          __dirname,
          "../public/images/upload",
          namaFileLama
        );
        fs.unlinkSync(pathFileLama);
      }

      let { judul_resep, bahan, langkah_pembuatan } = req.body;
      let foto = filebaru || namaFileLama;
      let Data = {
        judul_resep,
        bahan,
        langkah_pembuatan,
        foto,
      };

      await ModelUserResep.update(id, Data);
      req.flash("success", "Berhasil mengupdate data");
      res.redirect("/userresep");
    } catch (error) {
      req.flash("error", "Gagal mengupdate data");
      res.redirect("/userresep");
    }
  }
);


router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    // Ubah baris berikut:
    let resep = await ModelUserResep.getById(id);
    // Menjadi:
    let rows = await ModelUserResep.getById(id);
    const namaFileLama = rows.foto;

    if (namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }

    await ModelUserResep.delete(id);
    req.flash("success", "Berhasil menghapus data");
    res.redirect("/userresep");
  } catch (error) {
    req.flash("error", "Gagal menghapus data");
    res.redirect("/userresep");
  }
});

module.exports = router;
