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

Object.prototype.findKey = function (key) {
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
    for (var k in map) {
        obj[k] = obj[map[k]];
    }
}

function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

function now() {
    return Math.floor((new Date()).getTime() / 1000);
}

function addScript(template) {
    var script = document.createElement("script");
    if (template.src) {
        script.src = template.src;
    }
    if (template.textContent) {
        script.textContent = template.textContent;
    }
    document.documentElement.appendChild(script);
}

var jsExtended = new (function () {
    this.expr = new Array();
    this.expr[":attr"] = function (d, sel, selector) {
        return Array.prototype.slice.call(document.querySelectorAll(sel)).filter(function (element) {
            keys = Array.prototype.slice.call(element.attributes).filter(function (attribute) {
                return (new RegExp(selector)).test(attribute.name);
            });
            return keys.length;
        });
    };
    this.expr[":removeAll"] = function(d, sel, selector) {
        return d.querySelectorAll(sel);
    }
})();

function querySelectorAll(d, selector) {
    for (var expr in jsExtended.expr) {
        if (typeof expr == "undefined") break;
        regex = new RegExp(expr + '(.*?)$');
        if (regex.test(selector)) {
            newSelector = selector.match(regex);
            newSelector[0] = selector.substr(0, selector.indexOf(expr));
            return jsExtended.expr[expr](d, newSelector[0], newSelector[1]);
        }
    }
    return d.querySelectorAll(selector);
}