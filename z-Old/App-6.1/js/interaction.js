navDOM = {
    nav: document.querySelector(".header__nav"),
    logo: document.querySelector(".nav__logo"),
    mobile: document.querySelector(".nav__mobile"),
    mainText: Array.from(document.querySelectorAll(".nav__main p")),
    subText: Array.from(document.querySelectorAll(".nav__sub .text")),
    subButton: document.querySelector(".nav__sub .button")
}
/////////////////////////////////////////
/////////////////////////////////////////
// helper functions for general tom-foolery
delay = (n)=> {
    n = n || 2000;
    return new Promise(done => {
        setTimeout(() => {
            done();
        }, n)
    });
}
headerMenuActive = ()=> {
    if (window.scrollY > 1) {
        navDOM.nav.classList.add("active");
    } else {
        navDOM.nav.classList.remove("active");
    } 
}
clearDOMchanges = (targetEl)=> {
    if (targetEl && Array.isArray(targetEl)) {
        targetEl.forEach(function(current){
            if (current && current.hasAttribute("style"))
                current.removeAttribute("style");
        });
    } else if (targetEl && targetEl.hasAttribute("style")) {
        
        targetEl.removeAttribute("style");
    }
}
lockViewport = (targetEl=false, time=1000)=> {
    const keys = {37: 1, 38: 1, 39: 1, 40: 1};
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
    var arrow_keys_handler = function(e) {
        switch(e.keyCode){
            case 37: case 39: case 38:  case 40: // Arrow keys
            case 32: e.preventDefault(); break; // Space
            default: break; // do not block other keys
        }
    };
    function disableScroll() {
        const wheelArr = [ "scroll", "onwheel", "wheel", "mousewheel", "onmousewheel","DOMMouseScroll", "touchstart", "touchmove", "touchend", "touchcancel" ];
        wheelArr.forEach(function(current) {
            window.removeEventListener(current, scrollFunc, false)
            window.removeEventListener(current, scrollFunc, wheelOpt)
        });
        window.removeEventListener("keydown", keyFunc, false)
        window.addEventListener("keydown", arrow_keys_handler, false);
        window.addEventListener('onwheel', preventDefault, false); // older FF
        window.addEventListener('onmousewheel', preventDefault, false); // older FF
        window.addEventListener('mousewheel', preventDefault, false); // older FF
        window.addEventListener("wheel", function(e){e.preventDefault();}, {passive: false} );
        window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
        window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.addEventListener('touchstart', preventDefault, wheelOpt); // track-pad + mobile
        window.addEventListener('touchmove', preventDefault, wheelOpt); // track-pad + mobile
        window.addEventListener('touchend', preventDefault, wheelOpt); // track-pad + mobile
        window.addEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    function enableScroll() {
        //window.removeEventListener("keydown", arrow_keys_handler, false);
        window.removeEventListener('onwheel', preventDefault, false); // older FF
        window.removeEventListener('onmousewheel', preventDefault, false); // older FF
        window.removeEventListener('mousewheel', preventDefault, false); // older FF
        window.removeEventListener("wheel", function(e){e.preventDefault();}, {passive: false} );
        window.removeEventListener('DOMMouseScroll', preventDefault, false); // older FF
        window.removeEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
        window.removeEventListener('touchstart', preventDefault, wheelOpt); // track-pad + mobile
        window.removeEventListener('touchmove', preventDefault, wheelOpt); // track-pad + mobile
        window.removeEventListener('touchend', preventDefault, wheelOpt); // track-pad + mobile
        window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
    }
    disableScroll()
    if (!targetEl) {
        setTimeout(function() {
            enableScroll()
            setupListeners();
        }, time);
    } else {
        enableScroll();
    }
}
setEqualHeight = (targetEl)=> {
    const itemHeight = targetEl[0].offsetHeight;
    targetEl.forEach(function(current, index){
        if (current.offsetHeight > itemHeight)
            itemHeight = current.offsetHeight
        current.style.height = itemHeight;
    })
}
isInViewport = (targetEl)=> {
    const rect = targetEl.getBoundingClientRect(),
          windowHeight = (window.innerHeight || document.documentElement.clientHeight),
          windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    return (
        (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0) 
        &&
        (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0)
    );
}
clearDOMchanges = (targetEl)=> {
    const targetArr = Array.from(navDOM.mainText.concat(navDOM.subText, navDOM.subButton))
    if (targetEl && Array.isArray(targetEl)) {
        targetArr.forEach(function(current){
            if (current && current.hasAttribute("style"))
                current.removeAttribute("style");
        })
    } else if (targetEl && targetEl.hasAttribute("style")) {
        targetEl.removeAttribute("style");
    };
}
toggleClassName = (className, target1, target2)=> {
    target1.classList.remove(className);
    target2.classList.add(className);
}
/////////////////////////////////////////
/////////////////////////////////////////
// scrollMagic scenes and related functions
function sectionWipe(targetEl) {
    console.log(targetEl)
    const wipeAnimation = new TimelineMax();
    if (targetEl.classList.contains("sectionWipe")) {
        targetEl.classList.add("sectionWipe")
        // wipeAnimation.fromTo(targetEl, 1, {duration: 2, y: "100%"}, {y: "0%", ease:"expo.out"}) // in from top
    } else return
}
function sectionScroller(targetEl) {
    var html = document.documentElement;
    var body = document.body;
    const scroll = [ "scroll", "onwheel", "wheel", "mousewheel", "onmousewheel","DOMMouseScroll", "touchstart", "touchmove", "touchend", "touchcancel" ];
    var scroller = {
        target: targetEl,
        ease: 0.05, // <= scroll speed
        endY: 0,
        y: 0,
        resizeRequest: 1,
        scrollRequest: 0,
    };
    var requestId = null;
    TweenLite.set(scroller.target, {
        rotation: 0.01,
        force3D: true
    });
    window.focus();
    // window.addEventListener("resize", onResize);
    scroll.forEach(function(current){
        document.addEventListener(current, onScroll);
    })
    // document.addEventListener("scroll", onScroll); 
    function updateScroller() {
        var resized = scroller.resizeRequest > 0;
        if (resized) {    
            var height = scroller.target.clientHeight;
            body.style.height = height + "px";
            scroller.resizeRequest = 0;
        }
        var scrollY = Math.round((window.scrollY + (event.deltaY * 5)) )/*window.pageYOffset || html.scrollTop || body.scrollTop || 0;*/
        scroller.endY = scrollY;
        scroller.y += (scrollY - scroller.y) * scroller.ease;
        if (Math.abs(scrollY - scroller.y) < 0.05 || resized) {
            scroller.y = scrollY;
            scroller.scrollRequest = 0;
        }
        TweenLite.set(scroller.target, { 
            y: -scroller.y 
        });
        requestId = scroller.scrollRequest > 0 ? requestAnimationFrame(updateScroller) : null;
    }
    function onScroll() {
        scroller.scrollRequest++;
        if (!requestId) {
            requestId = requestAnimationFrame(updateScroller);
        }
    }
}
function sectionPin(targetEl) {
    const target = targetEl.querySelector(".pinned").parentElement,
          scroll = [ "onwheel", "wheel", "mousewheel", "onmousewheel","DOMMouseScroll", "touchstart", "touchmove", "touchend", "touchcancel" ];
    target.classList.add("visible")
    scroll.forEach(function(current){
        function scrollPage(event){
            let scrollDir = event.deltaY > 0 ? 1 : 0;
            console.log(event)
            console.log(event.target.closest("pinned"))
            TweenLite.to( // tween to the next section
                event.target.closest("pinned"), {
                    duration: 2,
                    scrollTo: {
                        top: Math.round((window.scrollY + (event.deltaY * 3.5)) ),
                        ease: 1
                    }
                }
                /*window, {
                    duration: 2,
                    scrollTo: {
                        y: Math.round((window.scrollY + (event.deltaY * 3.5)) ),
                        ease: 1,
                    },
                    ease: 1
                }*/
            );
        };
        const time = 1000;
        console.log(document.querySelector("main").getBoundingClientRect())
        console.log(targetEl.querySelector(".pinned").children )
        if (targetEl.closest("section").getBoundingClientRect().top < window.scrollY) {
            lockViewport(false, time)
            targetEl.classList.add("pinFiring") 
            setTimeout(function(){
                document.addEventListener(current, scrollPage, false) 
            }, time)
            // 
        }
    })
}
function pinController(targetEl, dir) {
    /*scrolltoYPoint(targetEl);
    changeClassOnScroll(targetEl);
    interactionController(targetEl);*/
    smParallaxPinner($("#trigger1"),$("#trigger1"), 0, 100);
    setTimeout(function(){
        if (targetEl.closest("section").getBoundingClientRect().top < window.scrollY) {
            lockViewport()
            targetEl.classList.add("pinFiring") 
        }
    },1000)
}
function smParallaxPinner(trigger, target, hook, dur) {
    const controller = new ScrollMagic.Controller(),
          targetArr = Array.from(targetEl.querySelectorAll(".pinned__item"));
    const build = (function() {
        const scene = new ScrollMagic.Scene({
            triggerElement: $(trigger)[0],
            triggerHook: (hook),
            duration: (dur + '%')
        })
        .setPin( $(target)[0], { pushFollowers:true }).addTo(controller);
        $($(target)[0]).addClass("active");
    })();
    sectionPin(targetEl);
}
/////////////////////////////////////////
/////////////////////////////////////////
// GSAP custom functions for DOM interactions
function headerMobileToggle(event) {
    const fadeTargets = Array.from(navDOM.mainText.concat(navDOM.subText, navDOM.subButton)),
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
function counterHover(event) {
    const target = event.target.closest(".section__counter"),
          targetArr = Array.from(target.children);
    console.log(targetArr)
}
function panelSlideIn(targetEl) {
    //
}
function panelSlideOut(targetEl) {
    //
}
function fadeElIn(targetEl, del=.5, dur=1, stag=.15, offset=50) {
    const tl = gsap.timeline();
    tl.to( targetEl, { 
        duration: 0.1, 
        stagger: stag, 
        translateY: offset,
        opacity: 0,
        ease:"expo.out"
    }).to( targetEl, {
            delay: del,
            duration: dur,
            stagger: stag,
            opacity: 1,
            translateY: 0,
            ease:"expo.out"
        } );
}
function fadeElOut(targetEl, del=.5, stag=0.15, dur=1, offset=0) {
    const tl = gsap.timeline();
    tl.to( targetEl, { 
        delay: del, 
        duration: dur, 
        stagger: stag, 
        translateY: offset, 
        opacity: 0, 
        ease: "expo.out", 
    } );
}
function slideItemIn(event) {
    const targetEl = event.target.closest("[onclick]"),
          targetElHeight = targetEl.offsetHeight,
          detailsClose = targetEl.querySelector(".service__banner--item-close"),
          detailsDOM = targetEl.querySelector("details"),
          detailsDOMul = detailsDOM.querySelector("ul"),
          targetChildren = Array.from(targetEl.children),
          tl = gsap.timeline()
    if (targetEl.classList.contains("activeItem")) {
        slideItemOut(targetEl);
        return false;
    } else if (document.querySelector("[open]")) {
        slideItemOut(document.querySelector("[open]").closest("[onclick]"))
    }
    targetEl.classList.add("activeItem")
    targetEl.style.zIndex = 1000;
    targetChildren.forEach(function(current, index){
        if (current.classList.contains("blur"))
            targetChildren.splice(index, 1);
    })
    openDetails = ()=> {
        detailsDOM.setAttribute("open","")
    }
    tl.to( detailsClose, { 
        duration: .5,
        opacity: 1, 
        ease: "expo.out", 
        onComplete: openDetails
    })
    .to( detailsDOMul.children, {
        duration: 0.1,
        translateY: 25,
        stagger: 0.15,
        opacity: 0,
        ease:"expo.out"
    }, "-=.5" )
    .to( detailsDOM.querySelector("summary"), { 
        duration: .5, 
        height: 0,
        opacity: 0, 
        ease: "expo.out"
    }, "-=.6")
    .to( targetEl, {
        duration: 1, 
        height: targetEl.offsetHeight * 1.75, 
        ease:"expo.out", 
        zIndex: 1000
    }, "-=.5")
    .to ( detailsDOMul.children, {
        duration: 1,
        stagger: 0.15,
        opacity: 1,
        translateY: 0,
        ease:"expo.out"
    }, "-=.25" );
}
function slideItemOut(target) {
    const targetEl = target,
          targetActive = document.querySelector(".activeItem"),
          targetElInner = targetEl.querySelector(".service__banner--item-inner"),
          detailsDOM = targetEl.querySelector("details"),
          detailsClose = targetEl.querySelector(".service__banner--item-close"),
          targetChildren = Array.from(targetEl.children),
          detailsDOMul = detailsDOM.querySelector("ul"),
          tl = gsap.timeline();
    if (targetActive)
        targetActive.classList.remove("activeItem");
    closeDetails = ()=> {
        detailsDOM.removeAttribute("open")
    };
    clearDOMchanges = ()=> {
        if (detailsClose.hasAttribute("style"))
            detailsClose.removeAttribute("style");
        if (targetElInner && targetElInner.hasAttribute("style"))   
            targetElInner.removeAttribute("style");
    };
    targetChildren.forEach(function(current, index){
        if (current.classList.contains("blur")) targetChildren.splice(index, 1)
    });
    tl.to (detailsDOMul.children, {
        duration: 1,
        stagger: 0.15,
        opacity: 0,
        translateY: 0,
        ease:"expo.out",
        onComplete: closeDetails
    })
        .to(targetEl, {
            duration: 1,
            height: targetEl.offsetHeight / 1.75,
            ease: "expo.out",
            onComplete: clearDOMchanges
        }, "-=1" )
        .to(detailsDOM.querySelector("summary"), {
            duration: .5,
            display: "block",
            opacity: 1,
            ease: "expo.out",
        }, "-=1" )
        .to(detailsClose, {
            duration: .5,
            opacity: 0,
            ease: "expo.out"
        }, "-=1" )
        .to(targetChildren, {
            duration: .5,
            translateY: 0,
            opacity: 1,
            ease: "expo.out",
            onComplete: clearDOMchanges
        }, "-=.5" )
}
/////////////////////////////////////////
/////////////////////////////////////////
// barba and related page functions
function pageContentOutro() {
    const targetEl = document.querySelector("section"),
          tl = gsap.timeline();
    tl.to('section', { duration:.5, translateX:50, opacity:0 })
}
function headerNavigationIntro() {
    console.log("headerNavigationIntro")
    const tl = gsap.timeline();
    tl.from( navDOM.logo, {
        delay:1,
        duration:2,
        translateY:-50 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [navDOM.logo]
    } )
    .from ( navDOM.mobile, {
        duration:1,
        translateY:-50 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [navDOM.mobile]
    }, "-=2" )
    .from( navDOM.subButton, {
        delay:0,
        stagger:.075,
        duration:1,
        translateY:-50 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [navDOM.subButton]
    }, "-=2" )
    .from( navDOM.mainText, { 
        delay:0.05,
        stagger:.075,
        duration:1,
        translateY:20 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [navDOM.mainText]
    }, "-=2" )
    .from( navDOM.subText, {
        delay:0.25,
        stagger:.075,
        duration:1,
        translateY:20 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [navDOM.subText]
    }, "-=2" );
}
function headerNavigationOutro() {
    console.log("headerNavigationOutro")
}
function counterNavigationIntro() {
    console.log("counterNavigationIntro")
}
function counterNavigationOutro() {
    console.log("counterNavigationOutro")
}
function frostedGlassIntro() {
    const targetEl = document.querySelector("section"),
          targetDOM = {
              h1: targetEl.querySelector(".section__content--item h1"),
              h2: targetEl.querySelector(".section__content--item h2"),
              h3: targetEl.querySelector(".section__content--item h3"),
              h4: targetEl.querySelector(".section__content--item h4"),
              h5: targetEl.querySelector(".section__content--item h5"),
              p: targetEl.querySelector(".section__content--item p"),
              button: targetEl.querySelector(".section__content--button"),
              blur: targetEl.querySelector(".blur"),
              bg: targetEl.querySelector(".section__bg")
          },
          textInteraction = (target, del, dur, trans, ease, pos)=> {
            const originalText = target.innerHTML,
                  innerSpan = document.createElement("span"),
                  spanHeight = target.offsetHeight,
                  innerSpanStyles = "position:absolute; left:0; right:0; text-align:center;",
                  spanParentStyles = `height:${spanHeight}px; position:relative; overflow:hidden; width:100%;`,
                  clearText = ()=> {
                    target.innerHTML = '';
                    target.appendChild(innerSpan);
                  },
                  buildSpan = ()=> {
                    innerSpan.innerHTML += originalText;
                    innerSpan.style.cssText = innerSpanStyles;
                    innerSpan.parentElement.style.cssText = spanParentStyles;
                  },
                  clearSpanAndStyles = function() {
                    target.removeAttribute("style");
                    target.innerHTML = originalText;
                  };
            clearText(), buildSpan();
            tl.from( 
                target.children, 
                { 
                    delay: del,
                    duration: dur,
                    translateY: trans/*spanHeight + 1*/,
                    opacity: 0,
                    ease: ease,
                    onComplete: clearSpanAndStyles
                }, pos
            );
          },
          wipeChanges = ()=> {
            (targetDOM.blur).parentElement.removeChild(targetDOM.blur);
            (targetDOM.bg).removeAttribute("style");
          },
          tl = gsap.timeline({ onComplete:wipeChanges });
    tl.from(targetDOM.bg, { duration:2, opacity:0, scale:1.2 })
      .to(targetDOM.blur, { duration:.5, opacity:0 }, "-=2");
    if (targetDOM.h1) textInteraction(targetDOM.h1, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h2) textInteraction(targetDOM.h2, 0.5, 1.5, 25, "expo.out", "-=1.25");
    if (targetDOM.h3) textInteraction(targetDOM.h3, 0.45, 1.65, 25, "expo.out", "-=1.45");
    if (targetDOM.h4) textInteraction(targetDOM.h4, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h5) textInteraction(targetDOM.h5, 0.45, 1.75, 25, "expo.out", "-=1.85");
    if (targetDOM.p)  textInteraction(targetDOM.p, 0.5, 1.5, 25, "expo.out", "-=1.35");
    tl.from(targetDOM.button, { duration:2, stagger:.15, opacity:0, ease:"expo.out" }, "-=1.5" );
}
function frostedGlassOutro() {
    console.log("frostedGlassOutro")
}
barba.init({
    sync: true,
    transitions: [{
        async enter(data) {
            window.scrollTo(0,0);
            headerNavigationIntro();
            frostedGlassIntro();
            counterNavigationIntro();
        },
        async once(data) {
            window.scrollTo(0,0);
            headerNavigationIntro();
            frostedGlassIntro();
            counterNavigationIntro();
        },
        async leave(data) {
            const done = this.async();
            pageContentOutro()
            await delay(1000);
            done();
        }
    }] 
})