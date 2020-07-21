const path = require('path');

const stableMarriage = require(path.resolve(
  __dirname,
  './../../algos/gale-shapley'
));
const stableRoomies = require(path.resolve(__dirname, './../../algos/irving'));
const forceMatch = require(path.resolve(
  __dirname,
  './../../algos/force-match'
));

const algoController = {};

algoController.stableMarriage = (req, res, next) => {
  const prefTableInput = req.body;
  const matchTable = stableMarriage(
    prefTableInput.malePref,
    prefTableInput.femalePref
  );

  res.locals.algoUsed = 'stableMarriage';
  res.locals.result = matchTable;

  return next();
};

algoController.stableRoomies = (req, res, next) => {
  const prefTableInput = req.body;
  const matchTable = stableRoomies(prefTableInput);

  res.locals.algoUsed = 'stableRoomies';
  res.locals.result = matchTable;

  return next();
};

algoController.forceMatch = (req, res, next) => {
  const prefTableInput = req.body;
  const matchTable = stableRoomies(prefTableInput);

  res.locals.algoUsed = 'stableRoomies - forced Match';
  res.locals.result = matchTable;

  return next();
};

module.exports = algoController;
