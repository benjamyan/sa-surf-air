/////////////////////////////////////////
/////////////////////////////////////////
// Barba transition functions ///////////
let pageOut = false;
const pageContentOutro = (targetEl) => {
        // console.log("pageContentOutro")
        /*const targetEl = document.querySelector("section.isActive"),
              tl = gsap.timeline();
        tl.to(targetEl, { duration:.5, translateX:50, opacity:0 })*/
    },
    headerNavigationIntro = (targetEl) => {
        // console.log("headerNavigationIntro")
        const tl = gsap.timeline();
        tl.from(navDOM.logo, {
                delay: 1,
                duration: 2,
                translateY: -50,
                opacity: 0,
                ease: "expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [navDOM.logo]
            })
            .from(navDOM.mobile, {
                duration: 1,
                translateY: -50,
                opacity: 0,
                ease: "expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [navDOM.mobile]
            }, "-=2")
            .from(navDOM.subButton, {
                delay: 0,
                stagger: .075,
                duration: 1,
                translateY: -50,
                opacity: 0,
                ease: "expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [navDOM.subButton]
            }, "-=2")
            .from(navDOM.mainText, {
                delay: 0.05,
                stagger: .075,
                duration: 1,
                translateY: 20,
                opacity: 0,
                ease: "expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [navDOM.mainText]
            }, "-=2")
            .from(navDOM.subText, {
                delay: 0.25,
                stagger: .075,
                duration: 1,
                translateY: 20,
                opacity: 0,
                ease: "expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [navDOM.subText]
            }, "-=2");
    },
    headerNavigationOutro = (targetEl) => {
        console.log("headerNavigationOutro")
        const tl = gsap.timeline();
        if (navDOM.nav.classList.contains("active")) {
            tl.to(navDOM.nav, {
                duration: 1,
                background: "rgba(0,0,0,0)",
                ease: "expo.out"
            });
        };
        tl.to(navDOM.logo, {
                delay: 0.5,
                duration: 2,
                translateY: -50,
                opacity: 0,
                ease: "expo.out"
            })
            .to(navDOM.mobile, {
                duration: 1,
                translateY: -50,
                opacity: 0,
                ease: "expo.out"
            }, "-=2")
            .to(navDOM.subButton, {
                stagger: .075,
                duration: 1,
                translateY: -50,
                opacity: 0,
                ease: "expo.out"
            }, "-=2")
            .to(navDOM.mainText, {
                delay: 0.05,
                stagger: .075,
                duration: 1,
                translateY: 20,
                opacity: 0,
                ease: "expo.out"
            }, "-=2")
            .to(navDOM.subText, {
                delay: 0.25,
                stagger: .075,
                duration: 1,
                translateY: 20,
                opacity: 0,
                ease: "expo.out"
            }, "-=2");
    },
    counterNavigationIntro = (targetEl) => {
        // console.log("counterNavigationIntro")
        const tl = gsap.timeline();
        const counterDOM = document.querySelector(".section__counter");
        if (counterDOM) {
            const counterDOMinner = Array.from(counterDOM.children);
            final = () => {
                counterDOMinner.forEach(function(current) {
                    clearDOMchanges(current)
                })
            }
            counterDOMinner.forEach(function(current) {
                current.style.opacity = "0";
            })
            tl.to(counterDOM.children, {
                delay: 0.5,
                duration: 0.01,
                translateX: -25,
                ease: "none"
            }).to(counterDOM.children, {
                duration: 1,
                stagger: 0.15,
                translateX: 0,
                opacity: 1,
                ease: "expo.out",
                onComplete: final
            });
        };
    },
    counterNavigationOutro = (targetEl) => {
        // console.log("counterNavigationOutro")
        const tl = gsap.timeline();
        const counterDOM = document.querySelector(".section__counter");
        if (counterDOM) {
            const counterDOMinner = Array.from(counterDOM.children);
            tl.to(counterDOM.children, {
                duration: 1,
                stagger: 0.15,
                translateX: -25,
                opacity: 0,
                ease: "expo.out"
            });
        };
    },
    frostedGlassIntro = (target) => {
        // console.log("frostedGlassIntro");
        pageOut = false;
        headerNavigationIntro();
        scrolltoYPoint(sections[0], 0.01);
        window.onbeforeunload = function() {
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
                blur: targetEl.querySelector(".blur:not(.mobile-only)"),
                bg: targetEl.querySelector(".section__bg")
            },
            textInteraction = (target, dur, trans, ease, pos) => {
                baseInt = (targetEl) => {
                    tl.from(targetEl, {
                            opacity: 0,
                            translateY: trans
                        }, pos)
                        .to(targetEl, {
                            duration: dur,
                            translateY: 0,
                            opacity: 1,
                            ease: ease
                        });
                };
                if (viewportWidth > 1024) {
                    $(target).splitLines({
                        tag: `<div class="split-line" style="display:block;line-height:inherit;">`,
                        keepHtml: true,
                        width: "100%"
                    });
                    target.style.cssText = `position:relative; overflow:hidden; width:100%;`;
                    Array.from(target.children).forEach(function(current) {
                        baseInt(current);
                    });
                } else {
                    baseInt(target);
                };
            },
            frostedGlassIntroCleaner = () => {
                Array.from(targetDOM).forEach(function(current) {
                    clearDOMchanges(current);
                });
                Array.from(targetDOM.button.children).forEach(function(current) {
                    clearDOMchanges(current);
                });
                targetDOM.blur.parentElement.removeChild(targetDOM.blur);
                clearDOMchanges(targetDOM.bg);
            },
            tl = gsap.timeline();
        Array.from(targetEl.querySelectorAll("[data-interaction='fadeElIn']")).forEach(function(current) {
            !current.hasAttribute("fired") ? current.setAttribute("fired", '') : null;
        });
        tl.from(targetDOM.bg, {
            duration: 1.5,
            opacity: 0,
            scale: 1.2
        }).to(targetDOM.blur, {
            duration: .5,
            opacity: 0
        }, "-=1").from(targetDOM.button.children, {
            translateY: 50,
            stagger: .25,
            opacity: 0,
        }, "-=0.25").to(targetDOM.button.children, {
            delay: 0.1,
            duration: 0.4,
            stagger: 0.2,
            translateY: 0,
            opacity: 1,
            ease: "expo.out"
        }, "-=0.75");
        if (targetDOM.h1) textInteraction(targetDOM.h1, 0.175, 25, "expo.out", "-=0.75");
        if (targetDOM.h2) textInteraction(targetDOM.h2, 0.175, 25, "expo.out", "-=0.75");
        if (targetDOM.h3) textInteraction(targetDOM.h3, 0.25, 25, "expo.out", "-=0.75");
        if (targetDOM.h4) textInteraction(targetDOM.h4, 0.25, 25, "expo.out", "-=0.75");
        if (targetDOM.h5) textInteraction(targetDOM.h5, 0.25, 25, "expo.out", "-=0.5");
        if (targetDOM.p) textInteraction(targetDOM.p, 0.25, 25, "expo.out", "-=0.25");
        if (targetEl.querySelector("video")) {
            targetEl.querySelector("video").pause();
            targetEl.querySelector("video").currentTime = 0;
            targetEl.querySelector("video").play();
        }
        setTimeout(function() {
            frostedGlassIntroCleaner();
        }, time);
    },
    frostedGlassOutro = (target) => {
        // console.log("frostedGlassOutro")
        if (navDOM.nav.classList.contains("open")) headerMobileToggle(event);
        headerNavigationOutro();
        counterNavigationOutro();
        const tl = gsap.timeline(),
            intTargets = ["*[data-interaction='fadeElIn']", ".section__content--button", ".service__banner--item", ".slider", ".pinned"],
            finalArr = [],
            finalInt = () => {
                tl.to(DOM.main, {
                    duration: 0.65,
                    opacity: 0,
                    ease: "none",
                    onComplete: ()=> pageOut = true
                }, "-=0.5");
            };
        intTargets.forEach(function(current) {
            Array.from(document.querySelectorAll(current)).forEach(function(currTarget){
                let isBarba = true;
                if (isInViewport(currTarget, isBarba)) finalArr.push(currTarget);
            });
        });
        finalArr.forEach(function(current, index, arr) {
            if (index === 1) finalInt();
            tl.to(current, {
                delay: 0.25,
                duration: 1,
                stagger: 0.15,
                translateY: -25,
                opacity: 0,
                ease: "expo.out"
            }, 0.15 * index);
        });
    };
