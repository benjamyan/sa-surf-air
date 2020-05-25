const DOM = {
    counter: ".section__counter"
};
const counter = document.querySelector(DOM.counter),
      sections = Array.from(document.querySelectorAll("section")),
      totalSections = sections.length,
      viewportWidth = window.innerWidth || document.documentElement.clientWidth;


populateCounterID = ()=> {
    for (let i = 0; i < totalSections; i++) {
        counter.innerHTML += `<div id="${i+1}"></div>`
    }
    console.log(counter)
    counter.querySelector("div:first-child").classList.add("active")
}
populateSectionID = ()=> {
    sections.forEach(function(current, index){
        current.id = index + 1;
    });
}

lockViewport = (element, time)=> {
    var keys = {37: 1, 38: 1, 39: 1, 40: 1};
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
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; } 
        }));
    } catch(e) {}
    var wheelOpt = supportsPassive ? { passive: false } : false;
    var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
    function disableScroll() {
        window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
        window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
        window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    function enableScroll() {
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt); 
        window.removeEventListener('touchmove', preventDefault, wheelOpt);
        window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    disableScroll()
    setTimeout(function() {
        enableScroll()
    }, time);
};
isInViewport = (el)=> {
    const rect = el.getBoundingClientRect(),
          windowHeight = (window.innerHeight || document.documentElement.clientHeight),
          windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    return (
        (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0) 
        &&
        (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0)
    );
};
fireInteractions = (targetEl)=> {
    const targetInteractions = Array.from(targetEl.querySelectorAll("[data-interaction]")),
          interaction = targetInteractions[0].dataset.interaction;
    if (interaction === "fadeIn") fadeIn(targetInteractions)
}
scrollToSection = (dir)=> {
    if (viewportWidth < 1024) {
        return false;
    } else {
        let targetEl, isFired = false;
        sections.forEach(function(current, index){
            if (isInViewport(current)) {
                if (dir === 0){ // going down
                    next = sections[index + 1];
                    if (next || typeof next !== undefined || next in window !== false || next !== undefined) {
                        targetEl = next
                    } else {
                        targetEl = sections[sections.length - 1]
                    }
                } else { // going up
                    prev = sections[index - 1];
                    if (prev || typeof prev !== undefined || prev in window !== false || prev !== undefined) {
                        targetEl = prev
                    } else {
                        targetEl = sections[0]
                    }
                }
            }
        });
        lockViewport( document.querySelector("body") , 1000);
        lockViewport( document.querySelector("main") , 1000);
        fireInteractions(targetEl)
        targetEl.scrollIntoView({ 
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    };
}

function setupPopulators() {
    populateCounterID(), populateSectionID();
}
function setupListeners() {
    const listenerTargets = {
        scroll:    [ "mousewheel","DOMMouseScroll" ],
        key:       [ 38,40 ]
    };
    for (let i = 0; i < Object.keys(listenerTargets).length; i++) {
        const currentObj = Object.keys(listenerTargets)[i],
              currentObjItem = listenerTargets[currentObj];
        if ( currentObj === "scroll") {
            currentObjItem.forEach(function(current) {
                document.addEventListener(current, function(event) {
                    if (event.deltaY > 0) {
                        const scrollDirection = 0;
                        scrollToSection(scrollDirection);
                    } else {
                        const scrollDirection = 1;
                        scrollToSection(scrollDirection);
                    }
                })
            })
        }
        if ( currentObj === "key") {
            document.addEventListener("keydown", function(event) {
                if (event.keyCode === 40 || event.key === "ArrowDown") {
                    const scrollDirection = 0;
                    scrollToSection(scrollDirection);
                };
                if (event.keyCode === 38 || event.key === "ArrowUp") {
                    const scrollDirection = 1;
                    scrollToSection(scrollDirection);
                };
            })
        }
    }
}
// init
(function init(){
    console.log('App Initialized')
    setupPopulators();
    setupListeners();
})();