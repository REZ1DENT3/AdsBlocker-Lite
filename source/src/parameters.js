var hostname = location.href.getHostname();

var rules = new Array();
var rulesRegExp = new Array();

var isNotWhitelist = true;

const ConstAllSite = '\\AllSite\\';

if (typeof chrome.tabs != 'undefined') {
    chrome.tabs.query({}, function (tabs) {
        for (i = 0; i < tabs.length; ++i) {
            if (tabs[i].active) {
                if (typeof tabs[i].url.getHostname == 'function') {
                    hostname = tabs[i].url.getHostname();
                }
                break;
            }
        }
    });
}