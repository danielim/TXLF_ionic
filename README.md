#Texas Linux Fest app built with ionic.

The app currently can compile but with some missing features.
It isn't optimized yet.

##To install:

Clone the repository to your working directory:
```
git clone https://github.com/danielim/TXLF_ionic
```
Dependencies: node, bower, cordova

Install dependencies:
```
npm install && bower install
```

Cordova Plugins:
```
com.verso.cordova.clipboard 0.1.0 "Clipboard"
cordova-plugin-contacts 1.1.0 "Contacts"
cordova-plugin-crosswalk-webview 1.2.0 "Crosswalk WebView Engine"
cordova-plugin-inappbrowser 1.0.1 "InAppBrowser"
cordova-plugin-splashscreen 2.1.0 "Splashscreen"
cordova-plugin-whitelist 1.0.0 "Whitelist"
io.litehelpers.cordova.sqlite 0.7.10 "Cordova sqlite storage plugin"
nl.x-services.plugins.socialsharing 4.3.19 "SocialSharing"
nl.x-services.plugins.toast 2.1.1 "Toast"
phonegap-plugin-barcodescanner 4.0.1 "BarcodeScanner"
```

run `cordova plugin add <first column of the list above>`

Run:

```
ionic serve # Test on browser
ionic serve --labs # Test on browser emulating device size
ionic run android # Test on android device or emulation if no device found
```
