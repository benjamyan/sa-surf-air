var navActive = function navActive() {
  var nav = $('.header');
  $(window).scrollTop() > 100 ? nav.addClass('active') : nav.removeClass('active');
};
var scrollElement = function scrollElement(el, px, dur) {
  $("html,body").animate({
    scrollTop: $($.attr(el, "href")).offset().top - px
  }, dur);
};
var isActive = function isActive(el, target) {
  $.fn.isOnScreen = function() { 
    var win, viewport, bounds;
    win = $(window);
    viewport = { top : win.scrollTop(), left : win.scrollLeft() };
    viewport.right = viewport.left + win.width(), viewport.bottom = viewport.top + win.height();
    bounds = this.offset();
    bounds.right = bounds.left + this.outerWidth(), bounds.bottom = bounds.top + this.outerHeight();
    return (!( viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom ));
  };
  if (el.isOnScreen()) {
    if (!target.parent().hasClass("active")) target.parent().addClass("active");
  };
};
var swapActive = function swapActive(el, target, value1, value2) {
  var active = false;
  return function(el, target, value1, value2) {
    if (!active) {
      active = true;
      var a = "active";
      if (!($(el).hasClass(a))) {
        if ($(el).hasClass("numbers__icon--item")) {
          var get = $(('#' + el.id.replace(value1, value2)))[0];
          $('.' + $(el)[0].classList[0] + '.' + a)[0].classList.remove(a);
          $(el)[0].classList.add(a);
          $(target + '.' + a)[0].classList.remove(a);
          get.parentElement.parentElement.classList.add(a);
        };
      };
      setTimeout(function() {
        active = false;
      }, 1000);
    };
  };
}();
var sliderHeight = function sliderHeight(el, target, child, num) {
  var a = document.querySelector(el + " " + target).offsetHeight;
  var b = a + num;
  $(el).css("height", b + "px");
  $(el + " " + child).css("height", a + "px");
  if (w <= 500 && el == "#lifeSlider") $(el).find(".slide").css("height", b + "px");
};
/*======================================
 * =====================================
 * ======= ANIMATION FUNCTIONS =========
 * =====================================
 * ==================================*/
function parallaxScroll(el, vertical, horizontal, hook, duration) {
  var controller = new ScrollMagic.Controller();
  var build = (function() {
    $(el[0]).each(function() {
      var tl = new TimelineMax();
      var child = $(this).find(el[0].children);
      tl.to(child, 1, {
        y:((vertical) + "px"), 
        x:((horizontal) + "px"), 
        ease: Linear.easeNone 
      });
      var scene = new ScrollMagic.Scene({
        triggerElement: this,
        triggerHook: hook,
        duration: (duration + '%')
      }).setTween(tl).addTo(controller);
    });
  })();
}; 
function parallaxPinner(trigger, target, hook, dur) {
  var controller = new ScrollMagic.Controller();
  var build = (function() {
      var scene = new ScrollMagic.Scene({
        triggerElement: $(trigger)[0],
        triggerHook: (hook),
        duration: (dur + '%')
      }).setPin($(target)[0]).addTo(controller);
      $($(target)[0]).addClass("active");
	})();
};
function revealInnovation() {
  var innovationTriggers = ["#innovation2Trigger","#innovation3Trigger","#innovation4Trigger","#innovation5Trigger","#innovation6Trigger"];
  if ($("#innovationBest")[0].classList.contains("active")) {
    innovationTriggers.forEach(function(current,i) {
      isActive( $(current), $(current).children() );
      if ($(current)[0].classList.contains("active")) {
        var num = parseInt(current.match(/\d+/g)[0]);
        var remove = function remove(el) {el.classList.remove("active")};
        var add = function add(el) {el.classList.add("active")};
        remove($("#innovation"+(num-1)+"Screen")[0]), add($("#innovation"+num+"Screen")[0]);
        if (num >= 2) {
          remove($("#innovation"+(num)+"Trigger")[0]);
          if (num >= 4) remove($("#innovation"+(num-3))[0]), add($("#innovation"+num)[0]);
        };
      };
    });
  };
};
/*======================================
 * =====================================
 * =========== INITIALIZER =============
 * =====================================
 * ===================================*/
