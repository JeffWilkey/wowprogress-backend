'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
const { Piece } = require('../pieces')
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

const email = 'example.user@example.com'
const username = 'exampleUser';
const password = 'examplePass';
const firstName = 'Example';
const lastName = 'User';

function seedPieceData() {
  console.info('seeding piece data');

    const seedData = [];
    for (let i=1; i <= 10; i++) {
      seedData.push(generatePieceData());
    }

    return Piece.insertMany(seedData);
}

function generatePieceData() {
  return {
    title: faker.lorem.words(),
    body: faker.lorem.paragraph(),
    artist: `${faker.name.firstName()} ${faker.name.lastName()}`,
    userName: faker.internet.userName(),
    userImage: faker.image.imageUrl(),
    thumbnailUrl: faker.image.imageUrl(),
    fullImageUrl: faker.image.imageUrl()
  }
}

function tearDownDb() {
  console.warn('Deleting Database');
  return mongoose.connection.dropDatabase();
}

describe('Pieces API resource', function() {
  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  beforeEach(function() {
    return seedPieceData();
  });

  afterEach(function() {
    return tearDownDb();
  });

  after(function() {
    return closeServer();
  });

  describe('GET endpoint', function() {
    it('should return all existing pieces', function() {

      const token = jwt.sign(
        {
          user: {
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
        .get('/api/pieces')
        .set('Authorization', `Bearer ${token}`)
        .then(function(_res) {
          res = _res;
          expect(res).to.have.status(200);
          expect(res.body).to.have.lengthOf.at.least(1);
          return Piece.count();
        })
        .then(function(count) {
          expect(res.body).to.have.lengthOf(count);
        });
    });
    it('should return pieces with right fields', function() {

      const token = jwt.sign(
        {
          user: {
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
      let resPiece;
      return chai.request(app)
        .get('/api/pieces')
        .set('Authorization', `Bearer ${token}`)
        .then(function(res) {
          expect(res).to.have.status(200);
          expect(res).to.be.json;
          expect(res.body).to.be.a('array');
          expect(res.body).to.have.lengthOf.at.least(1);

          res.body.forEach(function(piece) {
            expect(piece).to.be.a('object');
            expect(piece).to.include.keys('id', 'title', 'body', 'artist', 'userName', 'userImage', 'thumbnailUrl', 'fullImageUrl');
          });
          resPiece = res.body[0];
          return Piece.findById(resPiece.id);
        })
        .then(function(piece) {
          expect(resPiece.id).to.equal(piece.id);
          expect(resPiece.title).to.equal(piece.title);
          expect(resPiece.body).to.equal(piece.body);
          expect(resPiece.artist).to.equal(piece.artist);
          expect(resPiece.userName).to.equal(piece.userName);
          expect(resPiece.userImage).to.equal(piece.userImage);
          expect(resPiece.thumbnailUrl).to.equal(piece.thumbnailUrl);
          expect(resPiece.fullImageUrl).to.equal(piece.fullImageUrl);
          expect(resPiece.created).to.not.be.null;
        });
    });
  });
  describe('POST endpoint', function() {
    it('should add a new piece', function() {

      const token = jwt.sign(
        {
          user: {
            email,
            username,
            firstName,
            lastName,
            gravatar: 'http://gravatarurl.com'
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      const newPiece = {
        title: faker.lorem.words(),
        body: faker.lorem.paragraph(),
        artist: `${faker.name.firstName()} ${faker.name.lastName()}`,
        thumbnailUrl: faker.image.imageUrl(),
        fullImageUrl: faker.image.imageUrl()
      };

      return chai.request(app)
        .post('/api/pieces')
        .set('Authorization', `Bearer ${token}`)
        .send(newPiece)
        .then(function(res) {
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.be.a('object');
          expect(res.body).to.include.keys('id', 'title', 'body', 'artist', 'userName', 'userImage', 'thumbnailUrl', 'fullImageUrl');
          expect(res.body.title).to.equal(newPiece.title);
          expect(res.body.id).to.not.be.null;
          expect(res.body.body).to.equal(newPiece.body);
          expect(res.body.artist).to.equal(newPiece.artist);
          expect(res.body.thumbnailUrl).to.equal(newPiece.thumbnailUrl);
          expect(res.body.fullImageUrl).to.equal(newPiece.fullImageUrl);
          expect(res.body.userName).to.equal(username);
          expect(res.body.userImage).to.equal('http://gravatarurl.com')

          return Piece.findById(res.body.id);
        })
        .then(function(piece) {
          expect(piece.title).to.equal(newPiece.title);
          expect(piece.body).to.equal(newPiece.body);
          expect(piece.artist).to.equal(newPiece.artist);
          expect(piece.thumbnailUrl).to.equal(newPiece.thumbnailUrl);
          expect(piece.fullImageUrl).to.equal(newPiece.fullImageUrl);
          expect(piece.userName).to.equal(username);
          expect(piece.userImage).to.equal('http://gravatarurl.com')
        });
    });
  });
  describe('PUT endpoint', function() {
   it('should update fields you send over', function() {

     const updateData = {
       	title: "Chroma II",
       	artist: "Dan Mumford",
       	thumbnailUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/t/5a301f8571c10b0f0555750c/1513103247075/Close_encounters_danmumford.jpg?format=original",
       	fullImageUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/5a301f1124a694fe6ea639eb/5a301f1e0d9297e3b10cb652/1513103148310/CLOSE_ENCOUNTERS.jpg?format=750w",
       	body: "A description about Chroma II"
     }

     let userName = ""

     return Piece
       .findOne()
       .then(function(piece) {
         const token = jwt.sign(
           {
             user: {
               username: piece.userName
             }
           },
           JWT_SECRET,
           {
             algorithm: 'HS256',
             subject: username,
             expiresIn: '7d'
           }
         );
         updateData.id = piece.id;
         userName = piece.userName;

         return chai.request(app)
           .put(`/api/pieces/${piece.id}`)
           .set('Authorization', `Bearer ${token}`)
           .send(updateData);
       })
       .then(function(res) {
         expect(res).to.have.status(200);
         expect(res.body.title).to.equal(updateData.title)
         expect(res.body.body).to.equal(updateData.body)
         expect(res.body.artist).to.equal(updateData.artist)
         expect(res.body.thumbnailUrl).to.equal(updateData.thumbnailUrl)
         expect(res.body.fullImageUrl).to.equal(updateData.fullImageUrl)
         expect(res.body.userName).to.equal(userName)
         return Piece.findById(updateData.id);
       })
       .then(function(piece) {
         expect(piece.title).to.equal(updateData.title);
         expect(piece.body).to.equal(updateData.body);
         expect(piece.artist).to.equal(updateData.artist)
         expect(piece.thumbnailUrl).to.equal(updateData.thumbnailUrl)
         expect(piece.fullImageUrl).to.equal(updateData.fullImageUrl)
         expect(piece.userName).to.equal(userName)
       });
   });
   it('should not allow you to update a piece that does not belong to you', function() {

     const updateData = {
       	title: "Chroma II",
       	artist: "Dan Mumford",
       	thumbnailUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/t/5a301f8571c10b0f0555750c/1513103247075/Close_encounters_danmumford.jpg?format=original",
       	fullImageUrl: "https://static1.squarespace.com/static/53e4ea80e4b0a79b40480ad4/5a301f1124a694fe6ea639eb/5a301f1e0d9297e3b10cb652/1513103148310/CLOSE_ENCOUNTERS.jpg?format=750w",
       	body: "A description about Chroma II"
     }

     let userName = ""

     return Piece
       .findOne()
       .then(function(piece) {
         const token = jwt.sign(
           {
             user: {
               username: "BOBTHEHACKER"
             }
           },
           JWT_SECRET,
           {
             algorithm: 'HS256',
             subject: username,
             expiresIn: '7d'
           }
         );
         updateData.id = piece.id;
         userName = piece.userName;

         return chai.request(app)
           .put(`/api/pieces/${piece.id}`)
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
    it('should delete a piece by id', function() {

      let piece;

      return Piece
        .findOne()
        .then(function(_piece) {
          const token = jwt.sign(
            {
              user: {
                username: _piece.userName
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
          );
          piece = _piece;
          return chai.request(app)
          .delete(`/api/pieces/${piece.id}`)
          .set('Authorization', `Bearer ${token}`)

        })
        .then(function(res) {
          expect(res).to.have.status(204);
          return Piece.findById(piece.id);
        })
        .then(function(_piece) {
          expect(_piece).to.be.null;
        });
    });
    it('should not allow you to delete a post that does not belong to you', function() {
      
      let piece;

      return Piece
        .findOne()
        .then(function(_piece) {
          const token = jwt.sign(
            {
              user: {
                username: "BOBTHEHACKER"
              }
            },
            JWT_SECRET,
            {
              algorithm: 'HS256',
              subject: username,
              expiresIn: '7d'
            }
          );
          piece = _piece;
          return chai.request(app)
          .delete(`/api/pieces/${piece.id}`)
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
