let Page = {
        home: document.querySelector(".home"),
        experience: document.querySelector(".experience"),
        ondemand: document.querySelector(".ondemand"),
        scheduled: document.querySelector(".scheduled"),
        memberships: document.querySelector(".memberships")
    },
    DOM = {
        body: document.querySelector("body"),
        main: document.querySelector("main"),
        textTags: ["h1","h2","h3","h4","h5","p","img"],
        counter: ".section__counter",
        serviceBanner: ".service__banner",
        serviceBannerItem: document.querySelectorAll(".service__banner--item"),
        bgMedia: document.querySelector(".section__bg--media")
    },
    navDOM = {
        nav: document.querySelector(".header__nav"),
        logo: document.querySelector(".nav__logo"),
        mobile: document.querySelector(".nav__mobile"),
        mainText: Array.from(document.querySelectorAll(".nav__main p")),
        subText: Array.from(document.querySelectorAll(".nav__sub .text")),
        subButton: document.querySelector(".nav__sub .button")
    };
let counter = document.querySelector(DOM.counter),
    sections = Array.from(document.querySelectorAll("section")),
    totalSections = sections.length,
    viewportWidth = window.innerWidth || document.documentElement.clientWidth,
    time = 1500,
    running = false,
    intRunning = false,
    wipeRunning = false,
    pinRunning = false;
