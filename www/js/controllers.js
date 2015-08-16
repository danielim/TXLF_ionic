angular.module("txlf.controllers", ["ionic", "txlf.services", "txlf.directives", "ngCordova"])

.controller("AppCtrl", function($scope, $ionicModal, $timeout, Urlf) {
    "use strict";
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on("$ionicView.enter", function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl("templates/login.html", {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log("Doing login", $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };


  // custom services/factories

    $scope.openUrl = function(myURL) {
        Urlf.openUrl(myURL);
    };

})

.controller("LocationCtrl", function($scope, DataMan, $cordovaClipboard) {
    "use strict";
    $scope.mapLink = "";

    $scope.copyText = function(value){
                        $cordovaClipboard.copy(value).then(function(){
                            console.log("success");
                        }, function(err){
                            console.log(err);
                        });
    };

    $scope.geoLink = function(){
                        var isAndroid = ionic.Platform.isAndroid();
                        console.log(isAndroid);
                        if(isAndroid){
                           $scope.mapLink = "geo:0,0?q=1001+E+McCarty+Ln,+San+Marcos,+TX+78666";
                        } else {
                           $scope.mapLink = "http://maps.apple.com/?q=1001+E+McCarty+Ln,+San+Marcos,+TX+78666";
                        }
    };

})

.controller("SchedCtrl", function($scope, $http) {
    "use strict";

    $http.get("json/unnestSchedFri.json").success(function(data) {
        $scope.schedFri = data;
    });
    $http.get("json/unnestSchedSat.json").success(function(data) {
        $scope.schedSat = data;
    });

    $scope.schedClass = function(key){
       if(key === "time"){
          return "item item-divider";
       }else if(key === "link"){
          return "ng-hide";
       } else {
          return "item item-text-wrap";
       }
    };

})

.controller("BarcodeCtrl", function($scope, QRscan) {
    "use strict";
    $scope.imageData = QRscan.imageData;
    $scope.contactData = QRscan.contactData;

    $scope.scanBarcode = function(){
        QRscan.scanQR();
    };

})

.controller("DisplayCtrl", function($scope, Parser) {
    "use strict";
    $scope.dataCoC = Parser.dataCoC;



});
