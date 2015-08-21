angular.module("txlf.services", ["ngCordova", "ab-base64"])

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

.factory("Share", function($cordovaSocialSharing, Popup, Toast, Localdb, DataMan, base64) {

    "use strict";
    var self = this;

    self.convContactCSVcsv = function(data){
        var result = "";
        for(var i = 0; i < data.length; i++) {
            result += data[i].data + "\n";
        }
        return result;
    };
    self.convContactCSV = function(data){
        var result = "id,name,workphone,mobile,email,website,title,company,address\n";
        for(var i = 0; i < data.length; i++) {
            result += data[i].clid + "," + data[i].name + "," + data[i].workphone + "," + data[i].mobile + "," + data[i].email + "," + data[i].website + "," + data[i].title + "," + data[i].company + "," + data[i].address + "\n";
        }
        return result;
    };


    self.shareContactscsv = function(){
       Popup.confirmPop("are you sure you wish to share your contact list?")
           .then(function(res){
               if(res){
                   DataMan.fetchContactListcsv();
                   var csvContactcsv = "data:text/csv;base64," + base64.encode(self.convContactCSVcsv(DataMan.contactListcsv));
                   console.log("ok button for contact share pushed");
                   //var message = self.convContactCSV(DataMan.contactList);
                   var message = "Thanks for coming to Texas Linux Fest 2015!\nWe hope to see you next year.";
                   var subject = "Contact List from TXLF 2015";
                   var to = null;
                   var cc = null;
                   var bcc = null;
                   var file = csvContactcsv;
                   var link = null;
                   $cordovaSocialSharing.shareViaEmail(message, subject, to, cc, bcc, file, link, function() {
                           Toast.showToast("content has been shared.", "short", "bottom");
                       }, function() {
                           Toast.showToast("error: contact could not be shared.", "short", "bottom");
                       });
               } else {
                   Toast.showToast("cancelled.", "short", "bottom");
               }
           });

    };
    self.shareContacts = function(){
       Popup.confirmPop("are you sure you wish to share your contact list?")
           .then(function(res){
               if(res){
                   DataMan.fetchContactList();
                   var csvContact = "data:text/csv;" + self.convContactCSV(DataMan.contactList);
                   console.log("ok button for contact share pushed");
                   //var message = self.convContactCSV(DataMan.contactList);
                   var message = "Thanks for coming to Texas Linux Fest 2015!\n We hope to see you next year.";
                   var subject = "Contact List from TXLF 2015";
                   var to = null;
                   var cc = null;
                   var bcc = null;
                   var file = csvContact;
                   var link = null;
                   $cordovaSocialSharing.shareViaEmail(message, subject, to, cc, bcc, file, link, function() {
                           Toast.showToast("content has been shared.", "short", "bottom");
                       }, function() {
                           Toast.showToast("error: contact could not be shared.", "short", "bottom");
                       });
               } else {
                   Toast.showToast("cancelled.", "short", "bottom");
               }
           });

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

    self.scanQRcsv = function() {
        $cordovaBarcodeScanner.scan().then(function(QRData){
            var pData = QRData.text;
            Popup.confirmPop("Contact", pData + "\n Save contact?")
                .then(function(res){

                    if(res){
                        console.log("OK button for contact save pushed: " + pData);
                        DataMan.storeContactListcsv(pData);
                    } else {
                        Toast.showToast("Cancelled.", "short", "bottom");
                    }
                });

        }, function(error) {
            Popup.alertPop("Error\n", error);
        });
    };

    self.scanQR = function() {
        $cordovaBarcodeScanner.scan().then(function(QRData){
            var pData = JSON.parse(QRData.text);
            Popup.confirmPop("Contact", pData.n + "\n Save contact?")
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

.factory("DataMan", function(Localdb, Toast) {
    "use strict";

    var self = this;
    //self.contactList = [];
    self.contactListcsv = [];
    self.mySchedule = [];

    // Contact List methods
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

    self.storeContactListcsv = function(QRtext){

        console.log("DataMan: input Contact List called after this.");
        Localdb.inputContactListcsv(QRtext);
        self.fetchContactListcsv();
    };

    self.fetchContactListcsv = function(){
        Localdb.getContactListcsv().then(function(res){
            console.log("fetch result contactListcsv string: " + JSON.stringify(res));
            angular.copy(res, self.contactListcsv);
        }, function(err){
            console.log("fetchContactListcsv error: " + err);
        });
    };

    self.fetchContactList = function(){
        Localdb.getContactList().then(function(res){
            console.log("fetch result contactList string: " + JSON.stringify(res));
            angular.copy(res, self.contactList);
        }, function(err){
            console.log("fetchContactList error: " + err);
        });
    };

    // My Schedule methods.
    self.storeMySchedule = function(time, title, link, sorter, date){

        // Calling getBy(title) to check if there's a duplicate in the database
        Localdb.getBy("MySchedule", "title", "title", title).then(function(res){
            console.log("dupCheck res: " + JSON.stringify(res));
            if (JSON.stringify(res) !== undefined) {
                Toast.showToast("Presentation already in your schedule.", "short", "bottom");
            } else {
                Toast.showToast("Presentation stored.", "short", "bottom");
                Localdb.inputMySchedule(time, title, link, sorter, date).then(function(){
                    self.fetchMySchedule(date);
                }, function(err) {
                    Toast.showToast("Error: Presentation not stored.\n" + err, "short", "bottom");
                });
            }
        }, function(err){
            console.log("dupCheck err: " + err);
        });
    };

    self.delMySchedule = function(item){

        // Calling getBy(title) to check if there's a duplicate in the database
        Localdb.getBy("MySchedule", "msid", "msid", item.msid).then(function(res){
            console.log("getBy msid response: " + JSON.stringify(res));
            if (JSON.stringify(res) !== undefined) {
                Toast.showToast("Presentation removed from your schedule.", "short", "bottom");
                Localdb.deleteMSentry(item.msid).then(function(){
                    self.fetchMySchedule(item.date);
                }, function(err) {
                    console.log("delMySchedule error: " + err);
                });
            } else {
                    Toast.showToast("Error: Presentation not in your schedule.", "short", "bottom");
            }
        }, function(err){
            console.log("getBy(msid) err: " + err);
        });
    };

    self.fetchMySchedule = function(date){
       if (self.mySchedule[date] == undefined){
           self.mySchedule[date] = [];
       }
       Localdb.getListBy("MySchedule", "msid, date, title, link, sorter, time", "date", date).then(function(res){
           angular.copy(res, self.mySchedule[date]);
           console.log("getListBy: " + JSON.stringify(self.mySchedule.fri));
       });
//        Localdb.getMySchedule().then(function(res){
//            console.log("fetch result MySchedule string: " + JSON.stringify(res));
//            angular.copy(res, self.mySchedule);
//        }, function(err){
//            console.log("fetchMySchedule error: " + err);
//        });
    };



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
        return DBA.query("SELECT msid, time, title, link, sorter, date FROM MySchedule")
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

    self.getContactListcsv = function(){
        return DBA.query("SELECT clid, data FROM ContactListcsv")
            .then(function(result){
                return DBA.getAll(result);
            }, function(error){
                console.log(error);
            });
    };

    self.getListBy = function(table, query, key, value) {
            var parameters = [value];
                return DBA.query("SELECT " + query + " FROM " + table + " WHERE " + key + " = (?)", parameters)
                .then(function(result) {
                    return DBA.getAll(result);
                });
    };

    // Get single items.

    self.getBy = function(table, query, key, value) {
            var parameters = [value];
                return DBA.query("SELECT " + query + " FROM " + table + " WHERE " + key + " = (?)", parameters)
                .then(function(result) {
                    return DBA.getById(result);
                });
    };



   // Input into database
    self.inputMySchedule = function(time, title, link, sorter, date) {
        var parameters = [time, title, link, sorter, date];
        return DBA.query("INSERT INTO MySchedule (time, title, link, sorter, date) VALUES (?, ?, ?, ?, ?)", parameters);
    };

    self.inputContactListcsv = function(data) {
        var parameters = [data];
        console.log(data);
        return DBA.query("INSERT INTO ContactListcsv (data) VALUES (?)", parameters);
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
