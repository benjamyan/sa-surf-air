/////////////////////////////////////////
/////////////////////////////////////////
// Barba transition functions ///////////
const pageContentOutro = (targetEl)=> {
    // console.log("pageContentOutro")
    /*const targetEl = document.querySelector("section.isActive"),
          tl = gsap.timeline();
    tl.to(targetEl, { duration:.5, translateX:50, opacity:0 })*/
},
headerNavigationIntro = (targetEl)=> {
    // console.log("headerNavigationIntro")
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
},
headerNavigationOutro = (targetEl)=> {
    // console.log("headerNavigationOutro")
    const tl = gsap.timeline();
},
counterNavigationIntro = (targetEl)=> {
    // console.log("counterNavigationIntro")
    const tl = gsap.timeline();
},
counterNavigationOutro = (targetEl)=> {
    // console.log("counterNavigationOutro")
    const tl = gsap.timeline();
},
frostedGlassIntro = (target)=> {
    // console.log("frostedGlassIntro");
    scrolltoYPoint(sections[0], 0.01)  
    window.onbeforeunload = function () {
        window.scrollTo(0, 0);
    };
    const targetEl = target.container.querySelector("section"),
          targetDOM = {
              h1: targetEl.querySelector("h1"),
              h2: targetEl.querySelector("h2"),
              h3: targetEl.querySelector("h3"),
              h4: targetEl.querySelector("h4"),
              h5: targetEl.querySelector("h5"),
              p: targetEl.querySelector("p"),
              button: targetEl.querySelector(".section__content--button-wrapper"),
              blur: targetEl.querySelector(".blur"),
              bg: targetEl.querySelector(".section__bg")
          },
          textInteraction = (target, dur, trans, ease, pos)=> {
            $(target).splitLines({
                tag: `<div class="split-line" style="display:block;">`,
                keepHtml: true
            });
            target.style.cssText = `height:${target.offsetHeight}px; position:relative; overflow:hidden; width:100%;`;
            Array.from(target.children).forEach(function(current){
                tl.from( current, {
                    opacity: 0,
                    translateY: trans
                }, pos)
                .to( current, {
                    duration: dur,
                    translateY: 0,
                    opacity: 1,
                    ease: ease
                });
            });
          },
          frostedGlassIntroCleaner = ()=> {
            Array.from(targetDOM).forEach(function(current){
                clearDOMchanges(current);
            });
            Array.from(targetDOM.button.children).forEach(function(current){
                clearDOMchanges(current);
            });
            targetDOM.blur.parentElement.removeChild(targetDOM.blur)
            clearDOMchanges(targetDOM.bg);
            Array.from(targetEl.querySelectorAll("[data-interaction='fadeElIn']")).forEach(function(current){
                !current.hasAttribute("fired") ? current.setAttribute("fired",'') : null;
            });
          },
          tl = gsap.timeline();
    tl.from(targetDOM.bg, {
        duration: 1.5, 
        opacity: 0, 
        scale: 1.2 
    }).to(targetDOM.blur, { 
        duration: .5, 
        opacity: 0
    }, "-=1").from(targetDOM.button.children, {
        // duration: 0,
        translateY: 50,
        stagger: .25,
        opacity: 0,
    }, "-=1").to(targetDOM.button.children, {
        // delay: .25, 
        duration: 0.5, 
        stagger: .25,
        translateY: 0,
        opacity: 1,
        ease: "expo.out"/*,
        onComplete: clearDOMchanges,
        onCompleteParams: [Array.from(targetDOM.button.children)]*/
    }, "-=0.75");
    if (targetDOM.h1) textInteraction(targetDOM.h1, 0.25, 25, "expo.out", "-=0.25");
    if (targetDOM.h2) textInteraction(targetDOM.h2, 0.25, 25, "expo.out", "-=0.25");
    if (targetDOM.h3) textInteraction(targetDOM.h3, 0.25, 25, "expo.out", "-=1");
    if (targetDOM.h4) textInteraction(targetDOM.h4, 0.25, 25, "expo.out", "-=0.25");
    if (targetDOM.h5) textInteraction(targetDOM.h5, 0.5, 25, "expo.out", "-=0.5");
    if (targetDOM.p)  textInteraction(targetDOM.p, 0.5, 25, "expo.out", "-=0.25");
    setTimeout(function(){
        frostedGlassIntroCleaner();
    },time)
},
frostedGlassOutro = (target)=> {
    // console.log("frostedGlassOutro")
    const tl = gsap.timeline(),
          targetEl = target.container.querySelector("section.isActive"),
          intTargets = ["h1","h2","h3","h4","h5","p",".section__content--button",".service__banner--item",".slider",".pinned",".section__bg"],
          finalArr = [];
    intTargets.forEach(function(current){
        const currentTarget = Array.from(targetEl.querySelectorAll(current));
        if (currentTarget && currentTarget.length >= 1) {
            currentTarget.forEach(function(currFinal){
                finalArr.push(currFinal)
            })
        };
    });
    finalArr.forEach(function(current, index){
        if (!current.classList.contains("section__bg")
            && !current.classList.contains("section__bg--media")) {
                tl.to( current, {
                    delay: 0.25,
                    duration: 1,
                    stagger: 0.25,
                    translateY: -25,
                    opacity: 0,
                    ease: "expo.out"
                }, 0.15 * index )
        } else {
            tl.to(current, {
                delay: 0.25,
                duration: 2.5,
                scale: 1.2,
                opacity: 0,
                ease: "expo.out"
            }, 0.15 * index)
        }
    })
};
barba.hooks.leave((data)=> {
    // console.log("Barba beforeLeave");
    let supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function () { supportsPassive = true; } 
        }));
    } catch(e) {
        // 
    };
    let wheelOpt = supportsPassive ? { passive: false } : false;
    scrollTypes.forEach(function(current) {
        window.removeEventListener(current, onScrollEvent, false)
        window.removeEventListener(current, onScrollEvent, wheelOpt)
    });
    enableScroll();
    const baseTarget = data.current.container.children;
    Array.from(baseTarget).forEach(function(current){
        const targetArr = Array.from(current.querySelectorAll("[data-interaction]"));
        if (current.dataset.interaction) targetArr.push(current);
        if (targetArr.length > 0) {
            targetArr.forEach(function(targetEl){
                const targetInt = targetEl.dataset.interaction;
                if (current.hasAttribute("fired")) current.removeAttribute("fired");
                if (targetInt.includes("sectionPin")) pinCleaner(false, data);
                if (targetInt.includes("parallaxItem")) parallaxCleaner(data);
                if (targetInt.includes("sliderItem")) sliderCleaner(data);
            })
        };
    });

});
barba.hooks.afterEnter((data) => {
    // console.log("Barba afterEnter")
    Page = {
        home: data.next.container.parentElement.querySelector(".home"),
        experience: data.next.container.parentElement.querySelector(".experience"),
        ondemand: data.next.container.parentElement.querySelector(".ondemand"),
        scheduled: data.next.container.parentElement.querySelector(".scheduled"),
        memberships: data.next.container.parentElement.querySelector(".memberships")
    },
    DOM = {
        body: data.next.container.parentElement,
        main: data.next.container,
        textTags: ["h1","h2","h3","h4","h5","p"],
        counter: ".section__counter",
        serviceBanner: ".service__banner",
        serviceBannerItem: data.next.container.querySelectorAll(".service__banner--item"),
        bgMedia: data.next.container.querySelector(".section__bg--media")
    },
    navDOM = {
        nav: data.next.container.querySelector(".header__nav"),
        logo: data.next.container.querySelector(".header__nav .nav__logo"),
        mobile: data.next.container.querySelector(".header__nav .nav__mobile"),
        mainText: Array.from(data.next.container.querySelectorAll(".header__nav .nav__main p")),
        subText: Array.from(data.next.container.querySelectorAll(".header__nav .nav__sub .text")),
        subButton: data.next.container.querySelector(".header__nav .nav__sub .button")
    };
    sections = Array.from(data.next.container.querySelectorAll("section"));
    counter = data.next.container.querySelector("aside");
    DOM.body.classList.remove(data.current.namespace)
    DOM.body.classList.add(data.next.namespace)
    let currentBody = data.next.container
    if (currentBody.hasAttribute("open-scroll")) {
        DOM.main.setAttribute("open-scroll",'')
    } else if (!currentBody.hasAttribute("open-scroll")) {
        if (DOM.main.hasAttribute("open-scroll")) {
            DOM.main.removeAttribute("open-scroll");
        }
    };
    init(data.next)
});
barba.init({
    sync: true,
    transitions: [{
        enter(data) {
            // console.log("Barba enter")
                // problem with removing event listeners
                // only seem to be removing a few of them on page leave
                // need to remove them all - some arrays showing 10+
            // DOM.body.innerHTML = DOM.body.innerHTML;
                // ^^ supoosed to refresh the DOM html, removing the listeners -- this is too tasking and fucks up barba
            frostedGlassIntro(data.next);
            headerNavigationIntro();
            counterNavigationIntro();
        },
        once(data) {
            // console.log("Barba once")
            frostedGlassIntro(data.next);
            headerNavigationIntro();
            counterNavigationIntro();
        },
        async leave(data) {
            // console.log("Barba leave")
            const done = this.async();
            frostedGlassOutro(data.current);
            headerNavigationOutro();
            counterNavigationOutro();
            await delay(2000);
            done();
        }
    }] 
});