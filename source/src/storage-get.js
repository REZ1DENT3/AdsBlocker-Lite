function reloadRules(items) {

    rules = [];
    _rules = [];

    if (typeof items.rulesData[hostname] != 'undefined') {
        _rules = items.rulesData[hostname];
    }

    if (typeof items.rulesData[ConstAllSite] != 'undefined') {
        _rules = _rules.concat(items.rulesData[ConstAllSite]);
    }

    if (typeof items.rulesData['^' + hostname] != 'undefined') {
        _rules = _rules.diff(items.rulesData['^' + hostname]);
    }

    jQuery.each(_rules, function (_key) {
        if (_rules[_key].regExp) {
            // rulesRegExp = [];
        }
        else {
            rules.push(_rules[_key].rule);
        }
    });

    isNotWhitelist = items.whitelisted.indexOf(hostname) < 0;

    if (typeof chrome.browserAction == 'undefined') {
        jQuery(document).blocker(function () {
            jQuery(document).ready(function () {
                t1 = 0;
                jQuery(document).bind("DOMSubtreeModified", function () {
                    jQuery(document).blocker();
                });
            });
        });
    }

}

chrome.storage.sync.get({
    rulesData: [],
    whitelisted: []
}, function (items) {

    reloadRules(items);

    if (typeof chrome.tabs != 'undefined') {
        chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {

            hostname = tab.url.getHostname();
            reloadRules(items);

            var text = '';
            if (isNotWhitelist) {
                text += rules.length;
            }

            chrome.browserAction.setBadgeText({
                text: text,
                tabId: tabId
            });
        });
    }

});