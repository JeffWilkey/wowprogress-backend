'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CharacterSchema = mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  realm: {
    type: String,
    required: true
  }
});

CharacterSchema.methods.serialize = function() {
  return {
    id: this._id || '',
    userId: this.userId || '',
    image: this.image || '',
    name: this.name || '',
    realm: this.realm || ''
  };
};

const Character = mongoose.model('Character', CharacterSchema);

module.exports = { Character };