/////////////////////////////////////////
/////////////////////////////////////////
// Helper variables /////////////////////
const delay = (n)=> {                                               // timeout function for async functions -- returns Promise
    n = n || 2000;                                                      // declare a default for number to be used for timeout
    return new Promise(done => {                                        // return the promise to origin function
        setTimeout(() => {                                                  // setTimeout
            done();                                                             // call the done() function (can be expanded using simple if's)
        }, n)                                                               // remember that time we set earlier?
    });
},
randomNumber = ()=> {                                               // random number generator -- returns Number
    var precision = 100;
    return ( Math.floor( Math.random() * (20 * precision - 1 * precision) + 1 * precision) / (1 * precision ) )
},
isOpenScrolling = ()=> {                                            // tests whether scroll-lock is turned off -- returns Bool
    return DOM.main.hasAttribute("open-scroll")                             // if DOM body has `open-scroll` attribute if truthy
},
isInViewport = (targetEl)=> {                                       // tests whether a DOM node is in the viewport -- returns Bool
    const rect = targetEl.getBoundingClientRect(),                                          // get element position using ClientRect
          windowHeight = (window.innerHeight                                                // get the window height
            || document.documentElement.clientHeight                                            // if not support, get client height
          ),     
          windowWidth = (window.innerWidth                                                  // get the window width
            || document.documentElement.clientWidth                                             // if not support, get client width
          );
    if (isOpenScrolling()) {                                                                // if is open scrolling is enabled
        return ( ((rect.height/5) * 3.5) >= rect.top )                                          // return if element is set space before top of viewport
    }                                                                                       // end if
    return (                                                                                // return truthy or falsy
        (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0)                           // if targetEl top is less than window height
        &&                                                                                      // both must be passed
        (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0)                           // if targetEl left is less than window width 
    );
},
getTargetYpoint = (targetEl)=> {                                    // get the current y point value for an element -- return Number
    return window.scrollY + targetEl.getBoundingClientRect().y                  // returns target DOM nodes Y position on page
},
getScrollDirection = (event)=> {                                    // get the direction user is scrolling in -- returns Number
    let scrollDirection;                                                        // declare the scroll direction to return it later
    if (event.deltaY > 0) {                                                     // tests if users delta value is positive
        scrollDirection = 0                                                         // target going down - declares 0
    } else {                                                                    // if delta is negative
        scrollDirection = 1                                                         // target going up - declares 1
    };                                                                          // end if
    if (event.type = "keydown") {                                               // if event type is key related
        if (event.keyCode === 40 || event.key === "ArrowDown") {                    // if arrow down
            scrollDirection = 0                                                         // target going down - declares 0
        } else if (event.keyCode === 38 || event.key === "ArrowUp") {               // if arrow up
            scrollDirection = 1                                                         // target going up - declare 1
        };                                                                          // end if
    };                                                                          // end if
    return scrollDirection                                                      // return the value of scroll (1 or 0)
},
getScrollSection = (dir)=> {                                        // get the next DOM node to scroll window to -- returns DOM node
    let targetEl;                                                                       // declare scoped var to return at end of function
    sections.forEach(function(current, index){                                          // loop through the sections on our page
        if (isInViewport(current) && current.classList.contains("isActive")) {              // if current section is in viewport and has isActive class
            const next = sections[index + 1],                                                   // declare section to scroll down to
                  prev = sections[index - 1];                                                   // declare section to scroll up to
            dir === 0 ? targetEl = next : targetEl = prev;                                      // if going down set var as section below // else set as seciton above
        }                                                                                   // end if
    });                                                                                 // end loop
    return targetEl;                                                                    // return the scoped variabled - which section were going to next
},
getActiveSection = ()=> {                                           // get DOM node that has `isActive` class -- returns DOM node
    let targetEl;                                                               // declare scoped variable to return
    sections.forEach(function(current){                                         // loop through the sections on our page
        if (current.classList.contains('isActive'))                                 // if current section has `isActive` class
            targetEl = current;                                                         // declare our scoped var as this element
    })                                                                          // end loop
    return targetEl                                                             // return the element (scoped variable)
},
buildInteraction = (el, int)=> {                                    // function to build an interaction object -- returns Object
    return {                                                                // return these variables as an object
        target: el,                                                             // DOM element targetted
        interaction: int                                                        // name of the interaction to be fired
    }                                                                       // end return
},
getInteraction = (targetEl)=> {                                     // get the interaction from the given DOM node -- returns Object
    let targetElData, targetInteraction, currTarget, currInt;               // declare globally to be used in return
    if (!Array.isArray(targetEl)) {                                         // if targetEl is not an array
        targetElData = targetEl.dataset.interaction;                            // get target data-set
        if (targetElData) {                                                     // if targetEl has a data-set
            targetElData.indexOf(' ') === -1 ?                                      // test for white-space
                targetInteraction = [ targetElData ] :                                  // if has whitespace split into an array 
                targetInteraction =  targetElData.split(" ")                            // convert to Array for forEach
            targetInteraction.forEach(function(current){                            // loop interaction to set variables for return
                currTarget = targetEl,                                                  // set currTarget
                currInt = current                                                       // set currInt = current iteration
            });                                                                     // end loop
        };                                                                      // end if
    } else {                                                                // if targetEl is an array
        targetEl.forEach(function(current){                                     // loop targets to set variables for return
            currTarget = current,                                                   // currtarget = current ieration
            currInt = current.dataset.interaction                                   // set currInt
        });                                                                     // end loop
    };                                                                      // end if
    return buildInteraction( currTarget, currInt )               // build an object from variables and return it
},
parseArrForClass = (targetArr, className)=> {                       // parses given array for given class name -- return DOM node
    let targetEl;                                                               // declare scoped variable to return at end of function
    targetArr.forEach(function(current){                                        // loop through our given array of DOM nodes
        if (current.classList.contains(className))                                  // if current node has given class name
            targetEl = current;                                                         // set current node as target element ot be returned
    })                                                                          // end loop
    return targetEl                                                             // return our element
};
/////////////////////////////////////////
/////////////////////////////////////////
// Helper functions /////////////////////
function setEqualHeight(targetEl) {                                 // set each element in Array to have the same height (tallest of them)
    // console.log("setEqualHeight")
    let itemHeight = targetEl[0].offsetHeight;                                  // set the global variable as the first elements height
    targetEl.forEach(function(current){                                         // loop through the array to get the greatest height of all elements
        if (current.offsetHeight > itemHeight)                                      // if current element height is greater than global variables height
            itemHeight = current.offsetHeight                                           // if it is, set the initial global variable as this height
    });                                                                         // end the loop so we can add the height to each element
    targetEl.forEach(function(current){                                         // loop through array to apply the greatest height found
        current.setAttribute("height",itemHeight + "px")
        current.style.height = itemHeight + "px";                                   // add the height as a CSS style to DOM node
    });                                                                         // end the loop
}
function toggleClassName(className, target1, target2) {             // remove and add (respectively) a given class name to DOM nodes
    // console.log("toggleClassName")
    target1.classList.remove(className);                                        // remove class from first element given
    target2.classList.add(className);                                           // add class to section element given
}
function changeClassOnScroll(targetEl) {                            // change class of a DOM node when section changes
    // console.log("changeClassOnScroll")
    if (!isOpenScrolling()) {                                                           // if open-scrolling is enabled
        if (targetEl.classList.contains("light")) {                                         // tests if target node has `light` class
            counter.classList.add("dark")                                                       // add `dark` class to breadcrumb counter
        } else {                                                                            // if it does not
            if (counter.classList.contains("dark"))
                counter.classList.remove("dark");                                                    // remove `dark` class from counter
        };                                                                                  // END IF
        toggleClassName(                                                                    // toggle active state for counter
            "active",                                                                           // toggle `active` class
            counter.querySelector("div.active"),                                                // remove it from currently `active` item
            counter.querySelector(`div[id="${targetEl.id.split("section")[1]}"`)                // add it to our new element that matched target nodes id
        );                                                                                  // end toggle
    };                                                                                  // end if
    if (!targetEl.classList.contains("isActive")) {                                     // if target node does not have `isActive` class name
        toggleClassName(                                                                    // toggle active state for sections
            "isActive",                                                                         // toggle `isActive` class
            document.querySelector(".isActive"),                                                // remove it from current `isActive` item
            targetEl                                                                            // add it to target DOM node
        );                                                                                  // end toggle
    }                                                                                   // end if
}
function lockViewport(targetEl=false,time=1000) {                   // locks the scrolling of page for period of time
    // console.log("lockViewport")
    disableScroll();
    setTimeout(function() {
        setupListeners();
        if (targetEl && !targetEl.classList.contains("pinFiring")) {
            enableScroll();
        }
    }, time);
}
function scrolltoYPoint(targetEl, dur=1) {                          // move to the given DOM node 
    // console.log("scrolltoYPoint")
    const yValue = getTargetYpoint(targetEl);                               // get the y value we need to scroll to
    TweenLite.to(                                                           // tween to the next section
        window, {                                                               // target the window to scroll without bs
            duration: dur,                                                      // set the duration | default is 1s
            scrollTo: {                                                         // scrollTo function for GSAP
                y: yValue                                                           // get the Y coordinate = current window Y value + targetEl Y value
            },
            ease:"expo.out"                                                     // ease function for scrolling (can be a number too)
        }
    );
}
function clearDOMchanges(targetEl) {                                // remove certain attributes from DOM nodes in Array or given element
    // console.log("clearDOMchanges")
    if (typeof targetEl !== "undefined") {
        const removeStyle = (targetEl)=> {                                     // DRY
            if (targetEl.hasAttribute("style"))                     // if the currently element has style attribute
                targetEl.removeAttribute("style");                                  // remove that attribute on current element
            if (targetEl.hasAttribute("height")) 
                targetEl.style.height = targetEl.getAttribute("height");
        };
        if (targetEl) {
            let currTarget = targetEl;
            if (currTarget === Object(currTarget)) {
                // currTarget = Array.from(currTarget);
            };
            if (Array.isArray(currTarget)) {                          // if targetEl is an array 
                currTarget.forEach(function(current){                   // forEach on the array
                    removeStyle(current);                                   // remove styles from element
                });
            } else {
                removeStyle(currTarget);
            };
        }
    }
}