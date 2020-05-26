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
fireInteractions = (targetEl)=> {
    const targetInteractions = Array.from(targetEl.querySelectorAll("[data-interaction]")),
          interaction = targetInteractions[0].dataset.interaction;
    console.log(targetInteractions)
    if (interaction === "fadeIn") fadeIn(targetInteractions)
}
scrollToSection = (dir)=> {
    if (viewportWidth < 1024) {
        return false;
    } else {
        let targetEl, 
            isActive = document.querySelector(".isActive")
            isFired = false;
        sections.forEach(function(current, index){
            if (isInViewport(current)) {
                const next = sections[index + 1],
                      prev = sections[index - 1];
                dir === 0 ? targetEl = next : targetEl = prev;
            }
        });
        if (isActive) isActive.classList.remove("isActive");
        lockViewport( document.querySelector("body") , 1000);
        lockViewport( document.querySelector("main") , 1000);
        targetEl.scrollIntoView({ 
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
        fireInteractions(targetEl)
        targetEl.classList.add("isActive")
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