var blockerCount = 0;
var blockerRulesCount = 0;
var timerEps = 5;
var t1 = (new Date()).getTime() - timerEps;

var hostname = window.document.domain;
if (hostname.substr(0, 4) == 'www.') {
    hostname = hostname.substr(4);
}

var rules = new Array();

var isNotWhitelist = true;

const ConstAllSite = '___AllSite___';

function canBlock() {
    if (blockerCount > 15)
        return ((new Date()).getTime() - t1) > timerEps;
    return true;
}

function adsBlock(e) {
    $.each(e, function(ind, _e) {
        _e.parentNode.removeChild(_e);
    });
}

function blocker() {

    blockerCount++;
    if (!isNotWhitelist || !canBlock()) {
        return this;
    }

    t1 = (new Date()).getTime();
    if (blockerCount > 30 && timerEps < 300) {
        timerEps++;
    }

    if (rules.length) {

        qsRules = document.querySelectorAll(rules.join(', '));
        blockerRulesCount += qsRules.length;
        if (qsRules.length) {

            adsBlock(qsRules);

            if (blockerRulesCount) {
                chrome.runtime.sendMessage({
                    name: "setBadgeText",
                    text: '' + blockerRulesCount
                });
            }

            $.each(qsRules, function (ind, item) {
                if (item.addEventListener) {
                    item.addEventListener ('DOMSubtreeModified', function () {
                        adsBlock(qsRules);
                    }, false);
                }
            });

        }
    }

    return this;

}