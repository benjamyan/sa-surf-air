/////////////////////////////////////////
/////////////////////////////////////////
// Global events ////////////////////////
onPinEvent = (event)=> {                                                // declare our listener function early
    let targetEl = document.querySelector(".isActive");
    if (event.deltaY >= 0 || event.deltaY <= 0) {                           // if is a mouse event
        pinScroller(targetEl, event)                                            // fire controller
    };                                                                      // end if
    if (event.keyCode === 40 || event.key === "ArrowDown") {                // if is arrow up key
        pinScroller(targetEl, event)                                            // fire controller
    };                                                                      // end if
    if (event.keyCode === 38 || event.key === "ArrowUp") {                  // if is arrow down key
        pinScroller(targetEl, event)                                            // fire controller
    };                                                                      // end if
};
onParallaxEvent = (event)=> {                                           // our callback function for the listener
    // console.log("onParallaxEvent")
    const targetArr = Array.from(document.querySelectorAll("[data-interaction]"));
    targetArr.forEach(function(currTarget){ 
        let targetEl = currTarget;
        let targetIntesity = currTarget.getAttribute("parallax")
        if (!targetEl.hasAttribute("parallax")) {
            if (currTarget.dataset.interaction.includes("parallaxItem")) {
                const intensity = (Math.random() * (50 - 25) + 25) / 350;                       // get our desired intensity based on random # between two values
                let currTarget = targetEl;
                currTarget.setAttribute("parallax", intensity);                                           // add `listening` attribute to DOM node with our intensity to be called later
                /*sections.forEach(function(current){ // parallax function for BG images
                    if (targetEl === current) {
                        const currBgDOM = current.querySelector(".section__bg--media");
                        if (currBgDOM.hasAttribute("style")) {
                            currBgDOM.parentElement.style.overflow = "hidden";
                            currBgDOM.style.width = "150%";
                            currBgDOM.style.marginLeft = "-50%";
                        };
                        currTarget = currBgDOM;
                    };
                });*/
            }
        }
        parallaxInteraction(currTarget, targetIntesity);
    });
};
onKeyEvent = (event)=> {
    if (event.keyCode === 40 || event.key === "ArrowDown") {
        scrollDirection = 0;
        scrollController(scrollDirection);
    };
    if (event.keyCode === 38 || event.key === "ArrowUp") {
        scrollDirection = 1;
        scrollController(scrollDirection);
    };
};
onScrollEvent = (event)=> {
    if (event.deltaY > 0) scrollDirection = 0;
    else scrollDirection = 1;
    scrollController(scrollDirection);
};
/////////////////////////////////////////
/////////////////////////////////////////
// Interaction controllers //////////////
function sliderItem(targetEl) {
    // console.log("sliderItem")
    if (!targetEl.hasAttribute("fired")) {
        const targetSetup = targetEl.dataset.setup;
        if (targetSetup === "carousel") {
            carouselSlider(targetEl);
        };
        if (targetSetup === "testimonial") {
            testimonialSlider(targetEl);
            DOM.textTags.forEach(function(current){
                const targetArr = Array.from(targetEl.querySelectorAll(current));
                if (targetArr.length > 0) {
                    targetArr.forEach(function(currTarget){
                        if (currTarget.children) currTarget = currTarget.children[0];
                        $(currTarget).splitLines({
                            tag: '<div class="split-line" style="display:inline-block;">',
                            keepHtml: true
                        });
                    })
                }
            })
        };
    }
}
function parallaxItem(targetEl) {                                       // setup function for parallax interaction on element
    // console.log("parallaxItem")
    if (viewportWidth > 900) {
        if (!targetEl.hasAttribute("parallax")) {                         // if the listener hasn't been attached - `listening` attribute not present
            scrollTypes.forEach(function(current){                                          // loop through all scroll types were targeting
                window.addEventListener(                                                        // add our event listener
                    current,                                                                        // target the current scroll type
                    onParallaxEvent                                                                    // fire our callback
                )                                                                               // end listener
            });                                                                             // end loop
            // window.addEventListener("keydown", onParallaxEvent, false);
        };                                                                              // end if
    }
}
function sectionWipe(targetEl) {                                        // setup function for section wiping interaction
    // console.log("sectionWipe")
    const currInt = "wiped";                                                  // declare the current interaction
    if (targetEl.hasAttribute(currInt)) {                                     // if target node doesnt hasnt been fired - checks for attribute
        targetEl.setAttribute(currInt, '')                                      // add the attribute to target node 
        wipeInteraction(targetEl)                                               // fire the wiping interaction
    } else return                                                             // else end the function
}
function sectionPin(targetEl) {                                         // setup function for section pinning interaction
    // console.log("secitonPin")
    return (function() {                                                                // base it off a closure so it doesnt fire inacturately
        if (!intRunning) {                                                              // if not alreayd running
            // pinRunning = true;
            intRunning = true;                                                          // turn running to true so last line with return falsy
            const pinned = targetEl.querySelector(".pinned"),                           // get pin container DOM node
                  pinnedInner = Array.from(pinned.children);                            // build an array of interal pin items
            if (!targetEl.classList.contains("pinFiring")) {                            // if section does not have pinFirinf classs
                targetEl.classList.add("pinFiring");                                        // add pinFiring class so function doesn't repeat
                window.addEventListener("keydown", onPinEvent, false);                   // add listener for keydown events
                scrollTypes.forEach(function(current){                                      // loop through scrolling types
                    setTimeout(function(){                                                      // i dont know why this works but it throttles the listener correctly
                        window.addEventListener(current, onPinEvent, false)                      // add event listenere for current scroll event type
                    }, time)                                                                    // end timeout
                });                                                                         // end loop
            };                                                                           // end if
            if (!pinnedInner[pinnedInner.length-1].classList.contains("visible")) {     // if scrolling back into section from bottom (last item is visible)
                pinned.children[0].classList.add("visible");                                // if truthy add visible class to first element            
            };                                                                          // end if
            numCountUpAnimation(Array.from(targetEl.querySelectorAll(".visible h1")))   // call our number counting animation
            setTimeout(function(){                                                      // set timeouet for throttle to end
                intRunning = false;                                                         // intRuning to false so the function can be fired again
            },time );                                                                   // end timeout
        }
    })()
}
/////////////////////////////////////////
/////////////////////////////////////////
// Global controllers ///////////////////
function interactionController(targetEl) {                              // central controller for all interaction-related function
    const targetArr = Array.from(targetEl.querySelectorAll("[data-interaction]")),   // get all nodes with `data-interaction` attribute
          allTargets = [ targetEl, targetArr ],                                         // merge all elements to be targetted later
          sectionInterations = [];                                                      // declare new array to store our interaction objects
    allTargets.forEach(function(current){                                               // build an array of interactions to be fired later
        if (!Array.isArray(current)) {                                                  // if current is not an array object
            sectionInterations.push(getInteraction(current));                               // push current to new array
        } else {                                                                        // if current is an array
            current.forEach(function(currTarget) {                                          // run this array through a looop to target each node
                sectionInterations.push(getInteraction(currTarget));                            // push the current node to new array
            });
        };
    });
    sectionInterations.forEach(function(current, index) {                            // fire all interactions inside of array previously build (44)
        if (typeof current.interaction !== "undefined") {                               // if current has an interaction
            if (isOpenScrolling()) {                                                        // if scroll-lock is disabled
                if (!current.target.hasAttribute("fired")) {                                    // if current does not have `fired` attribute (this is how we dont fire multiple instances of one interaction)
                    current.target.setAttribute("fired",'')                                         // add `fixed` attribute to current element
                } else {                                                                         
                    return;                                                                     // else end and exit function
                }
            };
            const newFunc = eval(current.interaction);                 // Evil EVAL! Reformat this using `new Function`
            if (current.interaction === "fadeElIn") {                  // if element has fadeElIn data-interaction 
                current.target.style.opacity = 0;                          // set the opactity to 0 for smooth transition
            };
            if (current.interaction === "parallaxItem") {
                return;
            }
            setTimeout(function(){                                     // timeout fire the function on a stagger
                newFunc(current.target);                               // call the new function
            }, (index * 200) );                                          // this will stagger the interactions if need-be
        }
    });
}
function counterController(targetEl) {                                  // central controller for breadcrumb-counter click events
    if (document.querySelector(".pinFiring")) {                             // if `pinFiring` class exists in target DOM node
        running = false;                                                        // set running to false
        pinCleaner(false);                                                      // clean up the listeners from pining function
    };                                                                      // end if
    return (function() {                                                    // return function for throttle
        if (!running) {                                                         // if function isnt firing already
            running = true;                                                         // set running to `true` - throttles this function so it can only fire once
            lockViewport( targetEl, time );                                            // lock the viewport first-thing
            if (document.querySelector(".isActive")) {                              // if isActive exists (DOM check)
                changeClassOnScroll(targetEl);                                          // change the isActive class
                showCounter(targetEl);                                                  // show the counter interaction
                scrolltoYPoint(document.querySelector(".isActive"));                    // scroll to the new isActive class
                interactionController(targetEl);                                        // fire interactions from new section
                setTimeout(function(){                                                  // timeout to fire function
                    headerMenuActive();                                                     // test for navigation changes
                }, time / 3 );                                                          // end timeout
                setTimeout(function() {                                                 // timeout to function finish
                    running = false;                                                        // set running = `false` so function can fired again
                }, time );                                                              // end timeout
            } else running = false;                                                 // if isActive does not exist end throttle
        }                                                                       // end if
    })()                                                                    // end return
}
function scrollController(dir) {                                        // central controller for all scroll events
    let targetEl;                                                           // declare our target element for the function
    /*if (viewportWidth < 1024) {                                             // if viewport width is below ipad landscape
        targetEl = getScrollSection(dir)                                        // declare our target as usual
        if (viewportWidth > 768) {                                              // if viewport width is greater than ipad vertical
            changeClassOnScroll(targetEl);                                          // change the current class of active section
        } else return                                                           // else stop firing
    } else {*/                                                                // if viewport width is above ipad landscape
        return (function() {                                                    // start our throttle
            if (!running) {                                                         // if throttle is not running
                running = true;                                                         // start our throttle - stops it from running again
                targetEl = getScrollSection(dir);                                       // declare our target elemnet as next section
                if ( isOpenScrolling()) {                                               // if open-scrolling is enabled    
                    sections.forEach(function(current){                                         // loop through our page sections
                        if (isInViewport(current)) targetEl = current;                              // if is in the viewport declare it as target
                    });                                                                         // end loop
                    if (targetEl && !targetEl.classList.contains("isActive")) {                 // if target exists and it doesnt have class `isActive`
                        sections.forEach(function(current){                                         // loop through our sections again
                            if (isInViewport(current)) {                                                // if current section is still in viewport
                                changeClassOnScroll(current);                                               // change the class
                                interactionController(current);                                             // fire section interactions
                            }                                                                           // end if
                        });                                                                         // end loop
                    };                                                                          // end if
                    setTimeout(function() {                                                     // timeout to throttle
                        headerMenuActive();                                                            // check is nav should be active
                        running = false;                                                            // end the throttle
                        return;                                                                     // end the function
                    }, time / 8);                                                               // end timeout
                } else if (targetEl) {                                                  // if isnt beginning or end of the document
                    lockViewport( targetEl, time );                                             // lock the viewport
                    scrolltoYPoint(targetEl);                                                   // scroll to the next section
                    showCounter(targetEl);                                                      // change coutner to reflect section change
                    changeClassOnScroll(targetEl);                                              // change class of active section
                    interactionController(targetEl);                                            // fire interactions of next section
                    setTimeout(function(){                                                      // timeout for our nav
                        headerMenuActive();                                                            // check if nav needs to change
                    }, time / 4);                                                               // end timeout
                    setTimeout(function() {                                                     // timeout for throttle
                        // const targetInt = targetEl.dataset.interaction;                             // declare our dataset interaction to test later
                        if (targetEl.classList.contains("sectionPin")) {                                     // if interaction includes sectionPin
                            running = true;                                                             // keep running true to stop function firing
                        } else {                                                                    // if none of thse interactions
                            running = false;                                                            // close the throttle
                        };                                                                          // end if
                    }, time );                                                                  // end timeout
                } else running = false;                                                 // else end the entire thing so it can run again
            }
        })()
    // }
}
/////////////////////////////////////////
/////////////////////////////////////////
// App initializers /////////////////////
function setupListeners() {                                             // initial setup for event listeners on page
    // console.log("setupListeners")
    const listenerTargets = {
        scroll:    scrollTypes,
        key:       [ 38,40 ]
    };
    for (let i = 0; i < Object.keys(listenerTargets).length; i++) {
        const currentObj = Object.keys(listenerTargets)[i],
              currentObjItem = listenerTargets[currentObj];
        if ( currentObj === "scroll") {
            currentObjItem.forEach(function(current) {
                window.addEventListener(current, onScrollEvent, false);
            });
        } else if ( currentObj === "key") {
            window.addEventListener("keydown", onKeyEvent, false);
        };
    }
}
function setupDOM(target) {                                             // initial setup of the DOM when page loads
    // console.log("setupDOM")
    let activeSection = sections[0],
        activeCounter = 1;
    activeSection.classList.add("isActive");                                    // add `isActive` class to DOM inside viewport
    (function setActiveSection() {                                              // start iife to set those variables ^^
        sections.forEach(function(current, index, arr){                             // loop through all sections on DOM
            current.id = `section${index + 1}`;                                     // set the id of each 
        });                                                                     // end loop
    })();
    (function setInteraction() {                                                // start iife to set up interactions on content load
        const parallaxEl = Array.from(document.querySelectorAll("[data-interaction]"))              // build an array from all data-interactions in DOM
        parallaxEl.forEach(function(current){                                                       // run through array ^^^
            const currInt = current.dataset.interaction.toString();                                     // declare our interaction as a string to be parsed
            if (currInt.includes("parallaxItem")) parallaxItem(current);                                // if includes `parallaxItem` in string
            if (currInt.includes("sliderItem")) sliderItem(current);
        });                                                                                         // end loop
    })();
    if (!isOpenScrolling()) {   
        let counterArr;
        counterArr = Array.from(counter.children)
        counterArr.forEach(function(current){                             // build an array from breadcrumb counter children elements and loop it
            if (current.id == activeCounter)                                                    // if the current child id is activeCounter 
                current.classList.add("active");                                                    // add active class to current child
            if (!current.classList.contains("active"))                                          // if the current element does not have active class
                fadeElOut(current.querySelector("p"), 1, 0.15, 1, false);                           // fire animation
            else                                                                                // if it does have active class
                fadeElOut(current.querySelector("p"), 1.25, false, 1.5, false);                     // fire slightly slower animation
        });
    };
    if (DOM.serviceBannerItem) {                                                // if we have service banner items (block-list items)
        setEqualHeight(Array.from(DOM.serviceBannerItem));                          // set there height equal to eachother
    };
}
function init(target=0){                                                // initializer for the setup of page
    // console.log("App Initialized");
    setupDOM(target);
    setupListeners();
}