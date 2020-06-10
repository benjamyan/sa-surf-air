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
    Array.from(sections[0].querySelectorAll("*[data-interaction='fadeElIn'")).forEach(function(current){
        current.style.opacity = 0;
    });
    const baseTarget = target.container.querySelector("section");
    const targetEl = baseTarget,
          targetDOM = {
              h1: targetEl.querySelector(".section__content--item h1"),
              h2: targetEl.querySelector(".section__content--item h2"),
              h3: targetEl.querySelector(".section__content--item h3"),
              h4: targetEl.querySelector(".section__content--item h4"),
              h5: targetEl.querySelector(".section__content--item h5"),
              p: targetEl.querySelector(".section__content--item p"),
              button: targetEl.querySelector(".section__content--button-wrapper"),
              blur: targetEl.querySelector(".blur"),
              bg: targetEl.querySelector(".section__bg")
          },
          textInteraction = (target, del, dur, trans, ease, pos)=> {
            breakStringByLine(target)
            tl.from( target.children, { 
                    delay: del,
                    duration: dur,
                    translateY: trans,
                    opacity: 0,
                    ease: ease,
                    onComplete: clearSpanAndStyles
                }, pos
            );
          },
          frostedGlassIntroCleaner = ()=> {
            console.log("frostedGlassIntroCleaner")
            Array.from(targetDOM).forEach(function(current){
                clearDOMchanges(current)
            })
            Array.from(targetDOM.button.children).forEach(function(current){
                clearDOMchanges(current)
            })
            clearDOMchanges(targetDOM.bg)
            clearDOMchanges(targetDOM.blur)
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
        duration: 0.1,
        translateY: 50,
        opacity: 0,
    }, "-=1").to(targetDOM.button.children, {
        delay: .25, 
        duration: 1, 
        stagger:.25,
        translateY: 0,
        opacity: 1,
        ease:"expo.out"
    }, "-=.75");
    if (targetDOM.h1) textInteraction(targetDOM.h1, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h2) textInteraction(targetDOM.h2, 0.5, 1.5, 25, "expo.out", "-=1.25");
    if (targetDOM.h3) textInteraction(targetDOM.h3, 0.45, 1.65, 25, "expo.out", "-=1.45");
    if (targetDOM.h4) textInteraction(targetDOM.h4, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h5) textInteraction(targetDOM.h5, 0.45, 1.75, 25, "expo.out", "-=1.85");
    if (targetDOM.p)  textInteraction(targetDOM.p, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h3) targetDOM.h3.parentElement.style.opacity = 1;
    setTimeout(function(){
        frostedGlassIntroCleaner();
    },time)
},
frostedGlassOutro = (target)=> {
    // console.log("frostedGlassOutro")
    const tl = gsap.timeline(),
          targetEl = target.container.querySelector("section.isActive"),
          intTargets = [".section__content--main",".section__content--sub",".service__banner--item",".slider",".pinned",".section__bg"],
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
                fadeElOut(current, del=0.1, stag=0.15, dur=1, offset=50, pos=0.15 * index)
        } else {
            tl.to(current, {
                delay: 1,
                duration: 2,
                translateY: 0,
                scale: 1.2,
                opacity: 0,
                ease: "expo.out"
            })
        }
    })
};
barba.hooks.leave((data)=> {
    console.log("Barba beforeLeave");
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
        window.removeEventListener(current, scrollFunc, false)
        window.removeEventListener(current, scrollFunc, wheelOpt)
    });
    const baseTarget = data.current.container.children;
    Array.from(baseTarget).forEach(function(current){
        const targetArr = Array.from(current.querySelectorAll("[data-interaction]"))
        if (targetArr.length > 0) {
            targetArr.forEach(function(targetEl){
                const targetInt = targetEl.dataset.interaction;
                console.log(targetEl)
                if (targetInt.includes("sectionPin")) console.log(targetEl), pinCleaner(false, data);
                if (targetInt.includes("parallaxItem")) console.log(targetEl), parallaxCleaner(data)
                if (targetInt.includes("sliderItem")) console.log(targetEl), sliderCleaner(data)
            })
        };
    })
});
barba.hooks.afterEnter((data) => {
    console.log("Barba afterEnter")
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
            console.log("Barba enter")
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
            console.log("Barba once")
            // DOM.body.innerHTML = DOM.body.innerHTML;
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