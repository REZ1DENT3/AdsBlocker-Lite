function monitorBlocks() {
    window.addEventListener("message", function receiveMessage(event) {
        if (event.data.type && (event.data.type == "blockedWindow")) {
            blockerRulesCount++;
            chrome.runtime.sendMessage({
                name: "trackEvent",
                action: "PopupBlocked",
                label: hostname
            });
        }
    }, false);
}

addScript({textContent: inject.toString() + " inject()"});
monitorBlocks();