const DOM = {
    counter: ".section__counter",
    serviceBanner: ".service__banner",
    serviceBannerItem: ".service__banner--item"
};
const counter = document.querySelector(DOM.counter),
      sections = Array.from(document.querySelectorAll("section")),
      totalSections = sections.length,
      viewportWidth = window.innerWidth || document.documentElement.clientWidth;
let running = false,
    pinned = false;


buildInteractionObj = (el, int)=> {         // function to build an interaction object
    return {                                // return these variables as an object
        target: el,                         // DOM element targetted
        interaction: int                    // name of the interaction to be fired
    }
}
getInteraction = (targetEl)=> {             // retrieve the interaction from the given DOM node
    let targetElData, targetInteraction, currTarget, currInt;
    if (!Array.isArray(targetEl)) {                                 // if targetEl is not an array
        targetElData = targetEl.dataset.interaction;                // get target data-set
        if (targetElData) {                                         // if targetEl has a data-set
            targetElData.indexOf(' ') === -1 ?                      // test for white-space
                targetInteraction = [ targetElData ] :              // split into an array if has whitespace
                targetInteraction =  targetElData.split(" ")        // convert to Array for forEach
            targetInteraction.forEach(function(current){            // set variables for return
                currTarget = targetEl,                              // set currTarget
                currInt = current                                   // set currInt = current iteration
            });
        }
    } else {                                                        // if targetEl is an array
        targetEl.forEach(function(current){                         // set variables for return
            currTarget = current,                                   // currtarget = current ieration
            currInt = current.dataset.interaction                   // set currInt
        });
    };
    return buildInteractionObj( currTarget, currInt )               // return the elements to build an object
}
setInteraction = (targetEl, num)=> {        // setup and fire an interaction of a given DOM node
    const newFunc = eval(targetEl.interaction);                 // No EVAL! Reformat this using `new Function`
    if (targetEl.interaction === "fadeElIn")                    // if element has fadeElIn data-interaction          
        targetEl.target.style.opacity = 0;                      // ^ set the opactityy to 0 for smooth transition
    setTimeout(function(){                                      // timeout fire the function on a stagger
        newFunc(targetEl.target);                               // call the new function
    }, (num * 200) );                                           // this will stagger the interactions if need-be
}
interactionController = (targetEl)=> {      // central controller for all interaction-related function
    const targetArr = Array.from(targetEl.querySelectorAll("[data-interaction]")),
          allTargets = [ targetEl, targetArr ],
          sectionInterations = [];
    allTargets.forEach(function(current){
        if (!Array.isArray(current)) {
            sectionInterations.push(getInteraction(current));
        } else {
            current.forEach(function(currTarget) {
                sectionInterations.push(getInteraction(currTarget));
            })
        };
    });
    sectionInterations.forEach(function(current, index) {
        if (typeof current.interaction !== "undefined") {
            setInteraction(current, index)
        }
    });
}


