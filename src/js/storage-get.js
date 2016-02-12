chrome.storage.local.get(storageParameters, function (items) {

    rules = [];
    rulesExpr = [];
    _rules = [];

    if (typeof items.rulesData.findKey != 'undefined') {
        _rules = items.rulesData.findKey(hostname);
    }

    if (typeof items.rulesData[ConstAllSite] != 'undefined') {
        _rules = _rules.concat(items.rulesData[ConstAllSite]);
    }

    if (typeof items.rulesData['^' + hostname] != 'undefined') {
        _rules = _rules.diff(items.rulesData['not:' + hostname]);
    }

    for (var i = 0; i < _rules.length; ++i) {
        var isExpr = false;
        for (var expr in jsExtended.expr) {
            if (isExpr || typeof expr == "undefined") break;
            regex = new RegExp(expr + '(.*?)$');
            isExpr = regex.test(_rules[i]);
        }
        if (isExpr) {
            rulesExpr.push(_rules[i]);
        }
        else {
            rules.push(_rules[i]);
        }
    }

    isNotWhitelist = items.whitelisted.indexOf(hostname) < 0;

    blocker(document);
    document.addEventListener('DOMSubtreeModified', function (mutationEvent) {
        blocker(mutationEvent.target);
    }, false);

});