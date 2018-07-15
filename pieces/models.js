'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const PieceSchema = mongoose.Schema({
  userImage: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  fullImageUrl: {
    type: String,
    required: true
  },
  body: {
    type: String
  },

});

PieceSchema.methods.serialize = function() {
  return {
    id: this._id || '',
    userImage: this.userImage || '',
    userName: this.userName || '',
    title: this.title || '',
    artist: this.artist || '',
    body: this.body || '',
    thumbnailUrl: this.thumbnailUrl || '',
    fullImageUrl: this.fullImageUrl || ''
  };
};

const Piece = mongoose.model('Piece', PieceSchema);

module.exports = { Piece };
