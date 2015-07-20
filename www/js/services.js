angular.module('txlf.services', ['ngCordova'])

.factory('rssParse', function($scope, $timeout) {
    //get the rss feed.
})

.factory('Login', function($scope, $ionicModal, $timeout) {
})

.factory('DataMan', function($timeout, $cordovaClipboard) {

    var self = this;

    self.copyText = function(value) {
        $cordovaClipboard.copy(value).then(function(){
            console.log('Copied.');
        }, function(err) {
            console.error('There was an error: ' + err);
        });
    }
    return self;
}); 
