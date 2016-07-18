"use strict";
let firebase = require("./firebaseConfig"),
    currentUser = require('./currentUser'),
    provider = new firebase.auth.GoogleAuthProvider();

function logInGoogle() {
  return firebase.auth().signInWithPopup(provider);
}


// firebase.auth().onAuthStateChanged(function(user) {
//   if (user) {
//     console.log('>>>> i did this after bundle change', user.uid);
//     currentUser.setUser(user.uid);
//   } else {
//     console.log('user not logged in');
//     currentUser.setUser(null);
//     return false;
//   }
// });


// function checkUser() {
//   firebase.auth().onAuthStateChanged(function(user) {
//     currentUser.setUser(user);
//   });
// }


module.exports = logInGoogle;
