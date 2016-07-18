'use strict';

var firebase = require('./firebaseConfig');
let currentUser = null;

function getUser() {
  return currentUser;
}

function setUser(user) {
  currentUser = user;
}

module.exports = {
  setUser,
  getUser
};
