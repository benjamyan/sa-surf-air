/////////////////////////////////////////
/////////////////////////////////////////
// Barba transition functions ///////////
pageContentOutro = (targetEl)=> {
    // console.log("pageContentOutro")
    /*const targetEl = document.querySelector("section.isActive"),
          tl = gsap.timeline();
    tl.to(targetEl, { duration:.5, translateX:50, opacity:0 })*/
}
headerNavigationIntro = (targetEl)=> {
    // console.log("headerNavigationIntro")
    const tl = gsap.timeline();
    tl.from( navDOM.logo, {
        delay:1,
        duration:2,
        translateY:-50 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearElementChanges,
        onCompleteParams: [navDOM.logo]
    } )
    .from ( navDOM.mobile, {
        duration:1,
        translateY:-50 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearElementChanges,
        onCompleteParams: [navDOM.mobile]
    }, "-=2" )
    .from( navDOM.subButton, {
        delay:0,
        stagger:.075,
        duration:1,
        translateY:-50 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearElementChanges,
        onCompleteParams: [navDOM.subButton]
    }, "-=2" )
    .from( navDOM.mainText, { 
        delay:0.05,
        stagger:.075,
        duration:1,
        translateY:20 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearElementChanges,
        onCompleteParams: [navDOM.mainText]
    }, "-=2" )
    .from( navDOM.subText, {
        delay:0.25,
        stagger:.075,
        duration:1,
        translateY:20 ,
        opacity:0,
        ease:"expo.out",
        onComplete: clearElementChanges,
        onCompleteParams: [navDOM.subText]
    }, "-=2" );
}
headerNavigationOutro = (targetEl)=> {
    // console.log("headerNavigationOutro")
    const tl = gsap.timeline();
}
counterNavigationIntro = (targetEl)=> {
    // console.log("counterNavigationIntro")
    const tl = gsap.timeline();
}
counterNavigationOutro = (targetEl)=> {
    // console.log("counterNavigationOutro")
    const tl = gsap.timeline();
}
frostedGlassIntro = (target)=> {
    // console.log("frostedGlassIntro")
    const baseTarget = sections[0];
    const targetEl = baseTarget,
          targetDOM = {
              h1: targetEl.querySelector(".section__content--item h1"),
              h2: targetEl.querySelector(".section__content--item h2"),
              h3: targetEl.querySelector(".section__content--item h3"),
              h4: targetEl.querySelector(".section__content--item h4"),
              h5: targetEl.querySelector(".section__content--item h5"),
              p: targetEl.querySelector(".section__content--item p"),
              button: targetEl.querySelectorAll(".section__content--button"),
              blur: targetEl.querySelector(".blur"),
              bg: targetEl.querySelector(".section__bg")
          },
          textInteraction = (target, del, dur, trans, ease, pos)=> {
            breakStringByLine(target)
            tl.from( 
                target.children, 
                { 
                    delay: del,
                    duration: dur,
                    translateY: trans,
                    opacity: 0,
                    ease: ease,
                    onComplete: clearSpanAndStyles
                }, pos
            );
          },
          tl = gsap.timeline()
    window.scrollTo(0, 0)
    tl.from(targetDOM.bg, { 
        duration:2, 
        opacity:0, 
        scale:1.2 
    }).to(targetDOM.blur, { 
        duration:.5, 
        opacity:0
    }, "-=2");
    if (targetDOM.h1) textInteraction(targetDOM.h1, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h2) textInteraction(targetDOM.h2, 0.5, 1.5, 25, "expo.out", "-=1.25");
    if (targetDOM.h3) textInteraction(targetDOM.h3, 0.45, 1.65, 25, "expo.out", "-=1.45");
    if (targetDOM.h4) textInteraction(targetDOM.h4, 0.5, 1.5, 25, "expo.out", "-=1.35");
    if (targetDOM.h5) textInteraction(targetDOM.h5, 0.45, 1.75, 25, "expo.out", "-=1.85");
    if (targetDOM.p)  textInteraction(targetDOM.p, 0.5, 1.5, 25, "expo.out", "-=1.35");
    tl.to(targetDOM.button, { duration:2, stagger:.15, opacity:1, ease:"expo.out" }, "-=1.5" );
}
frostedGlassOutro = (target)=> {
    // console.log("frostedGlassOutro")
    const tl = gsap.timeline(),
          intTargets = ["h1","h2","h3","h4","h5","p","img","video",".nav__item--button-wrapper"],
          finalArr = [];
    return new Promise(resolve => {
        intTargets.forEach(function(current){
            const currentTarget = target.querySelector(current)
            if (currentTarget) {
                finalArr.push(currentTarget)
            };  
        });
        finalArr.forEach(function(current, index){
            if (!current.classList.contains("section__bg")
                && !current.classList.contains("section__bg--media")) {
                    fadeElOut(current, del=0.1, stag=0.15, dur=1, offset=50, pos=0.15 * index)
            } else {
                console.log(current)
                tl.to(current, {
                    //delay: 1,
                    duration: 1,
                    translateY: 0,
                    // opacity: 0,
                    scale: 1.2,
                    ease: "expo.out"
                })
            }
        })
        resolve();
    });
}
barba.init({
    sync: true,
    transitions: [{
        enter(data) {
            console.log("Barba enter")
            console.log(data)
            /*if (!sections[0].classList.contains("isActive"))
                sections[0].classList.add("isActive");*/
            return new Promise(resolve => {
                headerNavigationIntro();
                frostedGlassIntro();
                counterNavigationIntro();
                resolve()
            });
        },
        once(data) {
            console.log("Barba once")
            console.log(data)
            /*if (!sections[0].classList.contains("isActive"))
                sections[0].classList.add("isActive");*/
            return new Promise(resolve => {
                headerNavigationIntro();
                frostedGlassIntro();
                counterNavigationIntro();
                resolve()
            });
        },
        async leave(data) {
            console.log("Barba leave")
            console.log(data)
            const done = this.async();
            const target = document.querySelector("section.isActive");
            headerNavigationOutro();
            counterNavigationOutro();
            frostedGlassOutro(target);
            await delay(2000);
            done();
        }
    }] 
})
