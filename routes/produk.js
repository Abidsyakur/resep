var express = require("express");
var router = express.Router();
const fs = require("fs");
const multer = require("multer");
const path = require("path");
const Model_Kategori = require("../model/Model_Kategori");
const Model_Produk = require("../model/Model_Produk");
const Model_Users = require("../model/modelUser");

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
    let id = req.session.userId; // Corrected syntax to access session
    let Data = await Model_Users.getId(id); // Corrected method call syntax
    if (Data.length > 0) {
      let rows = await Model_Produk.getAll(); // Corrected method call syntax
      res.render("produk/index", {
        data: rows,
      });
    } else {
      res.redirect("/login"); // Corrected syntax
    }
  } catch (error) {
    res.redirect("/login");
  }
});

router.get("/create", async function (req, res, next) {
  let rows = await Model_Kategori.getAll(); // Corrected method call syntax
  res.render("produk/create", {
    data: rows,
  });
});

router.post(
  "/store",
  upload.single("foto_produk"),
  async function (req, res, next) {
    try {
      let { nama_produk, harga_produk, id_kategori } = req.body; // Destructuring assignment corrected
      let Data = {
        nama_produk,
        harga_produk,
        id_kategori,
        foto_produk: req.file.filename, // Access filename property of req.file
      };
      await Model_Produk.Store(Data); // Use await to ensure the Store operation completes before redirecting
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/produk");
    } catch (error) {
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/produk");
    }
  }
);

router.get("/edit/:id", async function (req, res, next) {
  try {
    let id = req.params.id; // Corrected access to id parameter
    let kategoriRows = await Model_Kategori.getAll(); // Corrected method call syntax
    let rows = await Model_Produk.getId(id); // Corrected method call syntax
    res.render("produk/edit", {
      data: kategoriRows,
      id: rows[0].id_produk,
      nama_produk: rows[0].nama_produk,
      harga_produk: rows[0].harga_produk,
      foto_produk: rows[0].foto_produk,
      id_kategori: rows[0].id_kategori,
      nama_kategori: rows[0].nama_kategori,
    });
  } catch (error) {
    // Added error parameter to catch block
    next(error);
  }
});

router.post(
  "/update/:id",
  upload.single("foto_produk"),
  async function (req, res, next) {
    try {
      let id = req.params.id; // Corrected access to id parameter
      let filebaru = req.file ? req.file.filename : null;
      let rows = await Model_Produk.getId(id);
      const namaFileLama = rows[0].foto_produk;

      if (filebaru && namaFileLama) {
        const pathFileLama = path.join(
          __dirname,
          "../public/images/upload",
          namaFileLama
        ); // Corrected path construction
        fs.unlinkSync(pathFileLama);
      }

      let { nama_produk, harga_produk, id_kategori } = req.body; // Corrected destructuring syntax
      let foto_produk = filebaru || namaFileLama;
      let Data = {
        nama_produk,
        harga_produk,
        id_kategori,
        foto_produk,
      };

      await Model_Produk.Update(id, Data); // Use await to ensure the Update operation completes before redirecting
      req.flash("success", "Berhasil menyimpan data");
      res.redirect("/produk");
    } catch (error) {
      req.flash("error", "Gagal menyimpan data");
      res.redirect("/produk");
    }
  }
);

router.get("/delete/:id", async function (req, res, next) {
  try {
    let id = req.params.id;
    let rows = await Model_Produk.getId(id); // Corrected method call syntax
    const namaFileLama = rows[0].foto_produk;

    if (namaFileLama) {
      const pathFileLama = path.join(
        __dirname,
        "../public/images/upload",
        namaFileLama
      ); // Corrected path construction
      fs.unlinkSync(pathFileLama);
    }

    await Model_Produk.Delete(id); // Use await to ensure the Delete operation completes before redirecting
    req.flash("success", "Berhasil menghapus data");
    res.redirect("/produk");
  } catch (error) {
    req.flash("error", "Gagal menghapus data");
    res.redirect("/produk");
  }
});

module.exports = router;