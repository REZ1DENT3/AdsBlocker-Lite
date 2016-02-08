/**
 * injects a code to the page context that does the following:
 * replace the window.open function with a function that checks if the window.open was executed due to an event.
 * if so, then it checks who triggered the event. if it's the document or the body elements, the call is blocked.
 * another protection, is closing windows that got blured by calling window.blur(), less then a second from its creation.
 * check out the footer for another way websites try to open a new window.
 * @return nothing
 */

function inject() {

    var originalOpenWndFnKey = "originalOpenFunction";

    var originalWindowOpenFn = window.open,
        originalCreateElementFn = document.createElement,
        originalCreateEventFn = document.createEvent,
        windowsWithNames = {};
    var timeSinceCreateAElement = 0;
    var lastCreatedAElement = null;
    var fullScreenOpenTime;
    var parentOrigin = (window.location != window.parent.location) ? document.referrer : document.location;

    window[originalOpenWndFnKey] = window.open; // save the original open window as global param

    function newWindowOpenFn() {

        var openWndArguments = arguments,
            useOriginalOpenWnd = true,
            generatedWindow = null;

        function blockedWndNotification(openWndArguments) {
            parent.postMessage({type: "blockedWindow", args: JSON.stringify(openWndArguments)}, parentOrigin);
        }

        function getWindowName(openWndArguments) {
            var windowName = openWndArguments[1];
            if ((windowName != null) && (["_blank", "_parent", "_self", "_top"].indexOf(windowName) < 0)) {
                return windowName;
            }

            return null;
        }

        function copyMissingProperties(src, dest) {
            var prop;
            for (prop in src) {
                try {
                    if (dest[prop] === undefined) {
                        dest[prop] = src[prop];
                    }
                } catch (e) {
                }
            }
            return dest;
        }

        // the element who registered to the event
        var capturingElement = null;
        if (window.event != null) {
            capturingElement = window.event.currentTarget;
        }

        if (capturingElement == null) {
            var caller = openWndArguments.callee;
            while ((caller.arguments != null) && (caller.arguments.callee.caller != null)) {
                caller = caller.arguments.callee.caller;
            }
            if ((caller.arguments != null) && (caller.arguments.length > 0) && (caller.arguments[0].currentTarget != null)) {
                capturingElement = caller.arguments[0].currentTarget;
            }
        }

        /////////////////////////////////////////////////////////////////////////////////
        // Blocked if a click on background element occurred (<body> or document)
        /////////////////////////////////////////////////////////////////////////////////

        if ((capturingElement != null) && (
                (capturingElement instanceof Window) ||
                (capturingElement === document) ||
                (
                    (capturingElement.URL != null) && (capturingElement.body != null)
                ) ||
                (
                    (capturingElement.nodeName != null) && (
                        (capturingElement.nodeName.toLowerCase() == "body") ||
                        (capturingElement.nodeName.toLowerCase() == "#document")
                    )
                )
            )) {
            window.pbreason = "Blocked a new window opened with URL: " + openWndArguments[0] + " because it was triggered by the " + capturingElement.nodeName + " element";
            // console.info(window.pbreason);
            useOriginalOpenWnd = false;
        } else {
            useOriginalOpenWnd = true;
        }
        /////////////////////////////////////////////////////////////////////////////////


        /////////////////////////////////////////////////////////////////////////////////
        // Block if a full screen was just initiated while opening this url.
        /////////////////////////////////////////////////////////////////////////////////

        // console.info("fullscreen: " + ((new Date()).getTime() - fullScreenOpenTime));
        // console.info("webkitFullscreenElement: " + document.webkitFullscreenElement);
        var fullScreenElement = document.webkitFullscreenElement || document.mozFullscreenElement || document.fullscreenElement
        if ((((new Date()).getTime() - fullScreenOpenTime) < 1000) || ((isNaN(fullScreenOpenTime) && (isDocumentInFullScreenMode())))) {

            window.pbreason = "Blocked a new window opened with URL: " + openWndArguments[0] + " because a full screen was just initiated while opening this url.";
            // console.info(window.pbreason);

            /* JRA REMOVED
             if (window[script_params.fullScreenFnKey]) {
             window.clearTimeout(window[script_params.fullScreenFnKey]);
             }
             */

            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }

            useOriginalOpenWnd = false;
        }
        /////////////////////////////////////////////////////////////////////////////////


        if (useOriginalOpenWnd == true) {

            // console.info("allowing new window to be opened with URL: " + openWndArguments[0]);

            generatedWindow = originalWindowOpenFn.apply(this, openWndArguments);

            // save the window by name, for latter use.
            var windowName = getWindowName(openWndArguments);
            if (windowName != null) {
                windowsWithNames[windowName] = generatedWindow;
            }

            // 2nd line of defence: allow window to open but monitor carefully...

            /////////////////////////////////////////////////////////////////////////////////
            // Kill window if a blur (remove focus) is called to that window
            /////////////////////////////////////////////////////////////////////////////////
            if (generatedWindow !== window) {
                var openTime = (new Date()).getTime();
                var originalWndBlurFn = generatedWindow.blur;
                generatedWindow.blur = function () {
                    if (((new Date()).getTime() - openTime) < 1000 /* one second */) {
                        window.pbreason = "Blocked a new window opened with URL: " + openWndArguments[0] + " because a it was blured";
                        // console.info(window.pbreason);
                        generatedWindow.close();
                        blockedWndNotification(openWndArguments);
                    } else {
                        // console.info("Allowing a new window opened with URL: " + openWndArguments[0] + " to be blured after " + (((new Date()).getTime() - openTime)) + " seconds");
                        originalWndBlurFn();
                    }
                };
            }
            /////////////////////////////////////////////////////////////////////////////////

        } else { // (useOriginalOpenWnd == false)

            var location = {
                href: openWndArguments[0]
            };
            location.replace = function (url) {
                location.href = url;
            };

            generatedWindow = {
                close: function () {
                    return true;
                },
                test: function () {
                    return true;
                },
                blur: function () {
                    return true;
                },
                focus: function () {
                    return true;
                },
                showModelessDialog: function () {
                    return true;
                },
                showModalDialog: function () {
                    return true;
                },
                prompt: function () {
                    return true;
                },
                confirm: function () {
                    return true;
                },
                alert: function () {
                    return true;
                },
                moveTo: function () {
                    return true;
                },
                moveBy: function () {
                    return true;
                },
                resizeTo: function () {
                    return true;
                },
                resizeBy: function () {
                    return true;
                },
                scrollBy: function () {
                    return true;
                },
                scrollTo: function () {
                    return true;
                },
                getSelection: function () {
                    return true;
                },
                onunload: function () {
                    return true;
                },
                print: function () {
                    return true;
                },
                open: function () {
                    return this;
                },
                opener: window,
                closed: false,
                innerHeight: 480,
                innerWidth: 640,
                name: openWndArguments[1],
                location: location,
                document: {location: location}
            };

            copyMissingProperties(window, generatedWindow);

            generatedWindow.window = generatedWindow;

            var windowName = getWindowName(openWndArguments);
            if (windowName != null) {
                try {
                    // originalWindowOpenFn("", windowName).close();
                    windowsWithNames[windowName].close();
                    // console.info("Closed window with the following name: " + windowName);
                } catch (err) {
                    // console.info("Couldn't close window with the following name: " + windowName);
                }
            }

            setTimeout(function () {
                var url;
                if (!(generatedWindow.location instanceof Object)) {
                    url = generatedWindow.location;
                } else if (!(generatedWindow.document.location instanceof Object)) {
                    url = generatedWindow.document.location;
                } else if (location.href != null) {
                    url = location.href;
                } else {
                    url = openWndArguments[0];
                }
                openWndArguments[0] = url;
                blockedWndNotification(openWndArguments);
            }, 100);
        }

        return generatedWindow;
    }


    /////////////////////////////////////////////////////////////////////////////////
    // Replace the window open method with Poper Blocker's
    /////////////////////////////////////////////////////////////////////////////////
    window.open = function () {
        try {
            return newWindowOpenFn.apply(this, arguments);
        } catch (err) {
            return null;
        }
    };
    /////////////////////////////////////////////////////////////////////////////////


    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Monitor dynamic html element creation to prevent generating <a> elements with click dispatching event
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    document.createElement = function () {

        var newElement = originalCreateElementFn.apply(document, arguments);

        if (arguments[0] == "a" || arguments[0] == "A") {

            timeSinceCreateAElement = (new Date).getTime();

            var originalDispatchEventFn = newElement.dispatchEvent;

            newElement.dispatchEvent = function (event) {
                if (event.type != null && (("" + event.type).toLocaleLowerCase() == "click")) {
                    window.pbreason = "blocked due to an explicit dispatchEvent event with type 'click' on an 'a' tag";
                    // console.info(window.pbreason);
                    parent.postMessage({
                        type: "blockedWindow",
                        args: JSON.stringify({"0": newElement.href})
                    }, parentOrigin);
                    return true;
                }

                return originalDispatchEventFn(event);
            };

            lastCreatedAElement = newElement;

        }

        return newElement;
    };
    /////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////
    // Block artificial mouse click on frashly created <a> elements
    /////////////////////////////////////////////////////////////////////////////////
    document.createEvent = function () {
        try {
            if ((arguments[0].toLowerCase().indexOf("mouse") >= 0) && ((new Date).getTime() - timeSinceCreateAElement) <= 50) {
                window.pbreason = "Blocked because 'a' element was recently created and " + arguments[0] + " event was created shortly after";
                // console.info(window.pbreason);
                arguments[0] = lastCreatedAElement.href;
                parent.postMessage({
                    type: "blockedWindow",
                    args: JSON.stringify({"0": lastCreatedAElement.href})
                }, parentOrigin);
                return null;
            }
            return originalCreateEventFn.apply(document, arguments);
        } catch (err) {
        }
    };
    /////////////////////////////////////////////////////////////////////////////////


    /////////////////////////////////////////////////////////////////////////////////
    // Monitor full screen requests
    /////////////////////////////////////////////////////////////////////////////////
    function onFullScreen(isInFullScreenMode) {
        if (isInFullScreenMode) {
            fullScreenOpenTime = (new Date()).getTime();
            // console.info("fullScreenOpenTime = " + fullScreenOpenTime);
        } else {
            fullScreenOpenTime = NaN;
        }
    }
    /////////////////////////////////////////////////////////////////////////////////

    function isDocumentInFullScreenMode() {
        // Note that the browser fullscreen (triggered by short keys) might
        // be considered different from content fullscreen when expecting a boolean
        return ((document.fullScreenElement && document.fullScreenElement !== null) ||    // alternative standard methods
        ((document.mozFullscreenElement != null) || (document.webkitFullscreenElement != null)));                   // current working methods
    }

    document.addEventListener("fullscreenchange", function () {
        onFullScreen(document.fullscreen);
    }, false);

    document.addEventListener("mozfullscreenchange", function () {
        onFullScreen(document.mozFullScreen);
    }, false);

    document.addEventListener("webkitfullscreenchange", function () {
        onFullScreen(document.webkitIsFullScreen);
    }, false);

}

