'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const jwt = require('jsonwebtoken');

const expect = chai.expect;

const { app, runServer, closeServer } = require('../server');
const { Piece } = require('../pieces')
const { User } = require('../users');
const { JWT_SECRET, TEST_DATABASE_URL } = require('../config');

function seedPieceData() {
  console.info('seeding piece data');
  
}
