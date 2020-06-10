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
        };
    }
}
function parallaxItem(targetEl) {                                       // setup function for parallax interaction on element
    // console.log("parallaxItem")
    if (viewportWidth > 900) {
        const intensity = (Math.random() * (50 - 25) + 25) / 350;                       // get our desired intensity based on random # between two values
        fireParallax = ()=> {                                                           // our callback function for the listener
            let currTarget = targetEl;
            // console.log(currTarget)
            sections.forEach(function(current){
                if (targetEl === current) {
                    const currBgDOM = current.querySelector(".section__bg--media");
                    if (currBgDOM.hasAttribute("style")) {
                        currBgDOM.parentElement.style.overflow = "hidden";
                        currBgDOM.style.width = "150%";
                        currBgDOM.style.marginLeft = "-50%";
                    };
                    currTarget = currBgDOM;
                };
            });
            parallaxInteraction(currTarget, intensity);                                       // call our parallax function here with arguments
        };
        if (!targetEl.hasAttribute("listening")) {                                      // if the listener hasn't been attached - `listening` attribute not present
            targetEl.setAttribute("listening",'');                                          // add `listening` attribute to DOM node
            scrollTypes.forEach(function(current){                                          // loop through all scroll types were targeting
                window.addEventListener(                                                        // add our event listener
                    current,                                                                        // target the current scroll type
                    fireParallax                                                                    // fire our callback
                )                                                                               // end listener
            });                                                                             // end loop
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
            intRunning = true;                                                          // turn running to true so last line with return falsy
            const pinned = targetEl.querySelector(".pinned"),                           // get pin container DOM node
                  pinnedInner = Array.from(pinned.children);                            // build an array of interal pin items
            pinListener(targetEl);                                                      // setup event listeners for control later                                     
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
// Interaction controllers //////////////
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
            lockViewport( false, time );                                            // lock the viewport first-thing
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
// Initializers /////////////////////////
function setupListeners() {                                             // initial setup for event listeners on page
    // console.log("setupListeners")
    const listenerTargets = {
        scroll:    scrollTypes,
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
        };
        keyFunc = (event)=> {
            if (event.keyCode === 40 || event.key === "ArrowDown") {
                scrollDirection = 0;
                scrollController(scrollDirection);
            };
            if (event.keyCode === 38 || event.key === "ArrowUp") {
                scrollDirection = 1;
                scrollController(scrollDirection);
            };
        };
        if ( currentObj === "scroll") {
            currentObjItem.forEach(function(current) {
                window.addEventListener(current, scrollFunc, false);
            });
        } else if ( currentObj === "key") {
            window.addEventListener("keydown", keyFunc, false);
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