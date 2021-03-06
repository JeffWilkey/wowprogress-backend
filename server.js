'use strict';
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const passport = require('passport');
const sassMiddleware = require('node-sass-middleware');
const path = require('path');
const cors = require('cors');

const { router: usersRouter } = require('./users');
const { router: authRouter, localStrategy, jwtStrategy } = require('./auth');
const { router: charactersRouter } = require('./characters');

mongoose.Promise = global.Promise;

const { PORT, DATABASE_URL } = require('./config');

const app = express();

// Logging
app.use(morgan('common'));

// CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin,Content-Type,Authorization,Accept');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.send(204);
  }
  next();
});

// Authentication
passport.use(localStrategy);
passport.use(jwtStrategy);

app.use('/api/users/', usersRouter);
app.use('/api/auth/', authRouter);
app.use('/api/characters/', charactersRouter);

const jwtAuth = passport.authenticate('jwt', { session: false });

app.use(sassMiddleware({
    /* Options */
    src: path.join(__dirname, '/public/sass'),
    dest: path.join(__dirname, '/public/styles'),
    debug: true,
    outputStyle: 'compressed',
    prefix:  '/styles'  // Where prefix is at <link rel="stylesheets" href="prefix/style.css"/>
}));

app.use('/', express.static(path.join(__dirname, 'public')));

// A protected endpoint which needs a valid JWT to access it
app.get('/api/protected', jwtAuth, (req, res) => {
  return res.json({
    data: 'rosebud'
  });
});

app.use('*', (req, res) => {
  return res.status(404).json({ message: 'Not Found' });
});

// Referenced by both runServer and closeServer. closeServer
// assumes runServer has run and set `server` to a server object
let server;

function runServer(databaseUrl, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve();
      })
        .on('error', err => {
          mongoose.disconnect();
          reject(err);
        });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer(DATABASE_URL).catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
