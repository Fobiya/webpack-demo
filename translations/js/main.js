window.params = { isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent), isIOS: /iPhone|iPad|iPod/i.test(navigator.userAgent) };

function exist(el) { if ($(el).length > 0) { return true; } else { return false; } }

function ajust_page_height() {
    var footer_height = jQuery('.footer').outerHeight();
    var window_height = jQuery(window).height();
    jQuery('.offer').css('min-height', window_height - footer_height);
}
jQuery(document).ready(function($) {
    $('.js-toggle-signup-form').on('click', function(event) {
        event.preventDefault();
        // var formclassname = '.signup-form';
        $('.signup-form').toggleClass('active');
        $('.signup-form--bg').toggleClass('active');
        // if ($(window).width() <= 1199) { 
        // 	openPopup('#modal-popup'); 
        // }
    });
    /*$('.signup-form--bg').on('click', function(event) {*/
    $('.signup-form--bg-btn').on('click', function(event) {
    	event.preventDefault();
        $('.signup-form').toggleClass('active');
        $('.signup-form--bg').toggleClass('active');
    });
    ajust_page_height();
    $(window).on('resize', function(event) {
        event.preventDefault();
        ajust_page_height();
    });
    $('.fancybox').fancybox({});

    function openPopup(popup) { $.fancybox.open([{ src: popup, type: 'inline', opts: {} }], { loop: false,touch:false }); }

    function update_widget(from, to, display, raw) {
        var widget_id = '.' + from + to;
        var fallClass = 'falling';
        var riseClass = 'rising'
        var widget = $(widget_id);
        var widgetPrice = widget.find('.price');
        var widgetChange = widget.find('.change-price');
        var widgetChangePt = widget.find('.cahnge-percent');
        var oldPrice = widgetPrice.attr('data-price');
        var newPrice = raw[to].PRICE;
        widgetPrice.attr('data-price', newPrice);
        widgetPrice.text(display[to].PRICE);
        if (oldPrice) {
            if (oldPrice > newPrice) {
                widgetPrice.addClass(fallClass);
                setTimeout(function() { widgetPrice.removeClass(fallClass); }, 1500);
            } else if (oldPrice < newPrice) {
                widgetPrice.addClass(riseClass);
                setTimeout(function() { widgetPrice.removeClass(riseClass); }, 1500);
            }
        }
        var change = display[to].CHANGEDAY;
        widgetChange.text(change);
        if (raw[to].CHANGEDAY > 0) {
            widgetChange.addClass(riseClass);
            widgetChange.removeClass(fallClass);
        } else if (raw[to].CHANGEDAY < 0) {
            widgetChange.addClass(fallClass);
            widgetChange.removeClass(riseClass);
        } else {
            widgetChange.removeClass(fallClass);
            widgetChange.removeClass(riseClass);
        }
        widgetChangePt.text(display[to].CHANGEPCTDAY + '%');
        if (raw[to].CHANGEPCTDAY > 0) {
            widgetChangePt.addClass(riseClass);
            widgetChangePt.removeClass(fallClass);
        } else if (raw[to].CHANGEPCTDAY < 0) {
            widgetChangePt.addClass(fallClass);
            widgetChangePt.removeClass(riseClass);
        } else {
            widgetChangePt.removeClass(fallClass);
            widgetChangePt.removeClass(riseClass);
        }
    }

    function load_data(pairs) {
        var from = [];
        var to = [];
        $.each(pairs, function(index, val) {
            from.push(val.from);
            to.push(val.to);
        });
        $.ajax({
            type: 'GET',
            url: '//min-api.cryptocompare.com/data/pricemultifull?fsyms=' + from.join() + '&tsyms=' + to.join(),
            data: null,
            success: function(data, textStatus, jQxhr) {
                console.log(data);
                $.each(pairs, function(index, val) { update_widget(val.from, val.to, data.DISPLAY[val.from], data.RAW[val.from]); });
            },
            error: function(jqXhr, textStatus, errorThrown) { console.log(jqXhr); }
        })
    }
    if (typeof pairs !== 'undefined') {
        setInterval(function() { load_data(pairs); }, 15000);
        load_data(pairs);
    }
    var debug = true;
    if (getCookie("user_name")) {
        $('#firstName').text(getCookie("user_name"));
        $('#login').text(getCookie("user_username"));
        $('#password').text(getCookie("user_password"));
    }

    function generatePassword() {
        var length = 8,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) { retVal += charset.charAt(Math.floor(Math.random() * n)); }
        return retVal;
    }

    function setCookie(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') { c = c.substring(1); }
            if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); }
        }
        return "";
    }
    // var telInput = $("[type='tel']");
    // var allowedCountries = [];
    // $.ajax({
    //     url: theme.ajax_url,
    //     data: { 'action': 'countries' },
    //     complete: function(resp) {
    //         ob = $.parseJSON(resp.responseText);
    //         responseC = $.parseJSON(ob);
    //         countries = responseC.data;
    //         if (countries) { for (var inc = 0; inc < countries.length; inc++) { if (countries[inc].conversionLoginAllowed == 1) { allowedCountries.push(countries[inc].countryCode); } } }
    //         telInput.intlTelInput({ onlyCountries: allowedCountries, utilsScript: theme.url + "/js/utils.js", customPlaceholder: function(selectedCountryPlaceholder, selectedCountryData) { return selectedCountryPlaceholder; } });
    //     }
    // });
    // var reset = function() { telInput.removeClass("error"); };
    // telInput.keyup(function() {
    //     if ($.trim($(this).val())) {
    //         if ($(this).intlTelInput("isValidNumber")) { $(this).closest('form').find('.pin').prop('disabled', false); } else {
    //             $(this).addClass("error");
    //             $(this).closest('form').find('.pin').prop('disabled', true);
    //         }
    //     } else { $(this).closest('form').find('.pin').prop('disabled', true); }
    // });
    // telInput.on("keyup change", reset);

    // function add_user_to_list(list, email, name) {
    //     var url = list.replace('/post?', '/post-json?').concat('&c=?');
    //     var data = { 'EMAIL': email }
    //     var name_array = name.split(' ');
    //     if (name_array[0]) { data.FNAME = name_array[0]; }
    //     if (name_array[1]) { data.LNAME = name_array[1]; }
    //     $.ajax({
    //         url: url,
    //         data: data,
    //         success: function(resp) {
    //             if (debug) {
    //                 console.log('Mailchimp success:');
    //                 console.log(resp);
    //             }
    //         },
    //         dataType: 'jsonp',
    //         error: function(resp, text) { if (debug) { console.log('mailchimp ajax submit error: ' + text); } }
    //     });
    // }

    function sendPin(button) {
        var self = button,
            phoneNumber = self.closest('form').find('input[name=phone]').intlTelInput("getNumber");
        phoneNumber = phoneNumber.replace('+', ''), country = self.closest('form').find('input[name=phone]').intlTelInput("getSelectedCountryData"), isOtpBtn = self.hasClass('otp-button');
        data = { 'action': 'send_otp', 'message': 'Your verification code is ##OTP##', 'phone': phoneNumber }
        if (debug) {
            console.log('Country:');
            console.log(country);
        }
        setCookie('phone', phoneNumber, 1);
        setCookie('phoneCountryCode', country.dialCode, 1);
        setCookie('countryName', country.name, 1);
        $.ajax({
            url: theme.ajax_url,
            data: data,
            type: 'POST',
            beforeSend: function() { if (isOtpBtn) { self.addClass('sending'); } },
            success: function(data) {
                var lastChar = data.substr(data.length - 1);
                if (lastChar == 0 || lastChar == 1) { data = data.substring(0, data.length - 1); }
                var ob = $.parseJSON(data),
                    result = ob.type,
                    message = ob.message.replace('_', ' ');
                if (debug) {
                    console.log('Pin send response:');
                    console.log(ob);
                }
                if (isOtpBtn) { self.removeClass('sending'); }
                if (result === 'success') {
                    if (self.closest('.otp-form').length) {
                        $('.otp-section').removeClass('otp-section--reenter');
                        $('.pin-tab').fadeIn('slow/400/fast', function() { $(this).addClass('active'); });
                        $('.phone-tab').removeClass('active').css('display', 'none');;
                        swal({ text: swal_strings.phoneChanged, icon: 'success' })
                    }
                    return true;
                } else { return false; }
            }
        });
    }

    function addCommentLead(comment, id) {
        var comment = comment || '',
            id = id || '';
        data = { 'action': 'add_comment', 'comment': comment, 'id': id }
        $.ajax({
            url: theme.ajax_url,
            data: data,
            type: 'POST',
            complete: function(data) {
                if (debug) {
                    console.log('addCommentLead response: ');
                    console.log(data);
                }
            }
        });
    }
    $('.otp-button').click(function() { sendPin($(this)); });
    $('.otp-section__reenter').click(function(e) {
        e.preventDefault();
        var otpSection = $(this).closest('.otp-section');
        otpSection.addClass('otp-section--reenter');
        $('.pin-tab').removeClass('active');
        $('.phone-tab').fadeIn('slow/400/fast', function() { $(this).addClass('active'); });
        otpSection.find('#phone').attr('required', true);
    });

    function validPin(pin, callback) {
        var phone = getCookie('phone'),
            data = { 'action': 'verify_otp', 'pin': pin, 'phone': phone }
        $.ajax({
            url: theme.ajax_url,
            data: data,
            type: 'POST',
            success: function(data) {
                var lastChar = data.substr(data.length - 1);
                if (lastChar == 0 || lastChar == 1) { data = data.substring(0, data.length - 1); }
                var ob = $.parseJSON(data),
                    result = ob.type,
                    message = ob.message.replace('_', ' ');
                var leadId = getCookie('user_leadId');
                if (result === 'success') {
                    addCommentLead('Approved Mobile Number - ' + getCookie('phone') + ';', leadId);
                    addCommentLead('Approved Country - ' + getCookie('countryName') + ';', leadId);
                    callback();
                    return true;
                } else {
                    if (message == 'already verified') {
                        addCommentLead('Approved Mobile Number - ' + getCookie('phone') + ';', leadId);
                        addCommentLead('Approved Country - ' + getCookie('countryName') + ';', leadId);
                        callback();
                        return true;
                    } else { swal({ title: "Ooops!", text: swal_strings.pinNotVerified, icon: 'error' }); return false; }
                }
            },
        }).always(function() { $('.submit-pin-btn').removeClass('sending'); });
    }
    $('.register-form').submit(function(event) {
        event.preventDefault();
        var self = $(this),
            submitButton = self.find('button[type="submit"]');
        var mailchimp_list = self.find('input[name="mailchimp_list"]').val(),
            firstName = self.find('input[name=firstName]').val(),
            lastName = self.find('input[name=lastName]').val(),
            email = self.find('input[name=email]').val(),
            country = self.find('input[name=phone]').intlTelInput("getSelectedCountryData"),
            countryCode = country.iso2,
            phoneNumber = self.find('input[name=phone]').intlTelInput("getNumber"),
            phone = phoneNumber.replace('+', '').replace(country.dialCode, ''),
            languageCode = 'en';
        switch (countryCode) {
            case 'ua':
                languageCode = 'ru'
                break;
            case 'ru':
                languageCode = 'ru'
                break;
            case 'by':
                languageCode = 'ru'
                break;
            case 'de':
                languageCode = 'de'
                break;
            case 'fr':
                languageCode = 'fr'
                break;
            case 'it':
                languageCode = 'it'
                break;
            case 'es':
                languageCode = 'es'
                break;
            default:
                languageCode = 'en';
        }
        var formData = { 'action': 'register', 'firstName': firstName, 'lastName': lastName, 'email': email, 'phone': phoneNumber, 'countryCode': countryCode, 'languageCode': languageCode, 'password': generatePassword() };
        if (self.find('input[name="affiliateId"]').length) {
            formData.affiliateId = self.find('input[name="affiliateId"]').val();
            console.log('affiliate is');
        }
        if (self.find('input[name="subtracking"]').length) { formData.subtracking = self.find('input[name="subtracking"]').val(); }
        if (self.find('input[name="tracking"]').length) { formData.tracking = self.find('input[name="tracking"]').val(); }
        if (debug) {
            console.log('Form data before send:');
            console.log(formData);
        }
        $.ajax({
            type: 'POST',
            url: theme.ajax_url,
            data: formData,
            beforeSend: function() { submitButton.addClass('sending'); },
            success: function(data) {
                ob = $.parseJSON(data);
                response = ob.data;
                if (debug) {
                    console.log('Form submit response:');
                    console.log(response);
                    console.log(data);
                }
                if (typeof response !== 'undefined') {
                    if (response.hasOwnProperty('leadId')) {
                        sendPin(submitButton);
                        var rediretcLink = self.data('redirect');
                        setCookie('user_name', response.firstName, 1);
                        setCookie('user_lead', response.leadId, 1);
                        setCookie('user_email', response.email, 1);
                        setCookie('user_username', response.username, 1);
                        setCookie('user_password', formData.password, 1);
                        setCookie('user_leadId', response.leadId, 1);
                        var leadId = response.leadId;
                        addCommentLead('Unverified Mobile Number - ' + formData.phoneNumber + ';', leadId);
                        addCommentLead('Unverified Country - ' + getCookie('countryName') + ';', leadId);
                        $('form').each(function(index, el) {
                            submitButton.removeClass('sending');
                            $(this)[0].reset();
                        });
                        var redirect = '';
                        if (redirects.otp_redirect == 'true') { redirect = redirects.otp; } else { redirect = redirects.success; }

                        function getUrlParameter(name, url) { name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]'); var regex = new RegExp('[\\?&]' + name + '=([^&#]*)'); var results = regex.exec(url); return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' ')); };
                        $.ajax({ type: 'POST', url: theme.ajax_url, data: { 'action': 'save_lead', 'name': response.firstName + ' ' + response.lastName, 'email': response.email, 'leadId': response.leadId, 'url': getUrlParameter('page', redirect) } });
                        setTimeout(function() { window.top.location.href = redirect; }, 500);
                    }
                } else {
                    var errorMessage = swal_strings.errorMessage;
                    if (data) {
                        var data_json = $.parseJSON(data);
                        errorMessage += ': ' + data_json.errorMessage;
                    }
                    swal({ title: 'Ooops!', text: errorMessage, icon: 'error' })
                    submitButton.removeClass('sending');
                }
            }
        });
    });
    $('.otp-form').submit(function(event) {
        event.preventDefault();
        var self = $(this),
            pinCode = $('input[name=OTP]').val(),
            submitButton = $(this).find('button[type="submit"]'),
            rediretcLink = self.data('redirect'),
            callback = function() {
                swal({ closeOnClickOutside: false, title: swal_strings.pinIsVerified, icon: "success" })
                setTimeout(function() { window.top.location.href = redirects.success; }, 500);
            };
        submitButton.addClass('sending');
        validPin(pinCode, callback);
    });
});