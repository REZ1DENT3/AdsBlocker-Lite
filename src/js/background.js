chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.name == "setBadgeText") {
        chrome.browserAction.setBadgeText({text: request.text, tabId: sender.tab.id})
    }
});