var data = {
    message: 'Button color changed.',
    timeout: 2000,
    actionHandler: function () {

    },
    actionText: 'Undo'
};

var snackbarContainer = document.querySelector('#adsblocker-snackbar');

//document.querySelector('#ads-rules-online').addEventListener("click", function (event) {
//    var http = new XMLHttpRequest();
//    http.onreadystatechange = function () {
//        if (http.readyState == 4) {
//            http = JSON.parse(http.responseText);
//            if (http.status == 200) {
//                dialogSetMessage("Data on the server were successfully loaded!");
//                snackbarContainer.MaterialSnackbar.showSnackbar(data);
//            }
//            else {
//                dialogSetMessage("There was a mistake!");
//                snackbarContainer.MaterialSnackbar.showSnackbar(data);
//            }
//        }
//    };
//    token = encodeURIComponent(storageParameters.apiKey);
//    rules = encodeURIComponent(document.querySelector('#ads-rules').value);
//    http.open("POST", "https://ads.babichev.net/blocker", true);
//    http.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//    http.send("token=" + token + '&values=' + rules);
//});

//document.querySelector('#ads-rules-get-online').addEventListener("click", function (event) {
//    var http = new XMLHttpRequest();
//    http.onreadystatechange = function () {
//        if (http.readyState == 4) {
//            if (http.status == 200) {
//                dialogSetMessage("Data from the server were successfully obtained!");
//                snackbarContainer.MaterialSnackbar.showSnackbar(data);
//                document.querySelector('#ads-rules').value = http.responseText;
//            }
//            else {
//                dialogSetMessage("There was a mistake!");
//                snackbarContainer.MaterialSnackbar.showSnackbar(data);
//            }
//        }
//    };
//    http.open("GET", "https://ads.babichev.net/blocker", true);
//    http.send();
//});

function addRuleInString(string) {

    string = string.trim();

    if (!string.length) {
        return;
    }

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

}

function append(url, apiKey) {

    if (typeof url == "undefined") {
        url = '';
    }

    if (typeof apiKey == "undefined") {
        apiKey = '';
    }

    $repo = document.querySelector('#repo-new');

    $newRepo = $repo.cloneNode(true);
    $newRepo.querySelector('#apikey-id-new').value = apiKey;
    $newRepo.querySelector('#apikey-id-new').parentNode.removeAttribute('data-upgraded');
    $newRepo.querySelector('#repo-id-new').value = url;
    $newRepo.querySelector('#repo-id-new').parentNode.removeAttribute('data-upgraded');

    $rnd = Math.round(Math.random() * 10000);

    $repo.id = '';
    $repo.querySelector('#apikey-id-new').id = 'apikey-id-' + $rnd;
    $repo.querySelector('[for=apikey-id-new]').setAttribute('for', 'apikey-id-' + $rnd);
    $repo.querySelector('#repo-id-new').id = 'repo-id-' + $rnd;
    $repo.querySelector('[for=repo-id-new]').setAttribute('for', 'repo-id-' + $rnd);

    if (!$repo.querySelector('#repo-id-' + $rnd).value.length) {
        $repo.parentNode.removeChild($repo);
    }

    document.querySelector('#repositories-panel form')
        .appendChild($newRepo);

    document.querySelector('#repositories-panel form')
        .appendChild(document.querySelector('#repositories-panel form .div-buttons'));

    componentHandler.upgradeDom('MaterialTextfield');

}

document.addEventListener("DOMContentLoaded", function () {
    chrome.storage.local.get(storageParameters, function (items) {
        document.querySelector('#whitelisted').value = items.whitelisted.join('\n');
        document.querySelector('#ads-rules').value = items.rules.join('\n');
        for (i = 0; i < items.repositories.length; ++i) {
            append(items.repositories[i].url, items.repositories[i].apiKey);
        }
        storageParameters = items;
    });
});

function saveConfig(msg) {
    Object.keys(storageParameters.rulesData).map(function (hName) {
        storageParameters.rulesData[hName] = storageParameters.rulesData[hName].unique();
    });
    chrome.storage.local.set(storageParameters, function () {
        if (typeof msg == "undefined") {
            msg = "Save!";
        }
        data.message = msg;
        snackbarContainer.MaterialSnackbar.showSnackbar(data);
    });
}

document.querySelector('#whitelisted-panel form').onsubmit = function (event) {
    storageParameters.whitelisted = document.querySelector('#whitelisted').value.split('\n');
    saveConfig();
    return false;
};

document.querySelector('#newLine').onclick = function (event) {
    append();
    return false;
};

document.querySelector('#update').onclick = function (event) {
    for (i = 0; i < storageParameters.repositories.length; ++i) {
        ajax({
            url: storageParameters.repositories[i].url,
            data: {
                lastUpdate: storageParameters.repositories[i].updated
            },
            async: false,
            success: function (http) {
                storageParameters.repositories[i].updated = now();
                storageParameters.repositories[i].data = http.target.response.split('\n');// JSON.parse();
                storageParameters.repositories[i].data.forEach(addRuleInString);
                saveConfig("Success, repo: " + storageParameters.repositories[i].url);
            },
            fail: function (http) {
                saveConfig("Error, repo: " + storageParameters.repositories[i].url);
            }
        });
    }
    return false;
};

document.querySelector('#repositories-panel form').onsubmit = function (event) {

    $divs = this.querySelectorAll('.mdl-grid:not(.div-buttons)');
    storageParameters.repositories = new Array();
    for (i = 0; i < $divs.length; ++i) {
        url = $divs[i].querySelector('[id^="repo-id-"]').value;
        apiKey = $divs[i].querySelector('[id^="apikey-id-"]').value;

        if (!url.length)
            continue;

        storageParameters.repositories.push(new repository(url, apiKey));
    }

    saveConfig();
    return false;
};

document.querySelector('#myrules-panel form').onsubmit = function (event) {
    storageParameters.rules = document.querySelector('#ads-rules').value.split('\n');
    storageParameters.rules.forEach(addRuleInString);
    saveConfig();
    return false;
};