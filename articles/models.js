'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ArticleSchema = mongoose.Schema({
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
  body: {
    type: String,
    required: true
  }
});

ArticleSchema.methods.serialize = function() {
  return {
    userImage: this.userImage || '',
    userName: this.userName || '',
    title: this.title || '',
    body: this.body || ''
  };
};

const Article = mongoose.model('Article', ArticleSchema);

module.exports = { Article };
