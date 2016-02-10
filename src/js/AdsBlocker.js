var blockerRulesCount = 0;

var hostname = window.document.domain;
if (hostname.substr(0, 4) == 'www.') {
    hostname = hostname.substr(4);
}

var rules = new Array();
var rulesExpr = new Array();

var isNotWhitelist = true;

const ConstAllSite = '___AllSite___';

function adsBlock(e) {
    for (ind = 0; ind < e.length; ++ind) {
        if (typeof e[ind].parentNode != "undefined" && e[ind].parentNode != null) {
            if (typeof e[ind].parentNode.removeChild != "undefined") {
                e[ind].parentNode.removeChild(e[ind]);
            }
        }
    }
}

function blocker(d) {

    if (!isNotWhitelist) {
        return this;
    }

    if (rules.length) {
        qsRules = querySelectorAll(d, rules.join(', '));
        blockerRulesCount += qsRules.length;
        if (qsRules.length) {
            adsBlock(qsRules);
        }
    }

    if (rulesExpr.length) {
        for (i = 0; i < rulesExpr.length; ++i) {
            qsRulesExpr = querySelectorAll(d, rulesExpr[i]);
            blockerRulesCount += qsRulesExpr.length;
            if (qsRulesExpr.length) {
                adsBlock(qsRulesExpr);
            }
        }
    }

    if (blockerRulesCount) {
        chrome.runtime.sendMessage({
            name: "setBadgeText",
            text: '' + blockerRulesCount
        });
    }

    return this;
}