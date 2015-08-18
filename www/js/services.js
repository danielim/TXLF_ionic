angular.module("txlf.services", ["ngCordova"])

.factory("rssParse", function($scope) {
    //get the rss feed.
    "use strict";
})

.factory("Login", function($scope, $ionicModal) {
    "use strict";
})

.factory("Urlf", function() {
    "use strict";
    var self = this;

    self.openUrl = function(urlString){
        var options = "location=yes, hardwareback=no, clearcache=yes";

        if(urlString !== "") {
            var myURL = encodeURI(urlString);
            window.open(myURL, "_blank", options);
        } else {
            return null;
        }
    };

    return self;
})

.factory("Share", function($cordovaSocialSharing, Popup) {

    "use strict";
    var self = this;

    self.onShare = function(message, subject, file, link) {

            Popup.alertPop("Error", " Contact was not saved.");
            $cordovaSocialSharing.share(message, subject, file, link)
            .then(function(res) {
                    return res;
                }, function(err) {
                    return err;
                }
            );

    };

    return self;
})

.factory("Popup", function(Toast, $ionicPopup) {

    "use strict";
    var self = this;

    self.confirmPop = function(title, template){
         var cPop = $ionicPopup.confirm({
            title: title,
            template: template
         });
         return cPop;
    };

    self.alertPop = function(title, template){
        $ionicPopup.alert({
            title: title,
            template: template
        });
    };

    return self;
})

.factory("Toast", function($cordovaToast) {

    "use strict";
    var self = this;
    // message: string
    // duraction: long=5s; short=2s
    // location: top; center; bottom
    self.showToast = function(message, duration, location) {
       $cordovaToast.show(message, duration, location).then(function(success) {
           console.log("The toast was shown");
       }, function (error) {
           console.log("The toast was not shown due to " + error);
       });
    };
    return self;
})

.factory("QRscan", function(DataMan, Toast, Popup, $cordovaBarcodeScanner, $cordovaContacts) {

    "use strict";
    var self = this;

    self.scanQR = function() {
        $cordovaBarcodeScanner.scan().then(function(QRData){
            Popup.confirmPop("Contact Data", QRData.text + "\n Save contact?")
                .then(function(res){
                    if(res){
                        console.log("OK button for contact save pushed");
                        DataMan.storeContactList(QRData.text);
                    } else {
                        Toast.showToast("Cancelled.", "short", "bottom");
                    }
                });

        }, function(error) {
            Popup.alertPop("Error\n", error);
        });
    };

    // need contactData to be device specific or it won"t work.
    self.createContact = function(contactData) {
        $cordovaContacts.save(contactData).then(function(result){
            Popup.alertPop("Contact Saved", "Contact: " + JSON.stringify(result) + " saved.");
        }, function(error) {
            Popup.alertPop("Error", error + "\n Contact was not saved.");
        });
    };





    return self;
})

.factory("DataMan", function(Localdb) {
    "use strict";

    var self = this;
    self.contactList = [];

    self.storeContactList = function(QRtext){
        var json = JSON.parse(QRtext);
        var name = json.n;
        var workphone = json.pw;
        var mobile = json.pm;
        var website = json.www;
        var title = json.t;
        var email = json.e;
        var company = json.c;
        var address = json.adr;

        console.log("DataMan: input Contact List called after this.");
        Localdb.inputContactList(name, workphone, mobile, email, website, title, company, address);
        self.fetchContactList();
    };

    self.fetchContactList = function(){
        Localdb.getContactList().then(function(res){
            console.log("fetch result contactList string: " + JSON.stringify(res));
            angular.copy(res, self.contactList);
        }, function(err){
            console.log("fetchContactList error: " + err);
        });
    };
    console.log("self.contactlist dataman scope: " + self.contactList);
    console.log("JSON stringify self.contactList DataMan: " + JSON.stringify(self.contactList));

/* //This is not working inside the factory for some reason
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

// database
.factory("DBA", function($cordovaSQLite, $q, $ionicPlatform){
"use strict";
    var self = this;

    //handle queries and potential errors.
    self.query = function(query, parameters) {
        parameters = parameters || [];
        var q = $q.defer();

        $ionicPlatform.ready(function(){
            $cordovaSQLite.execute(db, query, parameters)
                .then(function(result){
                    q.resolve(result);
                }, function(error){
                    console.warn("DBA error: " + error.message);
                    q.reject("DBA reject: " + error.message);
                });
        });

        return q.promise;
    };

    // process a list of results.
    // output is an array

    self.getAll = function(result) {
        var output = [];

        for(var i = 0; i < result.rows.length; i++) {
            output.push(result.rows.item(i));
        }
        return output;
    };

    // process a single result (search for specific id)
    // output is a string

    self.getById = function(result) {
        var output = null;
        output = angular.copy(result.rows.item(0));
        return output;
    };

    return self;
})
.factory("Localdb", function($cordovaSQLite, DBA){
"use strict";
    var self = this;

    // Get data from database
    self.getMySchedule = function(){
        return DBA.query("SELECT msid, title, link FROM MySchedule")
            .then(function(result){
                return DBA.getAll(result);
            });
    };

    self.getContactList = function(){
        return DBA.query("SELECT clid, name, workphone, mobile, email, website, title, company, address FROM ContactList")
            .then(function(result){
                return DBA.getAll(result);
            }, function(error){
                console.log(error);
            });
    };
    self.getEVERYTHING = function(){
        return DBA.query("SELECT * FROM ContactList")
            .then(function(result){
                return DBA.getAll(result);
            }, function(error){
                console.log(error);
            });
    };

   // Input into database
    self.inputMySchedule = function(title, link) {
        var parameters = [title, link];
        return DBA.query("INSERT INTO MySchedule (title, link) VALUES (?, ?)", parameters);
    };

    self.inputContactList = function(name, workphone, mobile, email, website, title, company, address) {
        var parameters = [name, workphone, mobile, email, website, title, company, address];
        return DBA.query("INSERT INTO ContactList (name, workphone, mobile, email, website, title, company, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", parameters);
    };

    self.inputWebCache = function(link, data) {
        var parameters = [link, data];
        return DBA.query("INSERT INTO WebCache (link, data) VALUES (?, ?)", parameters);
    };

    // Remove entries in database

    self.deleteMSentry = function(msid) {
        var parameters = [msid];
        return DBA.query("DELETE FROM MySchedule WHERE msid = (?)", parameters);
    };

    self.deleteCLentry = function(clid) {
        var parameters = [clid];
        return DBA.query("DELETE FROM ContactList WHERE clid = (?)", parameters);
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
