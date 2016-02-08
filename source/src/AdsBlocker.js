var blockerCount = 0;
var blockerRulesCount = 0;
var timerEps = 5;
var t1 = (new Date()).getTime() - timerEps;

var hostname = location.href.getHostname();

var rules = new Array();
var rulesRegExp = new Array();

var isNotWhitelist = true;

const ConstAllSite = '\\AllSite\\';

function canBlock() {
    if (blockerCount > 15)
        return ((new Date()).getTime() - t1) > timerEps;
    return true;
}