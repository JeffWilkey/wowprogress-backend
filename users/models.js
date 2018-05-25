'use strict';
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const gravatar = require('gravatar');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  firstName: {type: String, default: ''},
  lastName: {type: String, default: ''}
});

UserSchema.virtual('gravatar').get(function () {
  return gravatar.url(this.email, {s: '200', r: 'pg', d: 'retro', protocol: 'https'});
});

UserSchema.methods.serialize = function() {
  return {
    email: this.email || '',
    username: this.username || '',
    firstName: this.firstName || '',
    lastName: this.lastName || '',
    gravatar: this.gravatar || ''
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};
