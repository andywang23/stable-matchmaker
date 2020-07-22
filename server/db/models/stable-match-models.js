const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const bcrypt = require('bcryptjs');

mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'stable-matching',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

const Schema = mongoose.Schema;

const marriageGroupSchema = new Schema({
  groupName: { type: String, required: true },
  proposerNames: { type: [String], required: true },
  proposeeNames: { type: [String], required: true },
  proposerPrefTable: { type: String, required: true, default: '{}' },
  proposeePrefTable: { type: String, required: true, default: '{}' },
  admin: { type: Schema.Types.ObjectId, required: true },
  result: { type: String },
});
const MarriageGroup = mongoose.model('marriage group', marriageGroupSchema);

const roomieGroupSchema = new Schema({
  groupName: { type: String, required: true, unique: true },
  names: { type: [String], required: true },
  prefTable: { type: String, required: true, default: '{}' },
  admin: { type: Schema.Types.ObjectId, required: true },
  result: { type: String, default: '{}' },
});
const RoomieGroup = mongoose.model('roomie group', roomieGroupSchema);

const adminSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  groupsCreated: { type: [Schema.Types.ObjectId], default: [] },
});

adminSchema.pre('save', function (next) {
  let user = this;
  const SALT_WORK_FACTOR = 10;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      return next();
    });
  });
});

adminSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return callback(err);
    callback(null, isMatch);
    //isMatch will be true or false
  });
};

const Admin = mongoose.model('admin', adminSchema);

module.exports = {
  MarriageGroup,
  RoomieGroup,
  Admin,
};
