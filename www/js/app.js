// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// "starter" is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of "requires"
// "starter.controllers" is found in controllers.js
var db = null;
angular.module("txlf", ["ionic", "txlf.controllers", "txlf.services", "txlf.directives", "ngCordova", "angular.filter"])

.run(function($ionicPlatform, $timeout, $cordovaSQLite) {
"use strict";

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

    // On device ready, load cordova.plugins.inappbrowser.
    window.open = cordova.InAppBrowser.open;

    //#######
    // Database creation and opening.
    //#######
    if (window.cordova) {
        db = $cordovaSQLite.openDB("txlf.db");
    } else {
        db = window.openDatabase("txlf.db", "1.0", "TXLF", -1);
    }

    var dbMySchedule = "CREATE TABLE IF NOT EXISTS MySchedule (" +
                   "msid INTEGER PRIMARY KEY, " +
                   "date TEXT, " +
                   "time TEXT, " +
                   "title TEXT, " +
                   "sorter TEXT, " +
                   "link TEXT" +
                   ")";

    var dbContactList = "CREATE TABLE IF NOT EXISTS ContactList (" +
                 "clid INTEGER PRIMARY KEY, " +
                 "name TEXT, " +
                 "workphone TEXT, " +
                 "mobile TEXT, " +
                 "email TEXT, " +
                 "website TEXT, " +
                 "title TEXT, " +
                 "company TEXT, " +
                 "address TEXT" +
                 ")";

    var dbWebCache = "CREATE TABLE IF NOT EXISTS WebCache (" +
                   "wid INTEGER PRIMARY KEY, " +
                   "link TEXT, " +
                   "data TEXT" +
                   ")";

    // WARNING: TESTING ONLY, WILL DROP TABLE EVERY TIME.
    var dropAllTables = function(){
        $cordovaSQLite.execute( db, "DROP TABLE IF EXISTS MySchedule")
        .then(
            function(success){
             console.log(success);
             console.log("MySchedule tables dropped");
            },
            function(fail){
             console.log(fail);
             console.log("MySchedule tables not dropped");
            }
        );
    $cordovaSQLite.execute( db, "DROP TABLE IF EXISTS ContactList")
        .then(
            function(success){
             console.log(success);
             console.log("ContactList tables dropped");
            },
            function(fail){
             console.log(fail);
             console.log("ContactList tables not dropped");
            }
        );
    $cordovaSQLite.execute( db, "DROP TABLE IF EXISTS WebCache")
        .then(
            function(success){
             console.log(success);
             console.log("WebCache tables dropped");
            },
            function(fail){
             console.log(fail);
             console.log("WebCache tables not dropped");
            }
        );
    };

    // create tables for the database if they don't exist
    var createTables = function(){
            $cordovaSQLite.execute( db, dbMySchedule ).then(console.log(dbMySchedule), function(error){console.log(error)});

            $cordovaSQLite.execute( db, dbContactList ).then(console.log(dbContactList), function(error){console.log(error)});

            $cordovaSQLite.execute( db, dbWebCache ).then(console.log("WebCache table created"), function(error){console.log(error)});
    };

    dropAllTables();
    createTables();

  });
})

.config(function ($compileProvider) {
    "use strict";
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|http|ftp|mailto|file|tel|geo):/);
})

.config(function($stateProvider, $urlRouterProvider) {
    "use strict";

  $stateProvider

  .state("app", {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: "AppCtrl"
  })

  // general information about TXLF conference
  .state("app.geninfo", {
    url: "/geninfo",
    views: {
      "menuContent": {
        templateUrl: "templates/geninfo.html"
      }
    }
  })

  // Code of Conduct for Texaslinuxfest.org
  .state("app.coc", {
    url: "/coc",
    controller: "DisplayCtrl",
    views: {
      "menuContent": {
        templateUrl: "templates/coc.html"
      }
    }
  })

  // News posted on the front page of Texaslinuxfest.org
  .state("app.news", {
    url: "/news",
    views: {
      "menuContent": {
        templateUrl: "templates/news.html"
      }
    }
  })

  // Schedule list for the conference, ability to add talks to user schedule (app.myschedule)
  .state("app.scheduleL", {
    url: "/scheduleL",
    views: {
      "menuContent": {
        templateUrl: "templates/scheduleL.html"
      }
    }
  })

  // Display user schedule, allow deletion of talks.
  .state("app.myschedule", {
    url: "/myschedule",
    views: {
      "menuContent": {
        templateUrl: "templates/myschedule.html"
      }
    }
  })

  // Display address and integrate google maps.
  .state("app.location", {
    url: "/location",
    views: {
      "menuContent": {
        templateUrl: "templates/location.html",
        controller: "LocationCtrl"
      }
    }
  })

  // Display an interior map of the venue.
  .state("app.indoorMap", {
    url: "/indoorMap",
    views: {
      "menuContent": {
        templateUrl: "templates/indoorMap.html"
      }
    }
  })

  // list speakers and their titles?
  .state("app.speakersL", {
    url: "/speakersL",
    views: {
      "menuContent": {
        templateUrl: "templates/speakersL.html"
      }
    }
  })

  // Display information about the speaker.
  .state("app.speaker", {
    url: "/speakersL/:speakerId",
    views: {
      "menuContent": {
        templateUrl: "templates/speaker.html"
      }
    }
  })

  // display TXLF twitter feed @texaslinuxfest.
  .state("app.twitter", {
    url: "/twitter",
    views: {
      "menuContent": {
        templateUrl: "templates/twitter.html"
      }
    }
  })

  // QR Code scanner for members to add contacts
  .state("app.bcscan", {
    url: "/bcscan",
    views: {
      "menuContent": {
        templateUrl: "templates/bcscan.html"
      }
    }
  })
  // integrate IRC channel through sockjs. May need ZNC bouncer?
  .state("app.chatroom", {
    url: "/chatroom",
    views: {
      "menuContent": {
        templateUrl: "templates/chatroom.html"
      }
    }
  })

  // about the author of the app. A big fat hire me button.
  .state("app.about", {
    url: "/about",
    views: {
      "menuContent": {
        templateUrl: "templates/about.html"
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise("/app/geninfo");
});
