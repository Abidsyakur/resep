var express = require("express");
var router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const ModelIdeResep = require("../model/ModelIdeResep");
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
      let rows = await ModelIdeResep.getAll();
      res.render("ideresep/index", { // Ubah path template menjadi ide-resep
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
  res.render("ideresep/create"); // Ubah path template menjadi ide-resep
});

router.post(
  "/store",
  upload.single("foto"),
  async function (req, res, next) {
    try {
      let { judul_ide, bahan_ide, langkah_pembuatan_ide } = req.body;
      let Data = {
        judul_ide,
        bahan_ide,
        langkah_pembuatan_ide,
        foto: req.file.filename
      };
      await ModelIdeResep.create(Data);
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/ideresep"); // Ubah redirect path menjadi /resep
    } catch (error) {
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/ideresep"); // Ubah redirect path menjadi /resep
    }
  }
);


router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let resep = await ModelIdeResep.getById(id);
    res.render("ideresep/edit", { // Ubah path template menjadi ide-resep
      id: id,
      judul_ide: resep.judul_ide,
      bahan_ide: resep.bahan_ide,
      langkah_pembuatan_ide: resep.langkah_pembuatan_ide,
      foto: resep.foto,
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
      let resep = await ModelIdeResep.getById(id);
      const namaFileLama = resep.foto;

      if (filebaru && namaFileLama) {
        const pathFileLama = path.join(
          __dirname,
          "../public/images/upload",
          namaFileLama
        );
        fs.unlinkSync(pathFileLama);
      }

      let { judul_ide, bahan_ide, langkah_pembuatan_ide } = req.body;
      let foto = filebaru || namaFileLama;
      let Data = {
        judul_ide,
        bahan_ide,
        langkah_pembuatan_ide,
        foto,
      };

      await ModelIdeResep.update(id, Data);
      req.flash("success", "Berhasil mengupdate data");
      res.redirect("/ideresep"); // Ubah redirect path menjadi /resep
    } catch (error) {
      req.flash("error", "Gagal mengupdate data");
      res.redirect("/ideresep"); // Ubah redirect path menjadi /resep
    }
  }
);

router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await ModelIdeResep.getById(id);
    const namaFileLama = rows.foto;

    if (namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      );
      fs.unlinkSync(pathFileLama);
    }

    await ModelIdeResep.delete(id);
    req.flash("success", "Berhasil menghapus data");
    res.redirect("/ideresep"); // Ubah redirect path menjadi /resep
  } catch (error) {
    req.flash("error", "Gagal menghapus data");
    res.redirect("/ideresep"); // Ubah redirect path menjadi /resep
  }
});

module.exports = router;
