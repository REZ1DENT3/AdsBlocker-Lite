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

jQuery.prototype.blocker = function () {

    blockerCount++;

    if (!isNotWhitelist || !canBlock()) {
        return this;
    }

    t1 = (new Date()).getTime();
    if (blockerCount > 15 && timerEps < 300) {
        timerEps++;
    }

    $(document).unbind('click');
    $('html, body').unbind('click');

    if (rules.length) {
        $rules = $(rules.join(', '));
        $rules.adsBlock();

        if (typeof $rules.bund == "function") {
            $rules.bind("DOMSubtreeModified", function () {
                $(this).adsBlock();
            });
        }
    }

    return this;

};