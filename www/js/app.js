// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('txlf', ['ionic', 'txlf.controllers', 'txlf.services', 'txlf.directives', 'ngCordova'])

.run(function($ionicPlatform) {
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
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: "/app",
    abstract: true,
    templateUrl: "templates/menu.html",
    controller: 'AppCtrl'
  })

  // general information about TXLF conference
  .state('app.geninfo', {
    url: "/geninfo",
    views: {
      'menuContent': {
        templateUrl: "templates/geninfo.html",
      }
    }
  })

  // News posted on the front page of Texaslinuxfest.org
  .state('app.news', {
    url: "/news",
    views: {
      'menuContent': {
        templateUrl: "templates/news.html"
      }
    }
  })

  // Schedule list for the conference, ability to add talks to user schedule (app.myschedule)
  .state('app.scheduleL', {
    url: "/scheduleL",
    views: {
      'menuContent': {
        templateUrl: "templates/scheduleL.html"
      }
    }
  })

  // Display user schedule, allow deletion of talks.
  .state('app.myschedule', {
    url: "/myschedule",
    views: {
      'menuContent': {
        templateUrl: "templates/myschedule.html"
      }
    }
  })

  // Display address and integrate google maps.
  .state('app.location', {
    url: "/location",
    views: {
      'menuContent': {
        templateUrl: "templates/location.html",
        controller: "LocationCtrl"
      }
    }
  })

  // Display an interior map of the venue.
  .state('app.indoorMap', {
    url: "/indoorMap",
    views: {
      'menuContent': {
        templateUrl: "templates/indoorMap.html"
      }
    }
  })

  // list speakers and their titles?
  .state('app.speakersL', {
    url: "/speakersL",
    views: {
      'menuContent': {
        templateUrl: "templates/speakersL.html",
      }
    }
  })

  // Display information about the speaker.
  .state('app.speaker', {
    url: "/speakersL/:speakerId",
    views: {
      'menuContent': {
        templateUrl: "templates/speaker.html",
      }
    }
  })

  // display TXLF twitter feed @texaslinuxfest.
  .state('app.twitter', {
    url: "/twitter",
    views: {
      'menuContent': {
        templateUrl: "templates/twitter.html",
      }
    }
  })

  // integrate IRC channel through sockjs. May need ZNC bouncer?
  .state('app.chatroom', {
    url: "/chatroom",
    views: {
      'menuContent': {
        templateUrl: "templates/chatroom.html",
      }
    }
  })

  // about the author of the app. A big fat hire me button.
  .state('app.about', {
    url: "/about",
    views: {
      'menuContent': {
        templateUrl: "templates/about.html",
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/geninfo');
});
