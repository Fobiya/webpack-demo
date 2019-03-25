$(document).ready(function() {

// NAVIGATION LOGO SCROLL TOP
$('.logo').on('click', function(e) {
    e.preventDefault();
    $('.nav-toggle').removeClass('open');
    $('.menu-left').removeClass('collapse');
    $('html, body').animate({
      scrollTop: 0
    }, 750, 'easeInOutQuad')
  });
  // LINKS TO ANCHORS
  $('.main a[href^="#"]').on('click', function(event) {
  
    var $target = $(this.getAttribute('href'));
  
    if($target.length) {
      event.preventDefault();
      $('html, body').stop().animate({
        scrollTop: $target.offset().top
      }, 750, 'easeInOutQuad');
    }
  });
  
  // TOGGLE HAMBURGER & COLLAPSE NAV
  $('.nav-toggle').on('click', function() {
    $(this).toggleClass('open');
    $('.menu-left').toggleClass('collapse');
  });
  // REMOVE X & COLLAPSE NAV ON ON CLICK
  $('.main .menu-left a').on('click', function() {
    $('.nav-toggle').removeClass('open');
    $('.menu-left').removeClass('collapse');  
  });
  
  // SHOW/HIDE NAV
  
  // Hide Header on on scroll down
  var didScroll;
  var lastScrollTop = 0;
  var delta = 5;
  var navbarHeight = $('.main').outerHeight();
  
  $(window).scroll(function(event){
      didScroll = true;
  });
  
  setInterval(function() {
      if (didScroll) {
          hasScrolled();
          didScroll = false;
      }
  }, 250);
  
  function hasScrolled() {
      var st = $(this).scrollTop();
  
      // Make sure they scroll more than delta
      if(Math.abs(lastScrollTop - st) <= delta)
          return;
  
      // If they scrolled down and are past the navbar, add class .nav-up.
      // This is necessary so you never see what is "behind" the navbar.
      if (st > lastScrollTop && st > navbarHeight){
          // Scroll Down
          $('.main').removeClass('show-nav').addClass('hide-nav');
          $('.nav-toggle').removeClass('open');
          $('.menu-left').removeClass('collapse');
      } else {
          // Scroll Up
          if(st + $(window).height() < $(document).height()) {
              $('.main').removeClass('hide-nav').addClass('show-nav');
          }
      }
  
      lastScrollTop = st;
  };


});


$(document).ready(function() {

    setTimeout(function() { 
        
        $('#linker').addClass('open__links');

     }, 3550);
    

});

 



 $(document).ready(function() {

    $('#linker').click(function(){ 
        $("#delete").remove();
        $('.none__open').removeClass('none__open');
    });
    

 });



 

$(window).scroll(function(){
    if ($(window).scrollTop() <= 700) {
        $('.main').removeClass('main-red');

    }
    else {
        $('.main').addClass('main-red');
     
    }
});





$(document).ready(function() {
    $(".thx__up").magnificPopup({
        mainClass: "mfp-fade"
    });
});


$(document).ready(function() {
    $(".two_sec").magnificPopup({
        mainClass: "mfp-fade"
    })
}); 
$(document).ready(function() {
    $(".best__intensiv").magnificPopup({
        mainClass: "mfp-fade"
    });
});


$(document).ready(function() {
	$("#edownload__two").click(function() {
	
			document.getElementById("downl__two").click();
			document.getElementById("downl__one").click();
	
	});
});

$(document).ready(function(){$("#menu-left #menu-item-116,#menu-left #menu-item-117").click(function(){$("#menu-item-119").addClass("current_page_item")}),$("#menu-left a").click(function(){$("#menu-item-119").removeClass("current_page_item"),$("#menu-item-149").removeClass("current_page_item")})});
 
$(document).ready(function() {
    $("[class*='feedback-form'][name=submit]").click(function() {
        $(":input.error").removeClass("error"), $(".allert").remove();
        var i, n = $(this),
            p = n.closest("form").find("[required]"),
            s = n.closest("form").find("input, textarea, select");
        return $(p).each(function() {
            if ("" == $(this).val()) {
                $(this);
                return $(this).addClass("error").parent(".field").append('<div class="allert"><span>Fill this field</span></span><i class="ion-alert-circled"></i></div>'), i = 1, void $(":input.error:first").focus()
            }
            var n = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{1,20}\.)?[a-z]{1,20}$/i;
            "email" == $(this).attr("type") && (n.test($(this).val()) || ($("[name=email]").val(""), $(this).addClass("error").parent(".field").append('<div class="allert"><span>Укажите коректный e-mail</span><i class="ion-alert-circled"></i></div>'), i = 1, $(":input.error:first").focus()));
			
			  "file" == $(this).attr("type") && (n.test($(this).val()) || ($("[name=fileFF[]]").val(""), $(this).addClass("error").parent(".field").append('<div class="allert"><span>Укажите коректный e-mail</span><i class="ion-alert-circled"></i></div>'), i = 1, $(":input.error:first").focus()));
		
			  "file" == $(this).attr("type") && (n.test($(this).val()) || ($("[name=rfileFF[]]").val(""), $(this).addClass("error").parent(".field").append('<div class="allert"><span>Укажите коректный e-mail</span><i class="ion-alert-circled"></i></div>'), i = 1, $(":input.error:first").focus()));
			 
            var p = /^()[0-9+()]{1,30}/i;
            "tel" == $(this).attr("type") && (p.test($(this).val()) || ($("[name=phone]").val(""), $(this).addClass("error").parent(".field").append('<div class="allert"><span>Укажите коректный номер телефона</span><i class="ion-alert-circled"></i></div>'), i = 1, $(":input.error:first").focus()));
			         "file" == $(this).attr("type") && (p.test($(this).val()) || ($("").val(""), $(this).addClass("error").parent(".field").append('<div class="allert"><span>Укажите коректный номер телефона</span><i class="ion-alert-circled"></i></div>'), i = 1, $(":input.error:first").focus()));
			
		
        });
    })
});







$(document).ready(function() {
 $(window).scroll(function() {
        var e = 100 * $(window).scrollTop() / ($(document).height() - $(window).height());
        $(".bar-long").css("width", e + "%")
    });
});	

