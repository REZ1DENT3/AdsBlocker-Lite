var storageParameters = {
    rules: [],
    rulesOnline: [],
    rulesData: [],
    apiKey: "",
    whitelisted: []
};

var data = {
    message: 'Button color changed.',
    timeout: 2000,
    actionHandler: function () {
        
    },
    actionText: 'Undo'
};

var snackbarContainer = document.querySelector('#adsblocker-snackbar');

function dialogSetMessage(msg) {
    data.message = msg;
}

function adsRulesOnline() {
    if (document.querySelector('#api-key').value == '') {
        document.querySelector('#ads-rules-online').setAttribute('disabled', true);
    }
    else {
        document.querySelector('#ads-rules-online').removeAttribute('disabled');
    }
}

document.addEventListener("DOMContentLoaded", function () {

    chrome.storage.local.get(storageParameters, function (items) {

        document.querySelector('#whitelisted').value = items.whitelisted.join('\n');
        document.querySelector('#ads-rules').value = items.rules.join('\n');
        document.querySelector('#api-key').value = items.apiKey.trim();

        adsRulesOnline();

        storageParameters = items;

    });
});

document.querySelector('#ads-rules-online').addEventListener("click", function (event) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            http = JSON.parse(http.responseText);
            if (http.status == 200) {
                dialogSetMessage("Data on the server were successfully loaded!");
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            }
            else {
                dialogSetMessage("There was a mistake!");
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            }
        }
    };
    token = encodeURIComponent(storageParameters.apiKey);
    rules = encodeURIComponent(document.querySelector('#ads-rules').value);
    http.open("POST", "https://ads.babichev.net/blocker", true);
    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    http.send("token=" + token + '&values=' + rules);
});

document.querySelector('#ads-rules-get-online').addEventListener("click", function (event) {
    var http = new XMLHttpRequest();
    http.onreadystatechange = function () {
        if (http.readyState == 4) {
            if (http.status == 200) {
                dialogSetMessage("Data from the server were successfully obtained!");
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
                document.querySelector('#ads-rules').value = http.responseText;
            }
            else {
                dialogSetMessage("There was a mistake!");
                snackbarContainer.MaterialSnackbar.showSnackbar(data);
            }
        }
    };
    http.open("GET", "https://ads.babichev.net/blocker", true);
    http.send();
});

document.querySelector('#rules').onsubmit = function (event) {

    storageParameters.whitelisted = document.querySelector('#whitelisted').value.split('\n');
    storageParameters.rules = document.querySelector('#ads-rules').value.split('\n');
    storageParameters.apiKey = document.querySelector('#api-key').value.trim();

    storageParameters.rulesData = {};

    storageParameters.rules.forEach(function (string) {

        if (!string.length) {
            return;
        }

        string = string.trim();

        if (string.substr(0, 2) == '//') {
            return;
        }

        string = string.split('##');
        _hostname = ConstAllSite;
        rule = null;

        if (string[0].length) {
            _hostname = string[0].toLowerCase();
        }

        rule = string[1];

        if (typeof storageParameters.rulesData[_hostname] == 'undefined') {
            storageParameters.rulesData[_hostname] = new Array();
        }

        storageParameters.rulesData[_hostname].push(rule);

    });

    chrome.storage.local.set(storageParameters, function () {

        dialogSetMessage("Data are kept!");
        snackbarContainer.MaterialSnackbar.showSnackbar(data);

        adsRulesOnline();
    });

    return false;

};