changeClassOnScroll = (targetEl)=> {        // change class of a DOM node when section changes
    if (targetEl.classList.contains("light")) {
        toggleClassName( 
            "dark", 
            document.querySelector(`${DOM.counter}`),
            document.querySelector(`${DOM.counter}`)
        );
    } else {
        document.querySelector(`${DOM.counter}`).classList.remove("dark")
    };
    // toggle state for the navigation
    if (targetEl === sections[0]) { 
        navDOM.nav.classList.remove("active");
    } else {
        setTimeout(function(){
            headerMenuActive();
        }, 100);
    };
    toggleClassName( // toggle active state for counter
        "active", 
        document.querySelector(`${DOM.counter} div.active`),
        document.querySelector(`${DOM.counter} div[id="${targetEl.id.split("section")[1]}"`)
    );
    toggleClassName( // toggle active state for sections
        "isActive", 
        document.querySelector(".isActive"), 
        targetEl
    );
}
getScrollSection = (dir)=> {                // get the next DOM node to move to
    let targetEl;
    sections.forEach(function(current, index){
        if (isInViewport(current)) {
            const next = sections[index + 1],
                  prev = sections[index - 1];
            dir === 0 ? targetEl = next : targetEl = prev;
        }
    });
    return targetEl;
}
scrolltoYPoint = (targetEl, dur=1)=> {      // move to the given DOM node 
    TweenLite.to( // tween to the next section
        window, {
            duration: dur,
            scrollTo: {
                y: (window.scrollY + targetEl.getBoundingClientRect().y)
            },
            ease:"expo.out"
        }
    );
}
showCounter = ()=> {
    //
}
counterController = (targetEl)=> {          // central controller breadcrumb-counter click events
    return (function() {
        if (!running) {
            let time = 1500;
            running = true;
            lockViewport( false, time );                                    // lock the viewport first-thing
            if (document.querySelector(".isActive")) {
                changeClassOnScroll(targetEl);
                scrolltoYPoint(document.querySelector(".isActive"));
                interactionController(targetEl);
                setTimeout(function() {
                    running = false;
                }, (time));
            }
        } 
    })()
}
scrollController = (dir)=> {                // central controller for all scroll events
    if (viewportWidth < 1024) {
        targetEl = getScrollSection(dir)
        changeClassOnScroll(targetEl);
    } else {
        return (function() {
            if (!running) {
                let time = 1500;
                running = true;
                lockViewport( false, time );                    // lock the viewport first-thing
                targetEl = getScrollSection(dir)
                if (targetEl) {                                 // if isnt beginning or end of the document
                    scrolltoYPoint(targetEl);
                    changeClassOnScroll(targetEl);
                    interactionController(targetEl);
                    if (!targetEl.classList.contains("sectionPin")) {
                        setTimeout(function() {
                            running = false;
                        }, time);
                    } else {
                        pinController(targetEl, dir)
                        pinned = true;
                        running = true;
                    }
                } else running = false;
            } else if (pinned) {
                //
            }
        })()
    }
}


function setupDOM() {                       // initial setup of the DOM when page loads
    let activeSection, activeCounter;                   //
    // scrolltoYPoint(sections[0], 0);
    headerMenuActive();
    sections.forEach(function(current, index){          //
        current.id = `section${index + 1}`;
        if (isInViewport(current)) {                    //
            activeSection = current;                    //
            activeCounter = index + 1;                  //
        } 
    });
    activeSection.classList.add("isActive");
    document.querySelector(`${DOM.counter} div[id="${activeCounter}"]`).classList.add("active");
    Array.from(counter.children).forEach(function(current){
        if (!current.classList.contains("active")) {
            fadeElOut(current.querySelector("p"), 1, 0.15, 1, false);
        } else {
            fadeElOut(current.querySelector("p"), 1.25, false, 1.5, false);
        }
    });
    interactionController(activeSection);
    if (document.querySelector(DOM.serviceBannerItem))
        setEqualHeight(Array.from(document.querySelectorAll(DOM.serviceBannerItem)));
}
function setupListeners() {
    const listenerTargets = {
        scroll:    [ "scroll", "onwheel", "wheel", "mousewheel", "onmousewheel","DOMMouseScroll", "touchstart", "touchmove", "touchend", "touchcancel" ],
        key:       [ 38,40 ]
    };
    for (let i = 0; i < Object.keys(listenerTargets).length; i++) {
        const currentObj = Object.keys(listenerTargets)[i],
              currentObjItem = listenerTargets[currentObj];
        let scrollDirection;
        scrollFunc = (event)=> {
            if (event.deltaY > 0) scrollDirection = 0;
            else scrollDirection = 1;
            scrollController(scrollDirection);
        }
        keyFunc = (event)=> {
            if (event.keyCode === 40 || event.key === "ArrowDown") {
                scrollDirection = 0;
                scrollController(scrollDirection);
            };
            if (event.keyCode === 38 || event.key === "ArrowUp") {
                scrollDirection = 1;
                scrollController(scrollDirection);
            };
        }
        if ( currentObj === "scroll") {
            currentObjItem.forEach(function(current) {
                window.addEventListener(current, scrollFunc, false)
            })
        };
        if ( currentObj === "key") {
            window.addEventListener("keydown", keyFunc, false)
        };
        // counter.addEventListener("mouseover", counterHover);
    }
}
// init
(function init(){
    console.log('App Initialized')
    setupDOM();
    setupListeners();
})();