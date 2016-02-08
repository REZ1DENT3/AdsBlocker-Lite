chrome.storage.local.get({
    rulesData: [],
    whitelisted: []
}, function (items) {

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
        if (_rules[_key].indexOf('|>>|') >= 0) {
            rulesFunc.push({
                rule: _rules[_key].substr(0, _rules[_key].indexOf('|>>|')),
                exec: _rules[_key].substr(_rules[_key].indexOf('|>>|') + 4)
            });
        }
        else {
            rules.push(_rules[_key]);
        }
    });

    isNotWhitelist = items.whitelisted.indexOf(hostname) < 0;

    t1 = 0;
    jQuery(document).blocker();
    jQuery(document).ready(function () {
        t1 = 0;
        jQuery(document).bind("DOMSubtreeModified", function () {
            jQuery(document).blocker();
        });
    });

});