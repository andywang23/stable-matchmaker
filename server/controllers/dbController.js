const path = require('path');
const {
  RoomieGroup,
  MarriageGroup,
  Admin,
} = require('../db/models/stable-match-models');
const { group } = require('console');
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
dbController.addRoomieGroup = (req, res, next) => {
  //admin creates group with their name, groupName, and array of candidate names

  const { groupName, admin, names } = req.body;
  let adminID;
  let newGroupID;
  let adminGroups;
  Admin.findOne({ username: admin }, (err, data) => {
    if (data) {
      adminID = data._id;
      adminGroups = data.groupsCreated;

      RoomieGroup.create({ groupName, names, admin: adminID }, (err, data) => {
        // if (err) return next({ log: 'invalid creation query in addRoomieGroup' });
        // return next();
        if (data) {
          newGroupID = data._id;
          adminGroups.push(newGroupID);

          Admin.findOneAndUpdate(
            { username: admin },
            { groupsCreated: adminGroups },
            (err, data) => {
              if (err)
                throw Error(
                  'invalid query in addRoomiesGroup findOneAndUpdate'
                );
              return next();
            }
          );
        } else return next({ log: 'invalid query in addRoomiesGroup create' });
      });
    } else return next({ log: 'invalid query in addRoomiesGroup create' });
  });
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
    }).exec();

    await RoomieGroup.findOneAndUpdate(
      { groupName },
      { prefTable: JSON.stringify(prefTable) },
      (err, data) => {
        if (err)
          return next({ log: 'invalid update query in addRoomiePrefList' });
      }
    ).exec();

    return next();
  } catch {
    return next({ log: 'invalid find query in addRoomiePrefList' });
  }
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

dbController.getGroups = async (req, res, next) => {
  const username = req.params.username;
  let groupIDs = [];
  let groupNames = [];

  await Admin.findOne({ username }, (err, data) => {
    if (err || !data) return next({ log: 'invalid find query in getGroups' });
    groupIDs = data.groupsCreated;
  }).exec();

  if (groupIDs.length) {
    for (let i = 0; i < groupIDs.length; i++) {
      const groupID = groupIDs[i];
      await RoomieGroup.findOne({ _id: groupID }, (err, data) => {
        if (err || !data)
          return next({ log: 'invalid find query in getGroups' });
        groupNames.push(data.groupName);
      }).exec();
    }
  }

  res.locals.groupsCreated = groupNames;
  return next();
};

dbController.getGroupStatus = (req, res, next) => {
  //send back 3 different statuses:
  //1: request forms not all filled out (compare names array length to prefTable.keys.length), return
  //filled out pref lists and people still missing
  //2: request forms all submitted, ready to run through algorithm (run through force match first)
  //3: results to be displayed, return data.result object

  const groupName = req.params.groupname;

  RoomieGroup.findOne({ groupName }, (err, data) => {
    if (err) return next({ log: 'invalid query in getGroupStatus' });
    const { names } = data;
    const prefTable = JSON.parse(data.prefTable);
    const submittedPeopleArr = Object.keys(prefTable);
    const numSubmittedResults = submittedPeopleArr.length;
    const result = JSON.parse(data.result);

    let resultsGenerated = Object.keys(result).length ? true : false;

    if (resultsGenerated) {
      res.locals.status = 'results';
      res.locals.results = result;
    }

    if (numSubmittedResults < names.length) {
      const missing = names.filter(
        (name) => !submittedPeopleArr.includes(name)
      );

      res.locals.status = 'missing';
      res.locals.missing = missing;
      res.locals.submittedPrefList = prefTable;
    }

    if (numSubmittedResults === names.length && !resultsGenerated)
      res.locals.status = 'algoReady';

    return next();
  });
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

// dbController.addAdmin({
//   body: {
//     username: 'Andy',
//     password: 'mynameisencoded',
//   },
// });
