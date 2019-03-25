import $ from 'jquery';

import 'magnific-popup';



import url from './scss/styles.scss';



$(document).ready(function() {
	$('.popup-youtube, .popup-vimeo, .popup-gmaps').magnificPopup({
		disableOn: 700,
		type: 'iframe',
		mainClass: 'mfp-fade',
		removalDelay: 160,
		preloader: false,
		fixedContentPos: false
	});
});




$(document).ready(function() { 
   $("[class*='uptimetracker'][name=uptimetracker]").click(function() {

        $(":input.error").removeClass('error');
        $(".allert").remove();
        var error;
        var btn = $(this);
        var ref = btn.closest('form').find('[required]');
        var msg = btn.closest('form').find('input, textarea');
        var send_btn = btn.closest('form').find('[name=uptimetracker]');
    
		$(ref).each(function() {
				if ($(this).val() == '') {
					var errorfield = $(this);
					$(this).addClass('error').parent('.field').append('<div class="allert"><span>Fill this field</span></div>');
					error = 1;
					$(":input.error:first").focus();
					return;
				} else {
			var pattern = /^([a-z0-9_\.-])+@[a-z0-9-]+\.([a-z]{1,20}\.)?[a-z]{1,20}$/i;
					if ($(this).attr("type") == 'email') {
						if(!pattern.test($(this).val())) {
							$("[name=email]").val('');
							$(this).addClass('error error_email').parent('.field').append('<div class="allert"><span>@ Fill this field</span></div>');
							error = 1;
							$(":input.error:first").focus();
						}
					}
					var patterntel = /^()[+0-9]{9,18}/i;
					if ( $(this).attr("type") == 'tel') {
						if(!patterntel.test($(this).val())) {
							$("[name=phone]").val('');
							$(this).addClass('error error_tel').parent('.field').append('<div class="allert"><span>tel Fill this field</span></div>');
							error = 1;
							$(":input.error:first").focus();
						}
					}
				}
			});
		

        if (!(error == 1)) {
            $(send_btn).each(function () {
                $(this).attr('disabled', true);
            });
            $(function () {
                var form = $(this).closest('form'), 
					name = form.find('.name').val();
                if ($(this).val() == '') {
                    $.ajax({
                        type: 'POST', 
				 		url: '//uds.systems/wp-content/themes/UDS/allpostTracker.php',
						data: msg, success: function () {
                    
                        
                        
					
                            
                        }, error: function (xhr, str) {
                            alert('Возникла ошибка: ' + xhr.responseCode);
                        }
                    });
					
					    $.ajax({
                        type: 'POST', 
				 	url: '//uds.systems/wp-content/themes/UDS/Tracker.php',
						data: msg, success: function () {
                    
                        
 						
							
            
                            
                        }, error: function (xhr, str) {
                            alert('Возникла ошибка: ' + xhr.responseCode);
                        }
                    });
                } else {
                 
                }
            });
        }
        return false;
    })
});
