'use strict';

var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
var isChrome = !!window.chrome && !isOpera;
var player = document.querySelector('#player');

function skipVideoAd() {
    if (document.getElementsByClassName('videoAdUi').length > 0) {
        document.getElementsByClassName('video-stream html5-main-video')[0].src = '';
        blockerRulesCount++;
    }
}

function hideOverlayAd() {
    // todo
    //var overlayAdContainer = document.getElementsByClassName('ad-container ad-container-single-media-element-annotations')[0];
    //if (overlayAdContainer && overlayAdContainer.style.display !== 'none') {
    //    overlayAdContainer.style.display = 'none';
    //    blockerRulesCount++;
    //}
}

function clearAds() {
    skipVideoAd();
    hideOverlayAd();
}

function DOMSTlistener(e) {
    if (e.target.innerHTML.length > 0) {
        clearAds();
    }
}

function init() {
    var videoAdContainer = document.getElementsByClassName('video-ads')[0];
    if (videoAdContainer) {
        player.removeEventListener('DOMSubtreeModified', init);
        videoAdContainer.addEventListener('DOMSubtreeModified', DOMSTlistener);
    }
}


if (/https?:\/\/(\w*.)?youtube.com/i.test(window.location.href.toLowerCase())) {
    if (isChrome) {
        player.addEventListener('DOMSubtreeModified', init);
    } else {
        clearAds();
    }
}
