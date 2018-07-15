const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { Piece } = require('./models');

const jwtAuth = passport.authenticate('jwt', {session: false});
router.use(bodyParser.json());
// The user exchanges a valid JWT for a new one with a later expiration
router.get('/', jwtAuth, (req, res) => {
  Piece
  .find()
  .then(pieces => {
    res.status(200).json(
      pieces.map((piece) => piece.serialize())
    );
  })
  .catch(err => {
    console.error(err);
    res.status(500).json(err);
  });
});

router.get('/:id', jwtAuth, (req, res) => {
  Piece
    .findById(req.params.id)
    .then(piece => res.json(piece.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', jwtAuth, (req, res) => {
  const requiredFields = ['title', 'body', 'artist', 'thumbnailUrl', 'fullImageUrl']
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  userDetails = {
    userImage: req.user.gravatar,
    userName: req.user.username
  }
  Piece
    .create({...req.body, ...userDetails})
    .then(piece => res.status(201).json(piece.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.put('/:id', jwtAuth, (req, res) => {
  // ensure that the id in the request path and the one in request body match
  if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
    const message = (
      `Request path id (${req.params.id}) and request body id ` +
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).json({ message: message });
  }

  const toUpdate = {};
  const updateableFields = ['title', 'body'];

  updateableFields.forEach(field => {
    if (field in req.body) {
      toUpdate[field] = req.body[field];
    }
  });

  Piece
  .findByIdAndUpdate(req.params.id, { $set: toUpdate })
  .then(piece => res.status(200).json(piece.serialize()))
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

router.delete('/:id', jwtAuth, (req, res) => {
  Piece
  .findByIdAndRemove(req.params.id)
  .then(piece => res.status(204).end())
  .catch(err => res.status(500).json({ message: 'Internal server error' }));
});

module.exports = {router};
