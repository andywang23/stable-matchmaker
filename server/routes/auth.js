const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const dbController = require('../controllers/dbController');

router.post('/login', authController.verifyAdmin, (req, res) =>
  res.status(200).send(res.locals.validCreds)
);

router.post('/register', dbController.addAdmin, (req, res) => res.status(201).json(res.locals.msg));

module.exports = router;
