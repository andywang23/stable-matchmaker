const express = require('express');
const dbController = require('../controllers/dbController');

const router = express.Router();

router.get('/groups/:username', dbController.getGroups, (req, res) =>
  res.status(200).json(res.locals.groupsCreated)
);

router.post('/groups', dbController.addRoomieGroup, (req, res) =>
  res.status(201).json('successful addition of group')
);

router.patch('/groups', dbController.addRoomiePrefList, (req, res) =>
  res.status(201).send('successful addition of preference array')
);

router.get('/groupstatus/:groupname', dbController.getGroupStatus, (req, res) =>
  res.status(200).json(res.locals)
);

router.get('/groupname/:groupid', dbController.getGroupStatusbyID, (req, res) =>
  res.status(200).json(res.locals)
);

module.exports = router;
