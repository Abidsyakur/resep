const express = require('express');
const modelUser = require('../model/modelUser');
const router = express.Router();

/* GET users listing. */
router.get('/', async function (req, res, next) {
  try {
    let id = req.session.userId;
    let Data = await modelUser.getId(id);
    if (Data.length > 0) {
      if (Data[0].level_users != 1) {
        res.redirect('/logout');
      } else {
        res.render('users/super', {
          title: 'Users Home',
          email: Data[0].email
        });
      }
    } else {
      res.status(401).json({ error: 'User tidak ada' });
    }
  } catch (error) {
    res.status(501).json('Butuh akses login');
  }
});

module.exports = router;
