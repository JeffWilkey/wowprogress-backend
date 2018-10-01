const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');

const { Character } = require('./models');
const { User } = require('../users/models');

const jwtAuth = passport.authenticate('jwt', {session: false});
router.use(bodyParser.json());
// The user exchanges a valid JWT for a new one with a later expiration
router.get('/', jwtAuth, (req, res) => {
  console.log(req.user);
  User
  .findOne({ email: req.user.email })
  .then((user) => {
    console.log(user);
    Character
    .find({ userId: user._id })
    .then(characters => {
      if (characters.length) {
        res.status(200).json({
          data: characters.map((character) => character.serialize())
        });
      } else {
        res.status(200).json({
          data: []
        });
      }

    })
    .catch(err => {
      console.error(err);
      res.status(500).json(err);
    });
  })

});

router.get('/:id', jwtAuth, (req, res) => {
  Character
    .findById(req.params.id)
    .then(character => res.json(character.serialize()))
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.post('/', jwtAuth, (req, res) => {
  const requiredFields = ['name', 'realm', 'realmSlug', 'class', 'race', 'faction'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (req.body[field] === '' || req.body[field] === null) {
      const message = `${field.charAt(0).toUpperCase() + field.substr(1)} is required`;
      console.error(message);
      return res.status(400).json({message});
    }
  }

  User.findOne({email: req.user.email})
  .then(user => {
    console.log({...req.body, userId: user._id.toString()})
    Character
      .create({...req.body, userId: user._id.toString()})
      .then(character => res.status(201).json(character.serialize()))
      .catch(err => {
        res.status(500).json({ message: 'Internal server error' });
      });
  })
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
  User
  .findOne({ email: req.user.email })
  .then((user) => {
    Character
    .findById(req.params.id)
    .then((character) => {
      console.log(character.userId, user._id);
      if (character.userId.toString() !== user._id.toString()) {
        const message = "That character doesn't belong to you"
        console.error(message);
        return res.status(401).json({ message: message });
      }
      const toUpdate = {};
      const updateableFields = ['name', 'realm', 'realmSlug'];

      for (let i = 0; i < updateableFields.length; i++) {
        const field = updateableFields[i];
        if (req.body[field] === '' || req.body[field] === null) {
          const message = `${field.charAt(0).toUpperCase() + field.substr(1)} is required`;
          console.error(message);
          return res.status(400).json({message});
        }
      }

      updateableFields.forEach(field => {
        if (field in req.body) {
          toUpdate[field] = req.body[field];
        }
      });

      Character
      .findByIdAndUpdate(req.params.id, { $set: toUpdate }, {new: true})
      .then((character) => {
        res.status(200).json(character)
      })
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
    }).catch((err) => {
      console.error(err.message)
    })

  })

});

router.delete('/:id', jwtAuth, (req, res) => {
  User.findOne({ email: req.user.email })
  .then((user) => {
    Character
    .findById(req.params.id)
    .then((character) => {
      if (character.userId.toString() !== user._id.toString()) {
        const message = "That post doesn't belong to you"
        console.error(message);
        return res.status(401).json({ message: message });
      }
      Character
      .findByIdAndRemove(req.params.id)
      .then(character => res.status(204).end())
      .catch(err => res.status(500).json({ message: 'Internal server error' }));
    });
  });
});

module.exports = {router};
