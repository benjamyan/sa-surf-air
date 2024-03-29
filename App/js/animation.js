/////////////////////////////////////////
/////////////////////////////////////////
// GSAP Animation functions /////////////
function numCountUpAnimation(targetArr) {
    targetArr.forEach(function(current){
        const count = { val:0 },
              newVal = parseInt(current.innerText);
        TweenLite.to( count, 1, {
            duration: 1,
            val: newVal, roundProps: "val", onUpdate: function() {
                current.innerHTML = count.val;
            },
            ease: "expo.out"
        });
    })
}
function numberTransition(targetEl, nextTarget) {
    // console.log(nextTarget)
    const timeline = gsap.timeline({ onComplete:clearDOMchanges, onCompletParams:[targetEl, targetEl.parentElement, nextTarget] })
    timeline.from( targetEl, {
        duration: 0,
        opacity: 1
    }).to( targetEl, {
        duration: 1,
        opacity: 0,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [targetEl]
    }).from( nextTarget.children[0], {
        translateY: 0,
        opacity: 0
    }, "-=1").to( nextTarget.children[0], {
        duration: 1,
        opacity: 1,
        ease: "expo.out",
        onStart: numCountUpAnimation(Array.from(nextTarget.querySelectorAll("h1"))),
        onComplete: clearDOMchanges,
        onCompleteParams: [Array.from(nextTarget.children[0])]
    }, "-=0.9");
}
function textTransition(targetEl, nextTarget) {
    // console.log(targetEl)
    const timeline = gsap.timeline({ onComplete:clearDOMchanges, onCompletParams:[targetEl, targetEl.parentElement, nextTarget] }),
          targetArr = Array.from(nextTarget.children);
    targetArr.forEach(function(current){
        if (current.tagName === "H1") {
            targetArr.splice(current, 1)
        }
    });
    timeline.from( targetEl.parentElement, {
        duration: 0,
        translateY: 50,
        opacity: 0
    }).to( targetEl, {
        duration: 1,
        stagger: .175,
        translateY: 100,
        opacity: 0,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [targetEl.parentElement, targetEl]
    }).from( nextTarget, {
        opacity: 0
    }, "-=1").from( targetArr, {
        translateY: -50,
        opacity: 0
    }, "-=1").to( targetArr, {
        duration: 1,
        stagger: .175,
        translateY: 0,
        opacity: 1,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams: [nextTarget, targetArr]
    }, "-=0.9");
}
function fadeElIn(targetEl,del=0,dur=1,stag=.15,offset=50) {            // fade in effect for DOM elements
    const tl = gsap.timeline();
    if (typeof targetEl !== "undefined") {
        if (targetEl.classList.contains("service__banner--item")) {
            const serviceItem = targetEl.querySelector(".service__banner--item-inner"),
                  serviceBlur = targetEl.querySelector(".blur");
            tl.to( serviceItem, { 
                duration: 0.1, 
                stagger: stag, 
                translateY: offset,
                opacity: 0,
                ease:"expo.out"
            }).to( serviceItem, {
                duration: 1.5,
                stagger: stag,
                opacity: 1,
                translateY: 0,
                ease:"expo.out"
            });
            tl.to( serviceBlur, { 
                duration: 0,
                stagger: stag,
                opacity: 0,
                ease:"expo.out"
            }).to( serviceBlur, {
                duration: 1.5,
                stagger: stag,
                opacity: 1,
                ease:"expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [serviceBlur, serviceItem]
            },"-=1.5");
            return;
        };
        if (isOpenScrolling()) {
            tl.to( targetEl, { 
                duration: 0.1, 
                stagger: stag, 
                translateY: offset,
                opacity: 0,
                ease:"expo.out"
            }).to( targetEl, {
                delay: del,
                duration: 1.5,
                stagger: stag,
                opacity: 1,
                translateY: 0,
                ease:"expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [targetEl]
            } );
        } else {
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
                ease:"expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [targetEl]
            } );
        };
    }
}
function fadeElOut(targetEl,del=.5,stag=0.15,dur=1,offset=0,pos=0) {    // fade out effect for DOM elements
    const tl = gsap.timeline();
    tl.to( targetEl, { 
        delay: del, 
        duration: dur, 
        stagger: stag, 
        translateY: offset, 
        opacity: 0, 
        ease: "expo.out", 
    }, pos );
}
function slideItemIn(event) {
    // console.log("slideItemIn")
    return (function() {                                                    // start our throttle
        if (!intRunning) {                                                         // if throttle is not running
            intRunning = true;
            const targetEl = event.target.closest("[onclick]"),
                  detailsClose = targetEl.querySelector(".service__banner--item-close"),
                  detailsDOM = targetEl.querySelector("details"),
                  detailsDOMul = detailsDOM.querySelector("ul"),
                  targetChildren = Array.from(targetEl.children),
                  tl = gsap.timeline();
            detailsDOMul.classList.add("transition")
            if (targetEl.classList.contains("activeItem")) {
                slideItemOut(targetEl);
                setTimeout(function() {
                    intRunning = false;
                }, time );
                return false;
            } else if (document.querySelector("[open]")) {
                slideItemOut(document.querySelector("[open]").closest("[onclick]"))
            }
            targetEl.classList.add("activeItem")
            targetEl.style.zIndex = 1000;
            targetChildren.forEach(function(current, index){
                if (current.classList.contains("blur"))
                    targetChildren.splice(index, 1);
            });
            setDetails = ()=> {
                const detailsDimensions = detailsDOMul.getBoundingClientRect();
                detailsDOM.querySelector("summary").classList.add("details-active")
                if (viewportWidth < 900 && viewportWidth > 700) {
                    tl.from(detailsDOMul, {
                        duration: 0.01,
                        height: 0,
                        ease: "none"
                    }, "-=1.5").to(detailsDOMul,{
                        duration: 1,
                        height: detailsDimensions.height,
                        ease: "expo.out"
                    });
                } else if (viewportWidth < 700) {
                    tl.from(detailsDOMul, {
                        duration: 0.01,
                        height: 0,
                        ease: "none"
                    }, "-=2.5");
                } else return
            };
            openDetails = ()=> {
                detailsDOM.setAttribute("open","");
                if (targetEl.closest("section").classList.contains("individuals")) {            // hotfix for membership page
                    const detailsDimensions = detailsDOM.getBoundingClientRect();
                    detailsDOM.style.height = "0";
                    targetEl.querySelector(".mobile-more").innerText = "view less";
                    tl.to(detailsDOM,{
                        duration: 1,
                        height: detailsDimensions.height,
                        ease: "expo.out"
                    },"-=3")
                };
                setDetails()
            };
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
            setTimeout(function() {
                intRunning = false;
            }, time );
        }
    })()
}
function slideItemOut(target) {
    // console.log("slideItemOut")
    const targetEl = target,
          targetActive = document.querySelector(".activeItem"),
          targetElInner = targetEl.querySelector(".service__banner--item-inner"),
          detailsDOM = targetEl.querySelector("details"),
          detailsClose = targetEl.querySelector(".service__banner--item-close"),
          targetChildren = Array.from(targetEl.children),
          detailsDOMul = detailsDOM.querySelector("ul"),
          tl = gsap.timeline();
    if (targetEl.style.zIndex) targetEl.style.zIndex = '';
    if (targetActive) {
        targetActive.classList.remove("activeItem");
    };
    setDetails = ()=> {
        setTimeout(function(){
            detailsDOM.querySelector("summary").classList.remove("details-active")
        },500);
        if (targetEl.closest("section").classList.contains("individuals")) {
            const detailsDimensions = detailsDOM.getBoundingClientRect();
            tl.to(detailsDOM,{
                duration: 1,
                height: 0,
                ease: "expo.out",
                onComplete: clearDOMchanges,
                onCompleteParams: [detailsDOM]
            }, "-=1")
            setTimeout(function(){
                targetEl.querySelector(".mobile-more").innerText = "view inclusions";
            },1250)
        };
        if (viewportWidth < 900 && viewportWidth > 700) {
            tl.to(detailsDOMul, {
                duration: 1,
                height: 0,
                ease: "expo.out"
            }, "-=1.25");
        } else if (viewportWidth < 700) {
            tl.to(detailsDOMul, {
                duration: 1,
                height: 0,
                ease: "expo.out"
            }, "-=1.25")
        } else return;
    };
    closeDetails = ()=> {
        clearDOMchanges(detailsDOMul)
        detailsDOM.removeAttribute("open");
    };
    targetChildren.forEach(function(current, index){
        if (current.classList.contains("blur")) targetChildren.splice(index, 1)
    });
    tl.to(Array.from(detailsDOMul.children).reverse(), {
        duration: 1,
        stagger: 0.15,
        opacity: 0,
        translateY: 0,
        ease:"expo.out",
        onStart: setDetails,
        onComplete: closeDetails
    }).to(targetEl, {
        duration: 1,
        height: targetEl.getAttribute("height"),
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams:[targetEl]
    }, "-=1" ).to(detailsDOM.querySelector("summary"), {
        duration: .5,
        display: "block",
        opacity: 1,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams:[detailsDOM.querySelector("summary")]
    }, "-=1" ).to(detailsClose, {
        duration: .5,
        opacity: 0,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams:[detailsClose]
    }, "-=1" ).to(targetChildren, {
        duration: .5,
        translateY: 0,
        opacity: 1,
        ease: "expo.out",
        onComplete: clearDOMchanges,
        onCompleteParams:[targetChildren]
    }, "-=.5" );
    setTimeout(function(){
        intRunning = false;
    }, time);
}
function panelSlideIn() {
    //
}
function panelSlideOut() {
    //
}