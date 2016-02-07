var blockerCount = 0;
var timerEps = 55;
var t1 = (new Date()).getTime() - timerEps;

function canBlock() {
    if (blockerCount > 15)
        return ((new Date()).getTime() - t1) > timerEps;
    return true;
}

jQuery(document).blocker().ready(function () {
    t1 -= timerEps;
    jQuery(this).blocker().bind("DOMSubtreeModified", function () {
        jQuery(this).blocker();
    });
});