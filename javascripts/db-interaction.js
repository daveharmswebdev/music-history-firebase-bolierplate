"use strict";
// This module has no knowledge of the DOM, or where the data goes after it is fetched from Firebase.
// It is only concerned with getting and setting data in the db

let firebase = require("./firebaseConfig");
let fb = require('./fb-getter');
let fbData = fb();
let $ = require('jquery');

// ****************************************
// DB interaction using Firebase SDK
// ****************************************


    function getSongs(callback, userId) {
      console.log(userId);
      let songs = firebase.database().ref('songs');
      songs.orderByChild('uid').equalTo(userId).on('value', function(songData) {
        console.log('something happened', songData.val());
        callback(songData.val());
      });
    }

    // function getSongsAjax(callback, userId) {
    //   return new Promise(function(resolve, reject) {
    //     $.ajax({
    //       url: `https://music-history-7af37.firebaseio.com/song.json?orderBy=uid&equalTo=${userId}`
    //     }).done(function(songData) {
    //       resolve(songData);
    //     });
    //   });
    // }

    function addSongAjax(songFormObj) {
      return new Promise(function(resolve, reject) {
        $.ajax({
          url: 'https://music-history-7af37.firebaseio.com/songs.json',
          type: "POST",
          data: JSON.stringify(songFormObj),
          dataType: 'JSON'
        }).done(function(songId) {
          resolve(songId);
        });
      });
    }

    function addSong(newSong) {
      return firebase.database().ref('songs').push(newSong);
    }

    function deleteSong(songId) {
      let songs = firebase.database().ref('songs');
      return songs.child(songId).remove();
    }

    function getSong(songId) {
      let songs = firebase.database().ref('songs');
      return songs.child(songId).once('value', function(song) {
        return song;
      });
    }

    function editSong(songFormObj, songId) {
      let songs = firebase.database().ref('songs');
      return songs.child(songId).update(songFormObj);
    }

    module.exports = {
      getSongs,
      getSongsAjax,
      addSong,
      getSong,
      deleteSong,
      editSong
    };


    // remove once update
// ****************************************
// DB interaction using Firebase REST API
// ****************************************

//
//
// function deleteSong(songId) {
//   return new Promise(function(resolve, reject) {
//     $.ajax({
//       url: `https://music-history-7af37.firebaseio.com/song/${songId}.json`,
//       type: 'DELETE'
//     }).done(function() {
//       resolve();
//     });
//   });
// }
//
// function getSong(songId) {
//   return new Promise(function(resolve, reject) {
//     console.log(songId);
//     $.ajax({
//       url: `https://music-history-7af37.firebaseio.com/song/${songId}.json`
//     })
//     .done(function(songData) {
//       resolve(songData);
//     });
//   });
// }
//
// function editSong(songFormObj, songId) {
//   return new Promise(function(resolve, reject) {
//     $.ajax({
//       url: `https://music-history-7af37.firebaseio.com/song/${songId}.json`,
//       type: 'PUT',
//       data: JSON.stringify(songFormObj)
//     }).done(function(data) {
//       resolve(data);
//     });
//   });
// }
//
// module.exports = {
//   getSongs,
//   addSong,
//   getSong,
//   deleteSong,
//   editSong
// };
//
