const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { Article } = require('./models')

const jwtAuth = passport.authenticate('jwt', {session: false});

// The user exchanges a valid JWT for a new one with a later expiration
router.get('/', jwtAuth, (req, res) => {
  Article
  .find()
  .then(articles => {
    res.status(200).json(
      articles.map((article) => article.serialize())
    );
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {

});

module.exports = {router};
