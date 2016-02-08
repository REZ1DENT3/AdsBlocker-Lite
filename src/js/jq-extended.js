jQuery.expr[':'].regex = function (elem, index, match) {
    var matchParams = match[3].split(','),
        validLabels = /^(data|css):/,
        attr = {
            method: matchParams[0].match(validLabels) ? matchParams[0].split(':')[0] : 'attr',
            property: matchParams.shift().replace(validLabels, '')
        },
        regexFlags = 'ig',
        regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g, ''), regexFlags);
    return regex.test(jQuery(elem)[attr.method](attr.property));
};

jQuery.prototype.adsBlock = function () {
    $(this).empty().detach();
};

jQuery.prototype.blocker = function (callback) {

    blockerCount++;
    if (!isNotWhitelist || !canBlock()) {
        return this;
    }

    t1 = (new Date()).getTime();
    if (blockerCount > 30 && timerEps < 300) {
        timerEps++;
    }

    if (rules.length) {
        $rules = $(rules.join(', '));
        if ($rules.length) {

            blockerRulesCount += $rules.length;
            $rules.adsBlock();

            $.each(rulesFunc, function (ind, rf) {
                $rule = $(rulesFunc[ind].rule);
                if ($rule.length) {
                    blockerCount += $rule.length;
                    eval('$rule.' + rulesFunc[ind].exec + '.adsBlock()');
                }
            });

            if (blockerRulesCount) {
                chrome.runtime.sendMessage({
                    name: "setBadgeText",
                    text: '' + blockerRulesCount
                });
            }

            if (typeof $rules.bund == "function") {
                $rules.bind("DOMSubtreeModified", function () {
                    $(this).adsBlock();
                });
            }

        }
    }

    return this;
};