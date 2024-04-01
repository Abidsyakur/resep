var express = require("express");
var router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ModelResep = require("../model/ModelResep");
const modelUser = require("../model/modelUser");

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
      let rows = await ModelResep.getAll();
      res.render("resep/index", {
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
  res.render("resep/create");
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
      await ModelResep.create(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/resep");
    } catch (error) {
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/resep");
    }
  }
);

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let resep = await ModelResep.getById(id);
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



router.post(
  "/update/:id",
  upload.single("foto"),
  async function (req, res, next) {
    try {
      let id = req.params.id;
      let filebaru = req.file ? req.file.filename : null;
      // Ubah baris berikut:
      let rows = await ModelResep.getById(id);
      // Menjadi:
      let resep = await ModelResep.getById(id);
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

      await ModelResep.update(id, Data);
      req.flash("success", "Berhasil mengupdate data");
      res.redirect("/resep");
    } catch (error) {
      req.flash("error", "Gagal mengupdate data");
      res.redirect("/resep");
    }
  }
);


router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    // Ubah baris berikut:
    let resep = await ModelResep.getById(id);
    // Menjadi:
    let rows = await ModelResep.getById(id);
    const namaFileLama = rows.foto;

    if (namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }

    await ModelResep.delete(id);
    req.flash("success", "Berhasil menghapus data");
    res.redirect("/resep");
  } catch (error) {
    req.flash("error", "Gagal menghapus data");
    res.redirect("/resep");
  }
});

module.exports = router;
