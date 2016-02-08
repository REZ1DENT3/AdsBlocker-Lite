$(function () {
    chrome.storage.local.get({
        rules: [],
        rulesOnline: [],
        rulesData: [],
        apiKey: null,
        whitelisted: []
    }, function (items) {
        $('#ads-rules').val(items.rules.join('\n'));
        $('#api-key').val(items.apiKey);
        $('#whitelisted').val(items.whitelisted.join('\n'));

        if ($('#api-key').val().trim() == '') {
            $('#ads-rules-online').attr('disabled', 'disabled');
        }
        else {
            $('#ads-rules-online').removeAttr('disabled', 'disabled');
        }
    });

    $('#rules').submit(function () {
        setConfig(
            $('#ads-rules').val().split('\n'),
            $('#api-key').val().trim(),
            $('#whitelisted').val().split('\n')
        );
        return false;
    });
});

$('#ads-rules-online').click(function () {
    $.ajax({
        type: "POST",
        url: "https://ads.babichev.net/blocker",
        data: "token=" + $('#api-key').val().trim() + '&values=' + $('#ads-rules').val(),
        success: function (msg) {
            console.log(msg);
        }
    });
});

$('#ads-rules-get-online').click(function () {
    $.ajax({
        type: "GET",
        url: "https://ads.babichev.net/blocker",
        success: function (msg) {
            $('#ads-rules').val(msg);
        }
    });
});

function setConfig(dataRules, apiKey, whitelisted) {
    var rulesData = {};
    dataRules.forEach(function (string) {

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
        regExp = false;

        if (string[0].length) {
            _hostname = string[0].toLowerCase();
        }

        if (_hostname.substr(0, 4) == 'www.') {
            _hostname = _hostname.substr(4);
        }

        rule = string[1];

        if (typeof rulesData[_hostname] == 'undefined') {
            rulesData[_hostname] = new Array();
        }

        rulesData[_hostname].push({
            'rule': rule,
            'regExp': regExp
        });

    });

    chrome.storage.local.set({
        rules: dataRules,
        rulesOnline: [],
        rulesData: rulesData,
        apiKey: apiKey,
        whitelisted: whitelisted
    }, function () {
        $('#model-success').modal('show');

        if ($('#api-key').val().trim() == '') {
            $('#ads-rules-online').attr('disabled', 'disabled');
        }
        else {
            $('#ads-rules-online').removeAttr('disabled', 'disabled');
        }
    });
}