const express = require("express");
const modelUser = require("../model/modelUser");
const modelResep = require("../model/ModelResep"); // Import model resep
const router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let id = req.session.userId;
    let userData = await modelUser.getId(id); // Data user
    if (userData.length > 0) {
      // Mengambil data resep favorit
      let favoriteRecipes = await modelResep.getFavoriteRecipes(id);
      // Mengambil data ide resep
      
      // Render template dengan melewatkan data yang diperlukan
      res.render('users/index', {
        title: 'Users Home',
        email: userData[0].email,
        favoriteRecipes: favoriteRecipes, // Data resep favorit
        data: userData // Data user
      });
    } else {
      res.redirect('/login'); // Redirect to login page if not logged in
    }
  } catch (error) {
    console.error(error); // Log the error to console
    res.status(500).json('Internal Server Error'); // Return Internal Server Error
  }
});


module.exports = router;
