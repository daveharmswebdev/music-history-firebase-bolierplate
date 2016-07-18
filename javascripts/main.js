"use strict";

let $ = require('jquery'),
    db = require("./db-interaction"),
    templates = require("./dom-builder"),
    firebase = require('firebase/app'),
    currentUser = null,
    login = require("./user");

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('>>>> i did this after bundle change', user.uid);
    currentUser = user.uid;
    console.log(currentUser);
    db.getSongs(templates.makeSongList, currentUser);
  } else {
    console.log('user not logged in');
  }
});

// if (currentUser.getUser()) {
//   console.log('true');
// } else {
//   console.log('not logged in');
// }
// login.checkUser()
// .then(function(user) {
//   if (true) {
//     db.getSongs(templates.makeSongList);
//   }
// });

// No need to reload the DOM in the ".then"
$(document).on("click", ".save_new_btn", function() {
  let songObj = buildSongObj();
  db.addSong(songObj)
  .then(function(songData) {
    console.log('song saved', songData.key);
  });
});

// // Load and populate form for editing a song
$(document).on("click", ".edit-btn", function () {
  let editId = $(this).data('edit-id');
  db.getSong(editId)
  .then(function(song) {
    console.log(song.val());
    return templates.songForm(song.val(), editId);
  })
  .then(function(finishedForm) {
      $('.uiContainer--wrapper').html(finishedForm);
  });
});

// //Save edited song to FB then reload DOM with updated song data
$(document).on("click", ".save_edit_btn", function() {
  let songObj = buildSongObj(),
      songId = $(this).attr('id');
  db.editSong(songObj, songId)
  .then(function() {
    console.log('edited');
  });
});

// // Remove song then reload the DOM w/out new song
$(document).on("click", ".delete-btn", function () {
  console.log('delete click');
  let deleteId = $(this).data('delete-id');
  console.log('main', deleteId);
  db.deleteSong(deleteId)
  .then(function() {
    console.log('deleted');
  });
});

// User login section. Should ideally be in its own module
$("#auth-btn").click(function() {
  console.log("clicked auth");
  login()
  .then(function(result) {
    var user = result.user;
    console.log('logged in user', user.uid);
    db.getSongs(templates.makeSongList);
  }).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    // The email of the user's account used.
    var email = error.email;
    // The firebase.auth.AuthCredential type that was used.
    var credential = error.credential;
    // ...
  });
});

// Helper functions for forms stuff. Nothing related to Firebase
// Build a song obj from form data.
function buildSongObj() {
    let songObj = {
    title: $("#form--title").val(),
    artist: $("#form--artist").val(),
    album: $("#form--album").val(),
    year: $("#form--year").val(),
    uid: currentUser
  };
  return songObj;
}

// Load the new song form
$("#add-song").click(function() {
  console.log("clicked add song");
  var songForm = templates.songForm()
  .then(function(songForm) {
    $(".uiContainer--wrapper").html(songForm);
  });
});

// Using the REST API
// function loadSongsToDOM() {
//   $('uiContainer--wrapper').html('');
//   db.getSongs().then(function(songData) {
//     templates.makeSongList(songData);
//   });
// }
// loadSongsToDOM();
//
// // Send newSong data to db then reload DOM with updated song data
// $(document).on("click", ".save_new_btn", function() {
//   let songObj = buildSongObj();
//   db.addSong(songObj)
//   .then(function() {
//     loadSongsToDOM();
//   });
// });
//
// // Load and populate form for editing a song
// $(document).on("click", ".edit-btn", function () {
//   let songId = $(this).data('edit-id');
//   console.log(songId);
//   db.getSong(songId)
//   .then(function(song) {
//     return templates.songForm(song, songId);
//   })
//   .then(function(finishedForm) {
//     $('.uiContainer--wrapper').html(finishedForm);
//   });
// });
//
// //Save edited song to FB then reload DOM with updated song data
// $(document).on("click", ".save_edit_btn", function() {
//   let songObj = buildSongObj(),
//       songId = $(this).attr('id');
//   db.editSong(songObj, songId)
//   .then(function(data) {
//     loadSongsToDOM();
//   });
// });
//
// // Remove song then reload the DOM w/out new song
// $(document).on("click", ".delete-btn", function () {
//   let deleteId = $(this).attr('data-delete-id');
//   console.log(deleteId);
//   db.deleteSong(deleteId)
//   .then(function() {
//     loadSongsToDOM();
//   });
// });
//

// *******************************************************
// Using the Firebase SDK and its auto update.
// Calling "getSongs" now sets up a listener when loading the DOM.
// Pass it a callback that handles the incoming data and it will re-call that
// function when anything changes in our data

// Use before adding Oauth, then move to Oauth callback