var w = $(window).width();
var h = $(window).height();
var scrollInit = function scrollInit() {
  $(window).scroll(function() {
    navActive();
    isActive($(".fueling__fg"), $(".fueling__bg")); 
    isActive($(".rewarding__bars"), $("#rewardingGraphTrigger")); 
    isActive($("#innovationBest"), $("#innovationBest").children());
    revealInnovation();
  });
};
var clickInit = function clickInit() {
  $(".header__nav ul li a, #menuToggle a").click(function(event) {
    event.preventDefault();
    navActive();
    scrollElement( this, 0, 500 );
  });
  $("#menuToggle a").click(function() {
    $("#menuToggle input").prop("checked", false);
  });
  $(".numbers__icon--item").click(function() {
    swapActive( this, ".numbers__selected", "item", "selected" );
    scrollElement( this.children[0], 100, 250 );
  });
  setTimeout(function() {
    $(".bamboo-navigation i, .bamboo-navigation li").click(function() {
      $('html,body').animate({scrollTop: $(this.closest("[id]")).offset().top - 100});
    });
  },100);
};
var resizeInit = function resizeInit() {
  var run;
  $(window).resize(function() {
    clearTimeout(run);
    run = setTimeout(function() {
      sliderHeight("#testimonialSlider", "p", ".slide", 150);
      sliderHeight("#lifeSlider", "img.fit-img", "img.fit-img", 0);
    },200);
  });
};
var baseInit = function baseInit() {
  function detect() {
    if (window.navigator.userAgent.indexOf("MSIE ") > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./)) $("body")[0].classList.add("ie");
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent) == true) $("body")[0].classList.add("osx");
  };
  function add() {
    $("#selected1").parent().parent().addClass("active");
    $("#item1").addClass("active");
    $("#innovationFocus").children()[0].children[0].classList.add("flex-h");
  };
  function size() {
    setTimeout(function() {
      sliderHeight("#testimonialSlider", "p", ".slide", 150);
      sliderHeight("#lifeSlider", "img.fit-img", "img.fit-img", 0);
      if (w <= 1000) { //iphone fix this is jenky
        $("#lifeSlider .slide:nth-child(3) .life__slide--copy").css("height","auto");
        sliderHeight("#testimonialSlider", ".slide:nth-child(1) p", ".slide", 200);
        sliderHeight("#lifeSlider", ".slide:nth-child(3) .life__slide--copy", "#lifeSlider", 150);
        setTimeout(function() {
          $("#lifeSlider .slide:nth-child(3) .life__slide--copy").css("height","");
        },50);
      };
    },100);
  };
  navActive(), detect(), add(), size();
};
var rewardInit = function rewardInit() {
  if (w >= 750) parallaxScroll( $("#rewardingParallax1"), -500, 0, 1, 200 );
  if (w >= 750) parallaxScroll( $("#rewardingParallax2"), -250, 0, 1, 200 );
};
var mentalInit = function mentalInit() {
  parallaxScroll( $("#mentalParallax0"), 0, -50, 1, 200 );
  parallaxScroll( $("#mentalParallax1"), 0, -100, 1, 200 );
  parallaxScroll( $("#mentalParallax2"), 0, 200, 1, 250 );
  parallaxScroll( $("#mentalParallax3"), 0, -300, 1, 300 );
};
var securityInit = function securityInit() {
  parallaxScroll( $("#securityFg"), -250, 0, 1, 200 );
  parallaxScroll( $("#securityBg1"), 100, -50, 1, 200 );
  parallaxScroll( $("#securityBg2"), -100, 50, 1, 200 );
  parallaxScroll( $("#securityBg3"), 100, -50, 1, 200 );
  parallaxScroll( $("#securityBg4"), 100, 0, 1, 200 );
  parallaxScroll( $("#securityBg5"), -100, -50, 1, 200 );
  parallaxScroll( $("#securityBg6"), 100, 50, 0, 200 );
};
var innovationInit = function InnovationInit() {
  if (w >= 769) parallaxScroll( $("#innovationBg1"), -250, 0, 1, 200 );
  if (w >= 769) parallaxScroll( $("#innovationBg2"), -500, 0, 1, 200 );
  if (w >= 769) parallaxScroll( $("#innovationBg3"), -500, 0, 1, 200 );
  if (w >= 769) parallaxScroll( $("#innovationBg4"), -400, 0, 1, 200 );
  if (w >= 769) parallaxScroll( $("#innovationBg5"), -300, 0, 1, 200 );
  if (w >= 769) parallaxPinner( $("#innovationFocus"), $("#innovationFocus"), 0.15, 400 );
};
var testimonialInit = function testimonialInit() {
  bamboo(document.getElementById("testimonialSlider"), {
    autoPlay: false,
    hideDot: false,
    hideArrow: false,
    prev: document.querySelector('.prev'),
    next: document.querySelector('.next'),
    dots: document.querySelector('.dots')
  });
};
var lifeInit = function lifeInit() {
  bamboo(document.getElementById("lifeSlider"), {
    autoPlay: false,
    hideDot: false,
    hideArrow: false,
    prev: document.querySelector('.prev'),
    next: document.querySelector('.next'),
    dots: document.querySelector('.dots')
  });
};
var standInit = function standInit() {
  if (w >= 767) parallaxPinner( $("#standForFocus1"), $("#standForFocus1"), 0, 100 );
  if (w >= 767) parallaxPinner( $("#standForFocus2"), $("#standForFocus2"), 0, 100 );
  if (w >= 767) parallaxPinner( $("#standForFocus3"), $("#standForFocus3"), 0, 100 );
  if (w >= 767) parallaxPinner( $("#standForFocus4"), $("#standForFocus4"), 0, 100 );
  if (w >= 767) parallaxPinner( $("#standForFocus5"), $("#standForFocus5"), 0, 100 );
  if (w >= 767) parallaxPinner( $("#standForFocus6"), $("#standForFocus6"), 0, 100 );
  if (w >= 767) parallaxPinner( $("#standForFocus7"), $("#standForFocus7"), 0, 100 );
};

(function init() {
  var domInit = {
    events: {
      0: scrollInit(),
      1: clickInit(),
      2: resizeInit(),
      3: baseInit()
    },
    slider: {
      0: testimonialInit(),
      1: lifeInit()
    },
    parallax: {
      0: rewardInit(),
      1: mentalInit(),
      2: securityInit(),
      3: innovationInit(),
      4: standInit()
    }
  };
  console.log(new Date().toUTCString());
})();