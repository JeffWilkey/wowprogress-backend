'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
const { Character } = require('../characters')
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const email = 'example.user@example.com'
const username = 'exampleUser';
const password = 'examplePass';
const firstName = 'Example';
const lastName = 'User';
let counter = 0;

async function seedCharacterData() {
  console.info('seeding character data');
    await User
    .insertMany([
      { email, username, password, firstName, lastName },
      { email: 'bobthehacker@haxor.com', username: 'bobthehacker', password }
    ])
    .then((user) => {
      const seedData = [];
      for (let i=1; i <= 10; i++) {
        seedData.push(generateCharacterData(user[0]._id));
      }
      return Character.insertMany(seedData)
    })
}

function generateCharacterData(userId) {
  return {
    userId,
    name: faker.internet.userName(),
    realm: 'Proudmoore',
    realmSlug: 'proudmoore',
    class: 4,
    race: 12,
    faction: 1
  }
}

function tearDownDb() {
  console.warn('Deleting Database');
  return mongoose.connection.dropDatabase();
}

describe('Characters API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedCharacterData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {
    it('should return all existing characters belonging to logged in user', function() {
      const token = jwt.sign(
        {
          user: {
            email,
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      let res;
      return chai.request(app)
        .get('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body.data).to.have.lengthOf.at.least(1);
          return Character.find({ userId: res.body.data[0].userId }).countDocuments();
        })
        .then(function(count) {
          expect(res.body.data).to.have.lengthOf(count);
        });
    });
    it('should return characters with right fields', function() {
      const token = jwt.sign(
        {
          user: {
            email,
            username,
            firstName,
            lastName
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );
      let resCharacter;
      return chai.request(app)
        .get('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body.data).to.be.a('array');
          expect(res.body.data).to.have.lengthOf.at.least(1);

          res.body.data.forEach(function(character) {
            expect(character).to.be.a('object');
            expect(character).to.include.keys('id', 'userId', 'name', 'realm', 'realmSlug', 'class', 'race', 'faction');
          });
          resCharacter = res.body.data[0];
          return Character.findById(resCharacter.id);
        })
        .then(function(character) {
          expect(resCharacter.id).to.equal(character.id);
          expect(resCharacter.userId).to.equal(character.userId);
          expect(resCharacter.name).to.equal(character.name);
          expect(resCharacter.realm).to.equal(character.realm);
          expect(resCharacter.realmSlug).to.equal(character.realmSlug);
          expect(resCharacter.class).to.equal(character.class);
          expect(resCharacter.race).to.equal(character.race);
          expect(resCharacter.faction).to.equal(character.faction);
          expect(resCharacter.created).to.not.be.null;
        });
    });
  });
  describe('POST endpoint', function() {
    it('should add a new character', function() {

      const token = jwt.sign(
        {
          user: {
            email,
            username,
            firstName,
            lastName,
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      const newCharacter = {
        name: faker.internet.userName(),
        realm: 'Proudmoore',
        realmSlug: 'proudmoore',
        class: 4,
        race: 12,
        faction: 1
      };

      return chai.request(app)
        .post('/api/characters')
        .set('Authorization', `Bearer ${token}`)
        .send(newCharacter)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'userId', 'name', 'realm', 'realmSlug', 'class', 'race', 'faction');
          expect(res.body.id).to.not.be.null;
          expect(res.body.name).to.equal(newCharacter.name);
          expect(res.body.realm).to.equal(newCharacter.realm);
          expect(res.body.realmSlug).to.equal(newCharacter.realmSlug);
          expect(res.body.class).to.equal(newCharacter.class);
          expect(res.body.race).to.equal(newCharacter.race);
          expect(res.body.faction).to.equal(newCharacter.faction);

          return Character.findById(res.body.id);
        })
        .then(function(character) {
          expect(character.name).to.equal(newCharacter.name);
          expect(character.realm).to.equal(newCharacter.realm);
          expect(character.realmSlug).to.equal(newCharacter.realmSlug);
          expect(character.class).to.equal(newCharacter.class);
          expect(character.race).to.equal(newCharacter.race);
          expect(character.faction).to.equal(newCharacter.faction);
        });
    });
  });
  describe('PUT endpoint', function() {
   it('should update fields you send over', function() {

     const updateData = {
       name: 'Kazarria',
       realm: 'Proudmoore',
       realmSlug: 'proudmoore',
       class: 4,
       race: 12,
       faction: 1
     }

     let userName = ""

     return Character
       .findOne()
       .then(function(character) {
         const token = jwt.sign(
           {
             user: {
               username,
               email,
             }
           },
           JWT_SECRET,
           {
             algorithm: 'HS256',
             subject: username,
             expiresIn: '7d'
           }
         );
         updateData.id = character.id;

         return chai.request(app)
           .put(`/api/characters/${character.id}`)
           .set('Authorization', `Bearer ${token}`)
           .send(updateData);
       })
       .then(function(res) {
         expect(res).to.have.status(200);
         expect(res.body.name).to.equal(updateData.name)
         expect(res.body.realm).to.equal(updateData.realm)
         expect(res.body.realmSlug).to.equal(updateData.realmSlug)
         expect(res.body.class).to.equal(updateData.class)
         expect(res.body.race).to.equal(updateData.race)
         expect(res.body.faction).to.equal(updateData.faction)
         return Character.findById(updateData.id);
       })
       .then(function(character) {
         expect(character.name).to.equal(updateData.name);
         expect(character.realm).to.equal(updateData.realm);
         expect(character.realmSlug).to.equal(updateData.realmSlug)
         expect(character.class).to.equal(updateData.class)
         expect(character.race).to.equal(updateData.race)
         expect(character.faction).to.equal(updateData.faction)
       });
   });
   it('should not allow you to update a character that does not belong to you', function() {

     const updateData = {
       name: 'Kazarria',
       realm: 'Proudmoore',
       realmSlug: 'proudmoore',
       class: 4,
       race: 12,
       faction: 1
     }

     let userName = ""

     return Character
       .findOne()
       .then(function(character) {
         const token = jwt.sign(
           {
             user: {
               email: 'bobthehacker@haxor.com',
               username: 'bobthehacker'
             }
           },
           JWT_SECRET,
           {
             algorithm: 'HS256',
             subject: username,
             expiresIn: '7d'
           }
         );
         updateData.id = character.id;

         return chai.request(app)
           .put(`/api/characters/${character.id}`)
           .set('Authorization', `Bearer ${token}`)
           .send(updateData)
           .then(() =>
             expect.fail(null, null, 'Request should not succeed')
           )
           .catch(err => {
             if (err instanceof chai.AssertionError) {
               throw err;
             }

             const res = err.response;
             expect(res).to.have.status(401);
           });
       })
   });
 });
 describe('DELETE endpoint', function() {
    it('should delete a character by id', function() {

      let character;

      return Character
        .findOne()
        .then(function(_character) {
          const token = jwt.sign(
            {
              user: {
                email,
                username,
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
          );
          character = _character;
          return chai.request(app)
          .delete(`/api/characters/${character.id}`)
          .set('Authorization', `Bearer ${token}`)

        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Character.findById(character.id);
        })
        .then(function(_character) {
          expect(_character).to.be.null;
        });
    });
    it('should not allow you to delete a post that does not belong to you', function() {

      let character;

      return Character
        .findOne()
        .then(function(_character) {
          const token = jwt.sign(
            {
              user: {
                email: 'bobthehacker@haxor.com',
                username: 'bobthehacker'
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
          );
          character = _character;
          return chai.request(app)
          .delete(`/api/characters/${character.id}`)
          .set('Authorization', `Bearer ${token}`)
          .then(() =>
            expect.fail(null, null, 'Request should not succeed')
          )
          .catch(err => {
            if (err instanceof chai.AssertionError) {
              throw err;
            }

            const res = err.response;
            expect(res).to.have.status(401);
          });
        });
    });
  });
});