/*
 (*) a jquery plugin (https://github.com/hpbuniat/jquery-popunder/blob/master/src/jquery.popunder.js) | $.popunder.helper.open

 (*) another jquery plugin (https://github.com/tuki/js-popunder/)

 The full-screen trick
 ---------------------

 (*) another way sites try to open new windows, is to put a link inside the page and generate a click on it.
 the link opens a new tab with a name, and then they try to call window.open with that name a change the tab's url.
 for example:

 var a = document.createElement("a");
 var e = document.createEvent("MouseEvents");
 var rand = Math.random();
 a.target = "_tab" + rand.toString();
 a.href = "about:blank";
 document.body.appendChild(a);
 e.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, true, false, false, true, 0, null);
 a.dispatchEvent(e);
 window.open("about:blank", "_tab" + rand.toString()).close();

 (*) They open full screen mode -> open a popup window -> exit full screen mode, thus it goes beneath the window

 The create element & event trick
 --------------------------------

 (*) The website will create an <a> element and also a MouseEvents event, that will auto click on it.
 This will make a window to open and without the window.open

 (*) http://torrents.to/

 Pop-under test websites:
 --------------------------------

 http://www.ad4game.com/popunder/
 http://test.gluk.name/test2/pop3/?#
 http://cpmnetwork.adbooth.com/en/popunder
 http://www.vcmuk.com/poptest.html
 http://affplaybook.com/poptest/exit1/test.html

 Not blocked by AdBlock:

 http://demo.dynamicoxygen.com/Pop-Under
 http://mirodex.blogspot.co.il/2013/10/working-popunder-script-on-chrome.html
 http://www.advertserve.com/examples/popups.html
 http://www.htmlgoodies.com/beyond/javascript/article.php/3471241

 */