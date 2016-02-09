chrome.storage.local.get({
    rulesData: [],
    whitelisted: []
}, function (items) {

    rules = [];
    _rules = [];

    if (typeof items.rulesData.findKey != 'undefined') {
        _rules = items.rulesData.findKey(hostname);
    }

    if (typeof items.rulesData[ConstAllSite] != 'undefined') {
        _rules = _rules.concat(items.rulesData[ConstAllSite]);
    }

    if (typeof items.rulesData['^' + hostname] != 'undefined') {
        _rules = _rules.diff(items.rulesData['^' + hostname]);
    }

    jQuery.each(_rules, function (_key) {
        rules.push(_rules[_key]);
    });

    isNotWhitelist = items.whitelisted.indexOf(hostname) < 0;

    t1 = 0;
    blocker();
    jQuery(document).ready(function () {
        t1 = 0;
        blocker();
        document.addEventListener ('DOMSubtreeModified', function () {
            blocker();
        }, false);
    });

});