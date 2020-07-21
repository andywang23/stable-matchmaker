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
  const prefTableInput = req.body.prefTable;
  const matchTable = stableMarriage(
    prefTableInput.malePref,
    prefTableInput.femalePref
  );

  res.locals.algoUsed = 'stableMarriage';
  res.locals.result = matchTable;

  return next();
};

algoController.stableRoomies = (req, res, next) => {
  const prefTableInput = req.body.prefTable;
  const matchTable = stableRoomies(prefTableInput);

  res.locals.algoUsed = 'stableRoomies';
  res.locals.result = matchTable;

  //algo will spit out object if stable match is found
  return typeof res.locals.result === 'string'
    ? next({ message: 'Unable to find stable match' })
    : next();
};

algoController.forceMatch = (req, res, next) => {
  const prefTableInput = req.body.prefTable;
  const matchTable = forceMatch(prefTableInput);

  res.locals.algoUsed = 'stableRoomies';
  res.locals.result = matchTable;

  return typeof res.locals.result === 'string'
    ? next({ message: 'Unable to find stable match' })
    : next();
};

module.exports = algoController;