barba.hooks.leave((data) => {
    // console.log("Barba beforeLeave");
    let supportsPassive = false;
    try {
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
            get: function() { supportsPassive = true; }
        }));
    } catch (e) {
        // 
    };
    let wheelOpt = supportsPassive ? { passive: false } : false;
    scrollTypes.forEach(function(current) {
        window.removeEventListener(current, onScrollEvent, false)
        window.removeEventListener(current, onScrollEvent, wheelOpt)
    });
    enableScroll();
    const baseTarget = data.current.container.children;
    Array.from(baseTarget).forEach(function(current) {
        const targetArr = Array.from(current.querySelectorAll("[data-interaction]"));
        if (current.dataset.interaction) targetArr.push(current);
        if (targetArr.length > 0) {
            targetArr.forEach(function(targetEl) {
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
            textTags: ["h1", "h2", "h3", "h4", "h5", "p"],
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
    let currentBody = data.next.container;
    headerNavigationIntro();
    counterNavigationIntro();
    if (currentBody.hasAttribute("open-scroll")) {
        DOM.main.setAttribute("open-scroll", '')
    } else if (!currentBody.hasAttribute("open-scroll")) {
        if (DOM.main.hasAttribute("open-scroll")) {
            DOM.main.removeAttribute("open-scroll");
        };
        if (window.innerWidth > 1024 || document.documentElement.clientWidth > 1024) {
            DOM.main.addEventListener("wheel", function(e) {
                e.preventDefault();
            }, { passive: false });
        };
    };
    /*DOM.textTags.forEach(function(current){
        const currTag = Array.from(currentBody.querySelectorAll(current));
        currTag.forEach(function(currTarget){
            if (currTarget.closest("section")
                && currTarget.closest("section") !== currentBody.querySelector("section")) {
                $(currTarget).widowFix();
            };
        });
    });*/
    init(data.next)
});
barba.init({
    sync: true,
    transitions: [{
        enter(data) {
            // console.log("Barba enter")
            frostedGlassIntro(data.next);
        },
        once(data) {
            // console.log("Barba once")
            frostedGlassIntro(data.next);
        },
        async leave(data) {
            // console.log("Barba leave")
            const done = this.async();
            frostedGlassOutro(data.current);
            setInterval(function(){
                if (pageOut === true) done();
            },100);
        }
    }]
});