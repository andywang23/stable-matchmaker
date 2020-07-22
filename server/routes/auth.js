const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');

router.post('/login', authController.verifyAdmin, (req, res) => {
  res.status(200).send(res.locals.validCreds);
});

module.exports = router;
