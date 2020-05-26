navDOM = {
    logo: document.querySelector(".nav__logo"),
    mainText: Array.from(document.querySelectorAll(".nav__main p")),
    subText: Array.from(document.querySelectorAll(".nav__sub .text")),
    subButton: document.querySelector(".nav__sub .button")
},
/////////////////////////////////////////
/////////////////////////////////////////
// callback functions for general tom-foolery
delay = (n)=> {
    n = n || 2000;
    return new Promise(done => {
        setTimeout(() => {
            done();
        }, n)
    });
}
isInViewport = (el)=> {
    const rect = el.getBoundingClientRect(),
          windowHeight = (window.innerHeight || document.documentElement.clientHeight),
          windowWidth = (window.innerWidth || document.documentElement.clientWidth);
    return (
        (rect.top <= windowHeight) && ((rect.top + rect.height) >= 0) 
        &&
        (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0)
    );
}
clearChanges = (targetArr)=> {
    console.log(targetArr)
    targetArr.forEach(function(current){
        current.removeAttribute("style")
    });
}
function navActive(target) {
    //
};
function fadeIn(targetEl) {
    const wipeChanges = ()=> {
              targetEl.forEach(function(current){
                  current.removeAttribute("style")
              })
          },
          tl = gsap.timeline(/*{ onComplete:wipeChanges }*/);
    tl.from( targetEl, { 
        delay:.5, 
        duration:1, 
        stagger: 0.15/*targetEl.length % 2*/, 
        translateY:50 , 
        opacity:0, 
        ease:"expo.out", 
    } );
}
function fadeOut(targetEl) {
    console.log("fadeOut", targetEl)
    const wipeChanges = ()=> {
        targetEl.forEach(function(current){
            current.removeAttribute("style")
        })
    },
    tl = gsap.timeline({ onComplete:wipeChanges });
    tl.to( targetEl, { 
        delay:.5, 
        duration:1, 
        stagger: 0.15/*targetEl.length % 2*/, 
        translateY:50 , 
        opacity:0, 
        ease:"expo.out", 
    } );
}
function slideItemIn(event) {
    const targetEl = event.target.closest("[onclick]"),
          targetElHeight = 299.5/*targetEl.offsetHeight*/,
          detailsDOM = targetEl.querySelector("details"),
          detailsDOMul = detailsDOM.querySelector("ul"),
          targetChildren = Array.from(targetEl.children),
          tl = gsap.timeline()
    if (targetEl.hasAttribute("open")) {
        slideItemOut(targetEl, targetElHeight);
        return false;
    } else if (document.querySelector("[open]")) {
        slideItemOut(
            document.querySelector("[open]").closest("[onclick]"), 
            targetElHeight
        )
    }
    targetEl.style.zIndex = 99999;
    targetChildren.forEach(function(current, index){
        if (current.classList.contains("blur")) targetChildren.splice(index, 1)
    })
    openDetails = ()=> {
        detailsDOM.setAttribute("open","")
    }
    tl.to( targetChildren, { 
        duration: .5, 
        stagger: 0.15, 
        translateY: 25,
        opacity: 0, 
        ease: "expo.out",
        onComplete: openDetails
    })
    .to( targetEl, {
        duration:1, 
        height:targetEl.offsetHeight * 2, 
        ease:"expo.out", 
        zIndex: 99999
    }, "-=.25")
    tl.to( detailsDOM.querySelector("summary"), { 
        duration: .5, 
        height: 0,
        opacity: 0, 
        ease: "expo.out"
    }, "-=1")
    .to ( detailsDOMul.children, {
        duration:0.1,
        translateY: 25,
        ease:"expo.out"
    }, "-=2" )
    .to( targetChildren, { 
        duration:.75, 
        stagger: 0.15, 
        translateY: 0,
        opacity:1, 
        ease:"expo.out", 
    }, "-=1" )
    .to ( detailsDOMul.children, {
        duration: .75,
        stagger: 0.15,
        opacity: 1,
        translateY: 0,
        ease:"expo.out"
    }, "-=1" );
}
function slideItemOut(target, targetElHeight) {
    const targetEl = target,
          detailsDOM = targetEl.querySelector("details"),
          targetChildren = Array.from(targetEl.children),
          detailsDOMul = detailsDOM.querySelector("ul"),
          tl = gsap.timeline();
    console.log(targetEl)
    targetChildren.forEach(function(current, index){
        if (current.classList.contains("blur")) targetChildren.splice(index, 1)
    })
    closeDetails = ()=> {
        detailsDOM.removeAttribute("open")
    };
    clearStyles = ()=> {
        targetEl.removeAttribute("style")
    }
    tl.to( detailsDOMul.children, { 
        duration: .5, 
        translateY: -25,
        stagger: 0.15, 
        opacity: 0, 
        ease: "expo.out",
        onComplete: closeDetails
    })
    .to( targetEl, {
        duration: 1,
        height: targetElHeight,
        ease: "expo.out",
        onComplete: clearStyles
    }, "-=.5" )
    .to( detailsDOM.querySelector("summary"), {
        duration: .5,
        display: "block",
        opacity: 1,
        ease: "expo.out",
    }, "-=1" )
}
/////////////////////////////////////////
/////////////////////////////////////////
// page functions for barba
function pageContentOutro() {
    const targetEl = document.querySelector("section"),
          tl = gsap.timeline();
    tl.to('section', { duration:.5, translateX:50, opacity:0 })
}
function headerNavigationIntro() {
    console.log("headerNavigationIntro")
    const paramBuild = ()=> {
            const finalArr = [navDOM.logo, navDOM.subButton];
            // for (let i = 0; )
            return finalArr
          },
          tl = gsap.timeline({ 
              onComplete: clearChanges, 
              onCompleteParams: [ navDOM.logo, navDOM.subButton, navDOM.mainText.each, navDOM.subText.each ]
            });
    tl.from( navDOM.logo, { delay:1, duration:2, translateY:-50 , opacity:0, ease:"expo.out", } );
    tl.from( navDOM.subButton, { delay:0, stagger:.075, duration:1, translateY:-50 , opacity:0, ease:"expo.out", }, "-=2" );
    tl.from( navDOM.mainText, { delay:0.05, stagger:.075, duration:1, translateY:20 , opacity:0, ease:"expo.out", }, "-=1.5" );
    tl.from( navDOM.subText, { delay:0.25, stagger:.075, duration:1, translateY:20 , opacity:0, ease:"expo.out", }, "-=1.5" );
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
    const targetEl = document.querySelector("section[data-interaction='frostedGlass']"),
          targetDOM = {
              h1: targetEl.querySelector(".section__content--item h1"),
              h2: targetEl.querySelector(".section__content--item h2"),
              h3: targetEl.querySelector(".section__content--item h3"),
              h4: targetEl.querySelector(".section__content--item h4"),
              h5: targetEl.querySelector(".section__content--item h5"),
              p: targetEl.querySelector(".section__content--item p"),
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
    tl.from(targetDOM.bg, { duration:2, translateY:100, opacity:0, scale:1.2 })
      .to(targetDOM.blur, { duration:2.5, opacity:0 }, "-=1");
    if (targetDOM.h1) textInteraction(targetDOM.h1, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h2) textInteraction(targetDOM.h2, 0.5, 1.5, 25, "expo.out", "-=1.75");
    if (targetDOM.h3) textInteraction(targetDOM.h3, 0.45, 1.65, 25, "expo.out", "-=1.45");
    if (targetDOM.h4) textInteraction(targetDOM.h4, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h5) textInteraction(targetDOM.h5, 0.45, 1.75, 25, "expo.out", "-=2.05");
    if (targetDOM.p)  textInteraction(targetDOM.p, 0.5, 1.5, 25, "expo.out", "-=1.35");
}
function frostedGlassOutro() {
    console.log("frostedGlassOutro")
}
/////////////////////////////////////////
/////////////////////////////////////////
// barba initializer
barba.init({
    sync: true,
    transitions: [{
        async enter(data) {
            headerNavigationIntro();
            frostedGlassIntro();
            counterNavigationIntro();
        },
        async once(data) {
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