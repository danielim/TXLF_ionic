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

.controller("LocationCtrl", function($scope, DataMan, $cordovaClipboard, Toast) {
    "use strict";
    $scope.mapLink = "";

    $scope.copyText = function(value){
                        $cordovaClipboard.copy(value).then(function(){
                            Toast.showToast("Address copied to your Clipboard.", "short", "bottom");
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

.controller("SchedCtrl", function($filter, $scope, $http, DataMan) {
    "use strict";

    $scope.MyScheduleFri = DataMan.mySchedule.fri;
    $scope.MyScheduleSat = DataMan.mySchedule.sat;

    $http.get("https://danielim.github.io/TXLF_ionic/prettyFri.json", {timeout: 2000}).then(function(data) {
        $scope.schedFri = data.data;
        console.log("prettyFri from gh-pages");
    }, function() {
        $http.get("json/prettyFri.json").success(function(data) {
            $scope.schedFri = data;
        });
    });

    $http.get("https://danielim.github.io/TXLF_ionic/prettySat.json", {timeout: 2000}).then(function(data) {
        $scope.schedSat = data.data;
        console.log("prettySat from gh-pages");
    }, function() {
        $http.get("json/prettySat.json").success(function(data) {
            $scope.schedSat = data;
        });
    });

    $scope.getTime = function(time) {
        $scope.schedTime = time;
    };

    $scope.min = function(arr) {
        return $filter('min')
        ($filter('map')(arr, 'sorter'));
    };

    $scope.addMySched = function(item, date){

        console.log("addMySched: " + date);
        DataMan.storeMySchedule(item.time, item.title, item.link, item.sorter, date);
        console.log(item.time + item.date + item.title + item.sorter + date);
    };

    $scope.delMySched = function(item){

        console.log("delMySched: " );
        DataMan.delMySchedule(item);
    };


})

.controller("BarcodeCtrl", function($scope, QRscan, DataMan, Share) {
    "use strict";

    $scope.scanBarcodecsv = function(){
        QRscan.scanQRcsv();
    };

    $scope.scanBarcode = function(){
        QRscan.scanQR();
    };

    $scope.shareContactscsv = function(){
        Share.shareContactscsv();
    };
    $scope.shareContacts = function(){
        Share.shareContacts();
    };

    $scope.ContactListcsv = DataMan.contactListcsv;
    $scope.ContactListJSON = DataMan.contactList;
    $scope.ContactList = JSON.stringify(DataMan.contactList);



})

.controller("DisplayCtrl", function($scope, Parser) {
    "use strict";
    $scope.dataCoC = Parser.dataCoC;



});
