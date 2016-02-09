Array.prototype.diff = function (a) {
    return this.filter(function (i) {
        return a.indexOf(i) < 0;
    });
};

Array.prototype.unique = function () {
    var ko = {};
    this.forEach(function (item) {
        ko[item] = 1;
    });
    return Object.keys(ko);
};

Array.prototype.remove = function (item) {
    this.splice(this.indexOf(item), 1);
};

Object.prototype.findKey = function(key) {
    keys = [];
    keys = Object.keys(this).filter(function (ind) {
        return (new RegExp(ind)).test(key);
    });
    result = [];
    for (var i = 0; i < keys.length; ++i) {
        result = result.concat(this[keys[i]]);
    }
    return result;
};

Array.prototype.contains = function (item) {
    return (this.indexOf(item) != -1);
};

function map(map, obj) {
    obj = obj || this;
    $.each(map, function (k, v) {
        obj[k] = obj[v];
    });
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function now() {
    return Math.floor((new Date()).getTime() / 1000);
}

function addScript(template) {
    var s = document.createElement("script");
    if (template.src) {
        s.src = template.src;
    }
    if (template.textContent) {
        s.textContent = template.textContent;
    }
    document.documentElement.appendChild(s);
}