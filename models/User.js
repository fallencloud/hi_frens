//dependencies
const mongoose = require('mongoose');

//init schema
const Schema = mongoose.Schema;

//create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date
  }
});

//export the model
mongoose.model('users', UserSchema);
