'use strict';
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const ArticleSchema = mongoose.Schema({
  userId: {
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
    userId: this.userId || '',
    title: this.title || '',
    body: this.firstName || ''
  };
};

const Article = mongoose.model('Article', ArticleSchema);

module.exports = { Article };
