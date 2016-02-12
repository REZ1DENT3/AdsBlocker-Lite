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

Object.prototype.serialize = function () {
    var data = this;
    return Object.keys(data).map(function(key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
    }).join('&');
};

Object.prototype.length = function () {
    return Object.keys(this).length;
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
    this.expr[":removeAll"] = function (d, sel) {
        return d.querySelectorAll(sel);
    };
})();

function querySelectorAll(d, selector) {
    if (typeof d == "undefined" || d == null || typeof d.querySelectorAll == "undefined") {
        return [];
    }
    if (selector.indexOf(':') >= 0) {
        for (var expr in jsExtended.expr) {
            if (typeof expr == "undefined") break;
            regex = new RegExp(expr + '(.*?)$');
            if (regex.test(selector)) {
                newSelector = selector.match(regex);
                newSelector[0] = selector.substr(0, selector.indexOf(expr));
                return jsExtended.expr[expr](d, newSelector[0], newSelector[1]);
            }
        }
    }
    return d.querySelectorAll(selector);
}

function ajax(options) {

    var http = new XMLHttpRequest();

    if (typeof options.success == "undefined") {
        options.success = function (response) {
        }
    }

    if (typeof options.data == "undefined") {
        options.data = {};
    }

    if (typeof options.method == "undefined") {
        options.method = "GET";
    }

    if (typeof options.contentType == "undefined") {
        options.contentType = 'application/x-www-form-urlencoded';
    }

    if (typeof options.stateChange == "undefined") {
        options.stateChange = function (response) {
        }
    }

    if (typeof options.progress == "undefined") {
        options.progress = function (response) {
        }
    }

    if (typeof options.fail == "undefined") {
        options.fail = function (response) {
        }
    }

    if (typeof options.async == "undefined") {
        options.async = true
    }

    http.onreadystatechange = options.stateChange;
    http.onload = options.success;
    http.onerror = options.fail;
    http.onprogress = options.progress;

    if (options.method == "GET") {
        url = options.url + "?" + options.data.serialize();
    }
    else {
        url = options.url
    }

    http.open(options.method, url, options.async);
    http.setRequestHeader('Content-Type', options.contentType);


    if (options.method == "GET") {
        http.send();
    }
    else {
        http.send(options.data.serialize());
    }

}