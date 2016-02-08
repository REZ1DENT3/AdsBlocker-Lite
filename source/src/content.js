(function () {
    function monitorBlocks() {
        window.addEventListener("message", function receiveMessage(event) {
            if (event.data.type && (event.data.type == "blockedWindow")) {
                chrome.runtime.sendMessage({
                    name: "trackEvent",
                    action: "PopupBlocked",
                    label: window.location.hostname
                });
            }
        }, false);
    }

    addScript({textContent: inject.toString() + " inject()"});
    monitorBlocks();
}());
