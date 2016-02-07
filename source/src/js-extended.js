Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};

String.prototype.getHostname = function () {
    var l = document.createElement("a");
    l.href = this;
    if (l.hostname.substr(0, 4) == 'www.') {
        l.hostname = l.hostname.substr(4);
    }
    return l.hostname;
};