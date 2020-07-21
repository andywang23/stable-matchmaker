const express = require('express');

const algoController = require('../controllers/algoController');
const dbController = require('../controllers/dbController');

const router = express.Router();

router.post('/gale-shapley', algoController.stableMarriage, (req, res) => {
  return res.status(200).json(res.locals.result);
});

//req.body should include prefTable (object with prefarrays)
// and groupName
router.post(
  '/irving',
  algoController.stableRoomies,
  dbController.addResult,
  (req, res) => {
    return res.status(200).json(res.locals.result);
  }
);

//req.body should include prefTable (object with prefarrays)
// and groupName
router.post(
  '/force-match',
  algoController.forceMatch,
  dbController.addResult,
  (req, res) => {
    return res.status(200).json(res.locals.result);
  }
);

module.exports = router;
