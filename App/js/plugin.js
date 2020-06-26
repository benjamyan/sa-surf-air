const scrollTypes = [ "scroll","onwheel", "wheel", "mousewheel", "onmousewheel","DOMMouseScroll", "touchstart", "touchmove", "touchend", "touchcancel" ];
const keys = {37: 1, 38: 1, 39: 1, 40: 1};
/* Scroll-locking function for closed-scroll pages */
function preventDefault(e) {
    e.preventDefault();
}
function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}
var supportsPassive = false;
try {
    window.addEventListener(
        "test",
        null,
        Object.defineProperty({}, "passive", {
            get: function () {
                supportsPassive = true;
            },
        })
    );
} catch (e) {}
var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = "onwheel" in document.createElement("div") ? "wheel" : "mousewheel";
var arrow_keys_handler = function (e) {
    switch (e.keyCode) {
        case 37:
        case 39:
        case 38:
        case 40:
        case 32:
            e.preventDefault();
            break;
        default:
            break;
    }
};
var mouseHandle = function (evt) {
    var scrolling = false;
    var oldTime = 0;
    var newTime = 0;
    var isTouchPad;
    var eventCount = 0;
    var eventCountStart;
    var isTouchPadDefined = isTouchPad || typeof isTouchPad !== "undefined";
    if (!isTouchPadDefined) {
        if (eventCount === 0) {
            eventCountStart = new Date().getTime();
        }
        eventCount++;
        if (new Date().getTime() - eventCountStart > 100) {
            if (eventCount > 10) {
                isTouchPad = true;
            } else {
                isTouchPad = false;
            }
            isTouchPadDefined = true;
        }
    }
    if (isTouchPadDefined) {
        if (!evt) evt = event;
        // var direction = (evt.detail<0 || evt.wheelDelta>0) ? 1 : -1;
        if (isTouchPad) {
            newTime = new Date().getTime();
            if (!scrolling && newTime-oldTime > 550 ) {
                scrolling = true;
                evt.preventDefault()
                setTimeout(function() {oldTime = new Date().getTime();scrolling = false}, 500);
            }
        } else {
            evt.preventDefault()
        }
    }
}
function disableScroll() {
    scrollTypes.forEach(function (current) {
        window.removeEventListener(current, onScrollEvent, false);
        window.removeEventListener(current, onScrollEvent, wheelOpt);
    });
    window.addEventListener("wheel", mouseHandle, false);
    window.addEventListener("onwheel", mouseHandle, false);
    window.addEventListener("mousewheel", mouseHandle, false);
    window.addEventListener("DOMMouseScroll", mouseHandle, false);
    window.removeEventListener("keydown", onKeyEvent, false);
    window.addEventListener("keydown", arrow_keys_handler, false);
    window.addEventListener("onwheel", preventDefault, false);
    window.addEventListener("onmousewheel", preventDefault, false);
    window.addEventListener("mousewheel", preventDefault, false);
    window.addEventListener("DOMMouseScroll", preventDefault, false);
    window.addEventListener(wheelEvent, preventDefault, wheelOpt);
    window.addEventListener("wheel", preventDefault, wheelOpt);
    window.addEventListener("touchstart", preventDefault, wheelOpt);
    window.addEventListener("touchmove", preventDefault, wheelOpt);
    window.addEventListener("touchend", preventDefault, wheelOpt);
    window.addEventListener("keydown", preventDefaultForScrollKeys, false);
}
function enableScroll() {
    window.removeEventListener("wheel", mouseHandle, false);
    window.removeEventListener("onwheel", mouseHandle, false);
    window.removeEventListener("mousewheel", mouseHandle, false);
    window.removeEventListener("DOMMouseScroll", mouseHandle, false);
    window.removeEventListener("onwheel", preventDefault, false);
    window.removeEventListener("onmousewheel", preventDefault, false);
    window.removeEventListener("mousewheel", preventDefault, false);
    window.removeEventListener("DOMMouseScroll", preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener("wheel", preventDefault, wheelOpt);
    window.removeEventListener("touchstart", preventDefault, wheelOpt);
    window.removeEventListener("touchmove", preventDefault, wheelOpt);
    window.removeEventListener("touchend", preventDefault, wheelOpt);
    window.removeEventListener("keydown", preventDefaultForScrollKeys, false);
}
/* Line-splitting function for text-based interactions */
/** * Splits new lines of text into separate divs * * ### Options: * - `width` string The width of the box. By default, it tries to use the * element's width. If you don't define a width, there's no way to split it * by lines! *- `tag` string The tag to wrap the lines in *- `keepHtml` boolean Whether or not to try and preserve the html within * the element. Default is true * *@param options object The options object *@license MIT License (http://www.opensource.org/licenses/mit-license.php) */(function($){/** * Creates a temporary clone * * @param element element The element to clone */function _createTemp(element){return element.clone().css({position: 'absolute'});};/** * Splits contents into words, keeping their original Html tag. Note that this * tags *each* word with the tag it was found in, so when the wrapping begins * the tags stay intact. This may have an effect on your styles (say, if you have * margin, each word will inherit those styles). * * @param node contents The contents */function _splitHtmlWords(contents){var words=[];var splitContent;for (var c=0; c<contents.length; c++){if (contents[c].nodeName==='BR'){words.push('<br>');continue;}if (contents[c].nodeType==3){splitContent=_splitWords(contents[c].textContent || contents[c].toString());}else{var tag=$(contents[c]).clone();splitContent=_splitHtmlWords(tag.contents());for (var t=0; t<splitContent.length; t++){tag.empty();splitContent[t]=tag.html(splitContent[t]).wrap('<p></p>').parent().html();}}for (var w=0; w<splitContent.length; w++){if (splitContent[w]===''){continue;}words.push(splitContent[w]);}}return words;};/** * Splits words by spaces * * @param string text The text to split */function _splitWords(text){return text.split(/\s+/);}/** * Formats html with tags and wrappers. * * @param tag * @param html content wrapped by the tag * @param index Current line index */function _markupContent(tag, html, index){tag='<div class="stop">' + tag;var $outer=$(tag).find('*:not(:has("*"))').html(html).closest('.stop').slice(-1);$outer.children().each(function (i, element){element.style.setProperty('--line-index', index);});return $outer.html();}$.fn.splitLines=function(options){var settings={width: 'auto',tag: '<div>',wrap: '',keepHtml: true};if (options){$.extend(settings, options);}var newHtml=_createTemp(this);var contents=this.contents();var text=this.text();this.append(newHtml);newHtml.text('42');var maxHeight=newHtml.height()+2;newHtml.empty();var tempLine=_createTemp(newHtml);var width=settings.width;if (settings.width==='auto'){width=this[0].offsetWidth;}tempLine.width(width);this.append(tempLine);var words=settings.keepHtml ? _splitHtmlWords(contents) : _splitWords(text);var prev;var lineCount=0;for (var w=0; w<words.length; w++){var html=tempLine.html();tempLine.html(html+words[w]+' ');if (tempLine.html()==prev){prev='';newHtml.append(_markupContent(settings.tag, tempLine.html(), lineCount));tempLine.html('');continue;}if (tempLine.height() > maxHeight){prev=tempLine.html();tempLine.html(html);newHtml.append(_markupContent(settings.tag, tempLine.html(), lineCount));tempLine.html('');w--;lineCount++;}}newHtml.append(_markupContent(settings.tag, tempLine.html(), lineCount));this.html(newHtml.html());};})(jQuery);