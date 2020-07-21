const path = require('path');
const {
  RoomieGroup,
  MarriageGroup,
  Admin,
} = require('../db/models/stable-match-models');
const models = require(path.resolve(
  __dirname,
  './../db/models/stable-match-models'
));

const dbController = {};

dbController.addMarriageGroup = (req, res, next) => {
  //admin creates group with their name, groupName, and array of candidate names
  const { groupName, admin, proposerNames, proposeeNames } = req.body;

  MarriageGroup.create(
    { groupName, proposerNames, proposerNames, admin },
    (err, data) => {
      if (err)
        return next({ log: 'invalid creation query in addMarriageGroup' });
      return next();
    }
  );
};

//TODO: FIX CONSOLE LOGS
dbController.addRoomieGroup = async (req, res, next) => {
  //admin creates group with their name, groupName, and array of candidate names

  const { groupName, admin, names } = req.body;
  let adminID;
  try {
    await Admin.findOne({ username: admin }, (err, data) => {
      if (data) adminID = data._id;
      else throw Error('invalid query in addRoomiesGroup findOne');
    });

    await RoomieGroup.create(
      { groupName, names, admin: adminID },
      (err, data) => {
        // if (err) return next({ log: 'invalid creation query in addRoomieGroup' });
        // return next();
        if (data) console.log('success');
        console.log(err);
        // else throw Error('invalid query in addRoomiesGroup create');
      }
    );
  } catch {
    return next({ log: 'invalid query in addRoomieGroup' });
  }
};

//TO COMPLETE
dbController.addMarriagePrefList = async (req, res, next) => {
  //first detect if user is in proposer or proposee group

  const { groupName } = req.body;
  let correctTable = null;

  await MarriageGroup.findOne({ groupName }, (err, data) => {
    if (err) return next({ log: 'invalid find query in addMarriagePrefList' });
    return console.log(data);
  });
};

dbController.addRoomiePrefList = async (req, res, next) => {
  const { groupName, personName, prefArray } = req.body;
  let prefTable;

  try {
    await RoomieGroup.findOne({ groupName }, (err, data) => {
      prefTable = JSON.parse(data.prefTable);
      prefTable[personName] = prefArray;
    });
  } catch {
    return next({ log: 'invalid find query in addRoomiePrefList' });
  }

  RoomieGroup.findOneAndUpdate(
    { groupName },
    { prefTable: JSON.stringify(prefTable) },
    (err, data) => {
      if (err)
        return next({ log: 'invalid update query in addRoomiePrefList' });
      //   else console.log('success');
      return next();
    }
  );
};

dbController.addAdmin = (req, res, next) => {
  const { username, password } = req.body;

  Admin.create({ username, password }, (err, data) => {
    if (err) return next({ log: 'invalid find query in addAdmin' });
    // return console.log(err);
  });
};

dbController.addResult = (req, res, next) => {
  const result = JSON.stringify(res.locals.result);
  const algoUsed = res.locals.algoUsed;

  const groupName = req.body.groupName;

  if (algoUsed === 'stableRoomies') {
    RoomieGroup.findOneAndUpdate({ groupName }, { result }, (err, data) => {
      if (err)
        return next({ log: 'invalid find query in addResult/stableRoomies' });
      else return next();
    });
  }

  if (algoUsed === 'stableMarriage') {
    MarriageGroup.findOneAndUpdate({ groupName }, { result }, (err, data) => {
      if (err)
        return next({ log: 'invalid find query in addResult/stableMarriage' });
      else return next();
    });
  }
};

module.exports = dbController;

const sampleRoomieGroup = {
  body: {
    groupName: 'testGroup',
    admin: 'Andy',
    names: ['Kirsten', 'Milan', 'Michael', 'Marina'],
  },
};

// dbController.addRoomieGroup(sampleRoomieGroup);

// dbController.addRoomiePrefList({
//   body: {
// groupName: 'testGroup',
// personName: 'Michael',
// prefArray: ['Kirsten', 'Milan', 'Marina'],
//   },
// });

dbController.addAdmin({
  body: {
    username: 'Andy-Encoded',
    password: 'mynameisencoded',
  },
});
