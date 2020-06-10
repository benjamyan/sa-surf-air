/////////////////////////////////////////
/////////////////////////////////////////
// Animation ////////////////////////////
function breakStringByLine(targetEl) {                              // break down each line in string and wrap in span tag
    console.log("breakStringByLine")
    /*const originalText = ()=> {
            if (targetEl.innerHTML.indexOf("<br>") !== -1) {
                const targetArr = targetEl.innerHTML.split("<br>");
                let newHTML;
                targetArr.forEach(function(current, index, arr){
                    console.log(current)
                    if (current) {
                        newHTML += `<span>${current}</span>`
                        // targetEl.innerText.replace(current,"")
                    }
                });
                targetEl.innerHTML = newHTML;
                targetEl.innerText.replace("undefined", "");
            } else {
                targetEl.innerHTML
            }
          };*/
    const originalText = targetEl.innerHTML,
          innerSpan = document.createElement("span"),
          spanHeight = targetEl.offsetHeight,
          innerSpanStyles = "position:absolute; left:0; right:0; text-align:center;",
          spanParentStyles = `height:${spanHeight}px; position:relative; overflow:hidden; width:100%;`;
    clearText = ()=> {
        targetEl.innerHTML = '';
        targetEl.appendChild(innerSpan);
    };
    buildSpan = ()=> {
        innerSpan.innerHTML += originalText;
        innerSpan.style.cssText = innerSpanStyles;
        innerSpan.parentElement.style.cssText = spanParentStyles;
    };
    clearSpanAndStyles = function() {
        targetEl.removeAttribute("style");
        targetEl.innerHTML = originalText;
    };
    clearText(), buildSpan();
}
function numCountUpAnimation(targetArr) {
    targetArr.forEach(function(current){
        const count = { val:0 },
              newVal = parseInt(current.innerText);
        TweenLite.to(count,1,{
            duration: 1,
            val: newVal, roundProps:"val", onUpdate:function() {
                current.innerHTML = count.val;
            },
            ease: "expo.out"
        });
    })
}
function numberTransition(targetEl, nextTarget) {
    console.log("numberTransition")
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
    }).from( nextTarget.querySelectorAll("h1"), {
        translateY: 0,
        opacity: 0
    }, "-=1").to( nextTarget.querySelectorAll("h1"), {
        duration: 1,
        opacity: 1,
        ease: "expo.out",
        onStart: numCountUpAnimation(Array.from(nextTarget.querySelectorAll("h1"))),
        onComplete: clearDOMchanges,
        onCompleteParams: [Array.from(nextTarget.querySelectorAll("h1"))]
    }, "-=0.9");
}
function textTransition(targetEl, nextTarget) {
    console.log("textTransition")
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
        translateY: 200,
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
        onCompleteParams: [nextTarget, ...targetArr]
    }, "-=0.9");
}
function textWrap(targetEl,del=0.5,dur=1.5,stag=0,trans=25,ease="expo.out",pos="-=1.35") {
    const tl = gsap.timeline();
    breakStringByLine(targetEl);
    tl.from( 
        targetEl.children, 
        { 
            delay: del,
            duration: dur,
            stagger: stag,
            translateY: trans,
            opacity: 0,
            ease: ease
        }, pos
    );
}
function fadeElIn(targetEl,del=0,dur=1,stag=.15,offset=50) {            // fade in effect for DOM elements
    const tl = gsap.timeline();
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
            ease:"expo.out"
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
            ease:"expo.out"
        } );
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
    if (targetActive) {
        targetActive.classList.remove("activeItem");
    };
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
    tl.to (Array.from(detailsDOMul.children).reverse(), {
        duration: 1,
        stagger: 0.15,
        opacity: 0,
        translateY: 0,
        ease:"expo.out",
        onComplete: closeDetails
    }).to(targetEl, {
        duration: 1,
        height: targetEl.offsetHeight / 1.75,
        ease: "expo.out",
        onComplete: clearDOMchanges
    }, "-=1" ).to(detailsDOM.querySelector("summary"), {
        duration: .5,
        display: "block",
        opacity: 1,
        ease: "expo.out",
    }, "-=1" ).to(detailsClose, {
        duration: .5,
        opacity: 0,
        ease: "expo.out"
    }, "-=1" ).to(targetChildren, {
        duration: .5,
        translateY: 0,
        opacity: 1,
        ease: "expo.out",
        onComplete: clearDOMchanges
    }, "-=.5" )
}
function panelSlideIn(targetEl) {                                       // slide panel of DOM element into viewport
    //
}
function panelSlideOut(targetEl) {
    //
}