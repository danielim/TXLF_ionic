angular.module("txlf.services", ["ngCordova"])

.factory("rssParse", function($scope) {
    //get the rss feed.
    "use strict";
})

.factory("Login", function($scope, $ionicModal) {
    "use strict";
})

.factory("Urlf", function($scope) {
    "use strict";
    var self = this;

    self.openUrl = function(urlString){
        var myURL = encodeURI(urlString);
        window.open(myURL, '_blank');
    };

    return self;
})

.factory("DataMan", function() {

    "use strict";
    var self = this;

/* //This is not working for some reason
 *  self.copyText = function(value) {
        $cordovaClipboard.copy(value).then(function(){
            console.log("Copied.");
        }, function(err) {
            console.error("There was an error: " + err);
        });
    }
*/
    return self;
})

.factory("QRscan", function($ionicPopup, $cordovaBarcodeScanner, $cordovaContacts) {

    "use strict";
    var self = this;
    var imageData = {};

    self.confirmPop = function(title, template){
         var cPop = $ionicPopup.confirm({
            title: title,
            template: template
        });
         cPop.then(function(res){
            if(res){
                self.createContact(self.imagedata);
            } else {
                console.log("cancelled.");
            }
         });
    };

    self.alertPop = function(title, template){
        $ionicPopup.alert({
            title: title,
            template: template
        });
    };

    self.scanQR = function() {
        $cordovaBarcodeScanner.scan().then(function(QRData){
            self.imageData = QRData;
            self.confirmPop("Contact Data", QRData.text + "\n \n Save contact to your device?");
        }, function(error) {
            self.alertPop("Error\n", error);
        });
    };

    self.createContact = function(contactData) {
        $cordovaContacts.save(contactData).then(function(result){
            self.alertPop("Contact Saved", "Contact: " + JSON.stringify(result) + " saved.");
        }, function(error) {
            self.alertPop("Error", error + "\n Contact was not saved.");
        });
    };





    return self;
})
.factory("Parser", function() {
    "use strict";
    var self = this;

 //   var xray = require("x-ray");
 //   var x = xray();

 //   var dataCoC = {};

 //   self.parseCoC = x("https://2015.texaslinuxfest.org/code-of-conduct", "div.section", [{
 //        header: "page-title",
 //        content: "div.field-item.even",
 //    }])(function(err, arr){
 //       "use strict";
 //       data = arr; })
 //   .write("cocJtxlf.json");

    return self;
});
