var config = {
  apiKey: "AIzaSyAQOKQsSUEgI7PhQ-kiRWtSsT-LNfrMqE4",
  authDomain: "lovermobile-888f8.firebaseapp.com",
  databaseURL: "https://lovermobile-888f8.firebaseio.com",
  storageBucket: "lovermobile-888f8.appspot.com"
};
firebase.initializeApp(config);

var app = angular.module('starter', ['ionic', 'firebase', 'ionic.contrib.ui.tinderCards'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.constant('FURL', 'https://lovermobile.firebaseio.com/')

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'AuthCtrl as auth'
  })

  .state('app.profile', {
    url: '/profile',
    views: {
      'menuContent': {
        templateUrl: 'templates/profile.html',
        controller: 'ProfileCtrl as prof',
        resolve: {
          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login');
            });
          },

          profile: function(Auth) {
            return Auth.requireAuth().then(function(auth) {
              return Auth.getProfile(auth.uid).$loaded();
            });
          },

          about: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth) {
                return Auth.getAbout(auth.facebook.accessToken);
              })
              .then(function(object) {
                return object.data.bio;
              });
          },

          images: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth) {
                return Auth.getImages(auth.facebook.accessToken);
              })
              .then(function(object) {
                return object.data.data;
              });
          }
        }
      }
    }
  })

  .state('app.home', {
    url: '/home',
    views: {
      'menuContent': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl as home',
        resolve: {
          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login');
            });
          },

          uid: function(Auth) {
            return Auth.requireAuth()
              .then(function(auth) {
                return auth.uid;
              });
          }
        }
      }
    }
  })

  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'SettingCtrl as sett',
        resolve: {
          auth: function($state, Auth) {
            return Auth.requireAuth().catch(function() {
              $state.go('login');
            });
          }
        }
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/login');
});
