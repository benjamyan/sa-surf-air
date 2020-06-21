/////////////////////////////////////////
/////////////////////////////////////////
// Navigation interactions //////////////
headerMenuActive = ()=> {                                           // activates header navigation on scroll
    if (window.scrollY > 149 ) {                                                         // if window Y coordinates are greater than 1
        if (!navDOM.nav.classList.contains("active")) {                                     // if nav does not have active class
            navDOM.nav.classList.add("active");                                                 // add the active class to nav DOM
        };                                                  
    } else {                                                                            // if user is at top of window (Y coor. is 99 or less)
        navDOM.nav.classList.remove("active");                                              // remove the active class from the DOM
    };
}
headerMobileToggle = (event)=> {                                    // mobile navigation interactions
    const fadeTargets = Array.from(
            navDOM.mainText.concat(navDOM.subText, navDOM.subButton)
          ),
          fadeBlurEffect = document.querySelector(".header__nav .blur"),
          tl = gsap.timeline();
    if (!navDOM.nav.classList.contains("open")) {
        navDOM.nav.classList.add("open");
        console.log(fadeBlurEffect)
        fadeTargets.forEach(function(current){
            current.style.opacity = 0;
            current.style.transform = "translateY(50px)"
        })
        fadeBlurEffect.style.opacity = 0;
        tl.to( fadeBlurEffect, {
            duration: 1,
            opacity: 1,
            ease: "expo.out",
            onComplete: clearDOMchanges,
            onCompleteParams: [ fadeBlurEffect ]
        }).to( fadeTargets, {
            delay: 0.1,
            duration: 1,
            stagger: 0.15,
            opacity: 1,
            translateY: 0,
            ease:"expo.out",
            onComplete: clearDOMchanges,
            onCompleteParams: [ fadeTargets ] 
        }, "-=0.9")
    } else {
        const removeClass = ()=> navDOM.nav.classList.remove("open");
        tl.to( fadeTargets, {
            delay: 0,
            duration: 1,
            stagger: 0.1,
            opacity: 0,
            translateY: 50,
            ease:"expo.out",
            onComplete: removeClass
        }).to( fadeBlurEffect, {
            delay: 0,
            duration: 1,
            opacity: 0,
            ease: "expo.out"
        }, "-=1" )
    }
}
showCounter = (targetEl)=> {                                        // show the current breadcrumb counter spot on page
    const targetIdNum = targetEl.id.split("section")[1],
          targetCounter = document.querySelector(`${DOM.counter} div[id="${targetIdNum}"]`),
          targetCounterText = targetCounter.querySelector('p');
    targetCounterText.style.opacity = '1';
    setTimeout(function(){
        targetCounterText.style.opacity = '0';
    }, time)
}
/////////////////////////////////////////
/////////////////////////////////////////
// Section pinning //////////////////////
pinScroller = (targetEl, event)=> {                                 // scrolling functionality for the pinnned section
    return (function() {
        if (!pinRunning) {
            pinRunning = true;
            const pinned = targetEl.querySelector(".pinned"),
                  pinnedItems = Array.from(pinned.children),
                  pinnedCurrent = parseArrForClass(pinnedItems, "visible"),
                  direction = getScrollDirection(event);
            if (direction === 1) {
                if (pinned.classList.contains("viewed") 
                    && pinnedItems[pinnedItems.length-1].classList.contains("visible")) {
                    pinned.classList.remove("viewed")
                };
                if (!pinnedItems[0].classList.contains("visible")) {
                    const prev = pinnedCurrent.previousElementSibling;
                    pinInteraction(pinnedCurrent, prev)
                    if (!pinned.classList.contains("viewed"))
                        toggleClassName("visible", pinnedCurrent, prev)
                } else {
                    document.querySelector(".visible").classList.remove("visible")
                    pinned.classList.remove("viewed")
                    pinCleaner(direction);
                }
            };
            if (direction === 0) {
                if (!pinnedItems[pinnedItems.length-1].classList.contains("visible")) {
                    const next = pinnedCurrent.nextElementSibling;
                    pinInteraction(pinnedCurrent, next)
                    toggleClassName("visible", pinnedCurrent, next)
                } else {
                    pinned.classList.add("viewed")
                    pinCleaner(direction);
                }
            };
            setTimeout(function(){
                pinRunning = false;
            },time );
        }
    })()
}
pinInteraction = (targetEl, nextTarget)=> {                         // function responsive for DOM based interactions
    const targetElTags = Array.from(targetEl.children);
    targetElTags.forEach(function(current){
        if (current.tagName === 'H1') numberTransition(current, nextTarget);
        if (current.tagName !== 'H1') textTransition(current, nextTarget);
    });
}
pinCleaner = (direction=false, isBarba=0)=> {                       // break out of pinning section 
    console.log("pinCleaner")
    let targetEl = getScrollSection(direction),
        pinFiringDOM = document.querySelector(".pinFiring");
    if (direction === 1) {
        targetEl = pinFiringDOM.previousElementSibling;
    } else {
        targetEl = pinFiringDOM.nextElementSibling;
    };
    if (pinFiringDOM) {
        pinFiringDOM.classList.remove("pinFiring");
    };
    if (isBarba === 0) {
        scrolltoYPoint(targetEl);
        changeClassOnScroll(targetEl);
        interactionController(targetEl);
        showCounter(targetEl);
    }
    scrollTypes.forEach(function(current){
        window.removeEventListener(current, onPinEvent, false);
    })
    window.removeEventListener("keydown", onPinEvent, false);
    setTimeout(function(){
        running = false;
    },time);
}
/////////////////////////////////////////
/////////////////////////////////////////
// Section wipes ////////////////////////
wipeInteraction = (targetEl)=> {
    // console.log("wipeInteraction");
    const wipeAnimation = new TimelineMax();
    wipeAnimation.fromTo(targetEl, 1, {duration: 2, y: "100%"}, {y: "0%", ease:"expo.out"}) // in from top
}
/////////////////////////////////////////
/////////////////////////////////////////
// Slider element ///////////////////////
carouselInteraction = (targetEl)=> {
    //
}
carouselSlider = (targetEl)=> {
    // console.log("carouselSlider");
}
testimonialChange = (targetEl)=> {
    // console.log("testimonialChange"); 
}
testimonialInteraction = (targetEl)=> {
    console.log("testimonialInteraction");
    const tl = gsap.timeline();
    const currSlider = targetEl.closest(".slider"),
          currSliderItem = currSlider.querySelector(".slider-item.visible"),
          nextSliderItem = currSlider.querySelector(`#slide${targetEl.id}`);
    const currNav = currSlider.querySelector(".slider-nav"),
          currNavVisible = parseArrForClass(Array.from(currNav.children), "visible"); 
    const currTarget = new Array,
          nextTarget = new Array;
    let i;
    const currTextItem = Array.from(currSliderItem.querySelectorAll(".split-line"));
    for (i = 0; i < currTextItem.length; i++) {
        currTarget.push(currTextItem[i])
    };
    const nextTextItem = Array.from(nextSliderItem.querySelectorAll(".split-line"));
    for (i = 0; i < nextTextItem.length; i++) {
        nextTarget.push(nextTextItem[i])
    };
    toggleClasses = ()=> {
        currSliderItem.classList.remove("changing");
        toggleClassName( "visible", currNavVisible, targetEl );
        toggleClassName( "visible", currSliderItem, nextSliderItem );
    };
    console.log(currSliderItem)
    currSliderItem.classList.add("changing")
    tl.from( currSliderItem,{
        duration: 0,
        opacity: 1
    }).to( currSliderItem, {
        delay: 1,
        duration: 1,
        opacity: 0,
        ease: "expo.out"
    }).to( nextSliderItem.querySelector("img"), {
        duration: 0,
        opacity: 0,
        translateY: -15
    }, "-=1").to( currTarget, {
        delay: 0,
        stagger: 0.175,
        duration: .25,
        translateY: -15,
        opacity: 0,
        ease: "expo.out"
    }, "-=-1").to(currSliderItem.querySelector("p sub"), {
        delay: 0,
        duration: 1,
        opacity: 0,
        ease: "expo.out",
        onStart: toggleClasses,
        onComplete: clearDOMchanges,
        onCompleteParams: [ currSliderItem.querySelector("p sub") ]
    }, "-=2").to(currSliderItem.querySelector("img"),{
        delay: 0,
        duration: 1,
        opacity: 0,
        translateY: 25,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [ currSliderItem.querySelector("img") ]
    }, "-=2").from( nextSliderItem.querySelector("img"), {
        duration: 0,
        opacity: 0
    }, "-=2").from( nextSliderItem,{
        duration: 0,
        opacity: 0
    }, "-=2").to( nextSliderItem, {
        duration: 1,
        opacity: 1,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [ nextSliderItem ]
    }, "-=2").to( nextTarget, {
        duration: 0,
        opacity: 0,
        translateY: 25
    }, "-=2").to( nextTarget, {
        delay: 0.25,
        duration: 0.5,
        stagger: 0.175,
        opacity: 1,
        translateY: 0,
        ease: "expo.out"
    }, "-=2").to(nextSliderItem.querySelector("p sub"), {
        delay: 0,
        duration: 1,
        opacity: 1,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [ nextSliderItem.querySelector("p sub") ]
    }, "-=2").to(nextSliderItem.querySelector("img"), {
        duration: 1,
        opacity: 1,
        translateY: 0,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [ nextSliderItem.querySelector("img") ]
    }, "-=1");
}
testimonialSlider = (targetEl)=> {
    // console.log("testimonialSlider");
    return (function() {                                                                // base it off a closure so it doesnt fire inacturately
        if (!intRunning) {                                                              // if not alreayd running
            intRunning = true;                                                          // turn running to true so last line with return falsy
            const sliderItems = Array.from(targetEl.children),
                  sliderNav = targetEl.querySelector(".slider-nav"),
                  sliderNavItems = Array.from(sliderNav.children);
            sliderItems.forEach(function(current, index){
                if (current !== sliderNav) {
                    sliderItems.splice(index)
                };
            });
            console.log
            sliderNavItems.forEach(function(current){
                current.onclick = function() {
                    if (!current.classList.contains("visible")) {
                        testimonialInteraction(current);
                    }  
                };
            });
            setTimeout(function(){                                                      // set timeouet for throttle to end
                intRunning = false;                                                         // intRuning to false so the function can be fired again
            },time );                                                                   // end timeout
        }
    })()
    
}
sliderCleaner = (isBarba=0)=> {
    // console.log("sliderCleaner")
}
/////////////////////////////////////////
/////////////////////////////////////////
// Parallax element /////////////////////
parallaxCleaner = (isBarba=0)=> {
    console.log("parallaxCleaner")
    scrollTypes.forEach(function(current){                                          // loop through all scroll types were targeting
        window.removeEventListener(                                                        // remove our event listener
            current,                                                                        // target the current scroll type
            onParallaxEvent                                                                    // fire our callback
        )                                                                               // end listener
    });
}
parallaxInteraction = (targetEl, intensity)=> {
    // console.log("parallaxInteraction")
    targetEl.style.transform = "translateY(" + (window.pageYOffset * -intensity + "px") + ')';
}