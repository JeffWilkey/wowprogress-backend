'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const CharacterSchema = mongoose.Schema({
  userId: {
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
  },
  realmSlug: {
    type: String,
    required: true
  },
  class: {
    type: Number,
    required: true
  },
  race: {
    type: Number,
    required: true
  },
  faction: {
    type: Number,
    required: true
  }
});

CharacterSchema.methods.serialize = function() {
  return {
    id: this._id || '',
    userId: this.userId || '',
    name: this.name || '',
    realm: this.realm || '',
    realmSlug: this.realmSlug || '',
    class: this.class || null,
    race: this.race || null,
    faction: this.faction || null
  };
};

const Character = mongoose.model('Character', CharacterSchema);

module.exports = { Character };
