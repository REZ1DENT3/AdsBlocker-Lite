String.prototype.getHostname = function () {
    var l = document.createElement("a");
    l.href = this;
    if (l.hostname.substr(0, 4) == 'www.') {
        l.hostname = l.hostname.substr(4);
    }
    return l.hostname;
};

var blockerCount = 0;
var blockerRulesCount = 0;
var timerEps = 5;
var t1 = (new Date()).getTime() - timerEps;

var hostname = location.href.getHostname();

var rules = new Array();
var rulesFunc = new Array();

var isNotWhitelist = true;

const ConstAllSite = '___AllSite___';

function canBlock() {
    if (blockerCount > 15)
        return ((new Date()).getTime() - t1) > timerEps;
    return true;
}