// Functions
/* Get scrollbar width  */
function getScrollBarWidth() {

    var div = document.createElement('div')

    div.style.width = '100px'
    div.style.height = '100px'
    div.style.overflow = 'scroll'
    div.style.position = 'absolute'
    div.style.top = '-9999px'

    document.body.appendChild(div)

    var scrollbarWidth = div.offsetWidth - div.clientWidth

    document.body.removeChild(div)

    return scrollbarWidth

};

// Function from David Walsh: http://davidwalsh.name/css-animation-callback
function whichTransitionEvent(){
  var t,
      el = document.createElement("fakeelement");

  var transitions = {
    "transition"      : "transitionend",
    "OTransition"     : "oTransitionEnd",
    "MozTransition"   : "transitionend",
    "WebkitTransition": "webkitTransitionEnd"
  }

  for (t in transitions){
    if (el.style[t] !== undefined){
      return transitions[t];
    }
  }
};

var transitionEvent = whichTransitionEvent();

/* Get viewport size (to match media queries) */
function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
};

/* Functions for enabling and disabling scroll, that works on iOS - https://gist.githubusercontent.com/tonytangau/04cca5e1a51d1dc0b49513fcd646b394/raw/b482e10cd5dd4446f245344ac3692c976330236c/iosFixedElement.js */
var fixedElement;

var freeze = function (e) {
    if (!document.getElementsByClassName(fixedElement)[0].contains(e.target)) {
        e.preventDefault();
    }
};

var disableScroll = function () {
    document.body.style.overflow = "hidden"; // Or toggle using class: document.body.className += "overflow-hidden-class";

    // Only accept touchmove from fixed-element
    document.addEventListener('touchmove', freeze, false);
    
    // Prevent background scrolling
    document.getElementsByClassName(fixedElement)[0].addEventListener("touchmove", function (e) {
        var top = this.scrollTop,
            totalScroll = this.scrollHeight,
            currentScroll = top + this.offsetHeight;

        if (top === 0 && currentScroll === totalScroll) {
            e.preventDefault();
        } else if (top === 0) {
            this.scrollTop = 1;
        } else if (currentScroll === totalScroll) {
            this.scrollTop = top - 1;
        }
    });
    
};

var enableScroll = function () {
    document.removeEventListener("touchmove", freeze);
    document.body.style.overflow = "";
};