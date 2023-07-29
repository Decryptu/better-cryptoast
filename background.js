chrome.webRequest.onBeforeRequest.addListener(
    function(details) {
        return {cancel: true};
    },
    {urls: [
        "*://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/1.0.10/cookieconsent.min.js",
        "*://cdn.onesignal.com/sdks/OneSignalSDK.js",
        "*://cryptoast.fr/wp-content/plugins/page-links-to/dist/new-tab.js"
    ]},
    ["blocking"]
);
