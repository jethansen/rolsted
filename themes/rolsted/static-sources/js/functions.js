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
}

var transitionEvent = whichTransitionEvent();

/* Get viewport size (to match media queries) */
function viewport() {
    var e = window, a = 'inner';
    if (!('innerWidth' in window )) {
        a = 'client';
        e = document.documentElement || document.body;
    }
    return { width : e[ a+'Width' ] , height : e[ a+'Height' ] };
}
