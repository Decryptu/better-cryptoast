chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "checkCookie") {
        chrome.cookies.get({
            url: "https://cryptoast.fr",
            name: "wordpress_logged_in_f53c97261c8262956e237a76547fdff1" // We check for specific username to apply our easter egg
        }, function(cookie) {
            if (cookie) {
                sendResponse({ success: true, cookieValue: cookie.value });
            } else {
                sendResponse({ success: false });
            }
        });
        return true; // Keeps the message channel open for asynchronous response
    }
});
