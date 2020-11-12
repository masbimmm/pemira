(function($) {
    "use strict";
    jQuery(document).on('ready', function() {
        // Navbar Menu JS
        $(window).on('scroll', function() {
            if ($(this).scrollTop() > 80) {
                $('.top-menu').addClass('menu-shrink');
            } else {
                $('.top-menu').removeClass('menu-shrink');
            }
        });
        // $('.navbar .navbar-nav li a').on('click', function(e) {
        //     var anchor = $(this);
        //     $('html, body').stop().animate({
        //         scrollTop: $(anchor.attr('href')).offset().top - 50
        //     }, 1000);
        //     e.preventDefault();
        // });
        $(document).on('click','.navbar-collapse.show',function(e) {
            if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
                $(this).collapse('hide');
            }
        });

        // Click smooth scroll
        $('.slide-button a').on('click', function(e) {
            var anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $(anchor.attr('href')).offset().top - 50
            }, 1000);
            e.preventDefault();
        });
        // End Click smooth scroll

        // Homepage Slides JS
        $(".homepage-slides").owlCarousel({
            items: 1,
            nav: true,
            dots: false,
            touchDrag: false,
            mouseDrag: false,
            autoplay: true,
            //animateOut: 'fadeOut',
            autoplayHoverPause: true,
            loop: true,
            navText: ["<i class='icofont-long-arrow-left'></i>", "<i class='icofont-long-arrow-right'></i>"],
        });
        $(".homepage-slides").on("translate.owl.carousel", function() {
            $(".single-slider-item h1, .single-slider-item p").removeClass("animated fadeInUp").css("opacity", "0");
            $(".single-slider-item .slide-button a").removeClass("animated fadeInDown").css("opacity", "0");
        });
        $(".homepage-slides").on("translated.owl.carousel", function() {
            $(".single-slider-item h1, .single-slider-item p").addClass("animated fadeInUp").css("opacity", "1");
            $(".single-slider-item .slide-button a").addClass("animated fadeInDown").css("opacity", "1");
        });
        // End Homepage Slides JS

        // Popup Video JS
        $('.popup-youtube, .popup-vimeo').magnificPopup({
            disableOn: 300,
            type: 'iframe',
            mainClass: 'mfp-fade',
            removalDelay: 160,
            preloader: false,
            fixedContentPos: false,
        });
        // End Popup Video JS

        // WOW JS
        new WOW().init();

        // Screenshot Carousel JS
        $(".screenshot-carousel").owlCarousel({
            nav: true,
            margin: 30,
            dots: true,
            autoplay: true,
            autoplayHoverPause: true,
            smartSpeed: 500,
            loop: true,
            navText: ["<i class='icofont-swoosh-left'></i>", "<i class='icofont-swoosh-right'></i>"],
            responsive: {
                0: {
                    items: 1
                },
                600: {
                    items: 2
                },
                768: {
                    items: 3
                },
                1200: {
                    items: 4
                }
            }
        });
        // End Screenshot Carousel JS

        // Testimonial Carousel JS
        $(".testimonial-carousel").owlCarousel({
            items: 1,
            nav: false,
            dots: true,
            autoplay: false,
            margin: 40,
            smartSpeed: 500,
            autoplayHoverPause: true,
            loop: true,
            responsive: {
                0: {
                    items: 1
                },
                758: {
                    items: 2
                },
                1200: {
                    items: 3
                }
            }
        });
        // End Testimonial Carousel JS

        // Particleground JS
        $('#particles').particleground({
            dotColor: '#5cbdaa',
            lineColor: '#5cbdaa'
        });
        $('.intro').css({
            'margin-top': -($('.intro').height() / 2)
        });
        // End Particleground JS

        // Faq Js
        $(".faq-panel > .faq-title").on("click", function() {
            if ($(this).hasClass('active')) {
                $(this).removeClass("active");
                $(this).siblings('.faq-textarea').slideUp(200);
                $(".faq-panel > .faq-title i").removeClass("icofont-minus").addClass("icofont-plus");
            } else {
                $(".faq-panel > .faq-title i").removeClass("icofont-minus").addClass("icofont-plus");
                $(this).find("i").removeClass("icofont-plus").addClass("icofont-minus");
                $(".faq-panel > .faq-title").removeClass("active");
                $(this).addClass("active");
                $('.faq-textarea').slideUp(200);
                $(this).siblings('.faq-textarea').slideDown(200);
            }
        });
        var accordion = (function() {
            var $accordion = $('.js-accordion');
            var $accordion_header = $accordion.find('.js-accordion-header');
            var $accordion_item = $('.js-accordion-item');
            var settings = {
                speed: 400,
                oneOpen: false
            };
            return {
                init: function($settings) {
                    $accordion_header.on('click', function() {
                        accordion.toggle($(this));
                    });
                    $.extend(settings, $settings);
                    if (settings.oneOpen && $('.js-accordion-item.active').length > 1) {
                        $('.js-accordion-item.active:not(:first)').removeClass('active');
                    }
                    $('.js-accordion-item.active').find('> .js-accordion-body').show();
                },
                toggle: function($this) {
                    if (settings.oneOpen && $this[0] != $this.closest('.js-accordion').find('> .js-accordion-item.active > .js-accordion-header')[0]) {
                        $this.closest('.js-accordion').find('> .js-accordion-item').removeClass('active').find('.js-accordion-body').slideUp()
                    }
                    $this.closest('.js-accordion-item').toggleClass('active');
                    $this.next().stop().slideToggle(settings.speed);
                }
            }
        })();
        $(document).ready(function() {
            accordion.init({
                speed: 300,
                oneOpen: true
            });
        });
        // End Faq Js

        // Back Top JS
        $('body').append('<div id="toTop" class="back-top-button"><i class="icofont-rocket"></i></div>');
        $(window).scroll(function() {
            if ($(this).scrollTop() != 0) {
                $('#toTop').fadeIn();
            } else {
                $('#toTop').fadeOut();
            }
        });
        $('#toTop').on('click', function() {
            $("html, body").animate({
                scrollTop: 0
            }, 600);
            return false;
        });
        // End Back Top JS

        // Subscribe form
		$(".newsletter-form").validator().on("submit", function (event) {
			if (event.isDefaultPrevented()) {
			// handle the invalid form...
				formErrorSub();
				submitMSGSub(false, "Please enter your email correctly.");
			} else {
				// everything looks good!
				event.preventDefault();
			}
		});
		function callbackFunction (resp) {
			if (resp.result === "success") {
				formSuccessSub();
			}
			else {
				formErrorSub();
			}
		}
		function formSuccessSub(){
			$(".newsletter-form")[0].reset();
			submitMSGSub(true, "Thank you for subscribing!");
			setTimeout(function() {
				$("#validator-newsletter").addClass('hide');
			}, 4000)
		}
		function formErrorSub(){
			$(".newsletter-form").addClass("animated shake");
			setTimeout(function() {
				$(".newsletter-form").removeClass("animated shake");
			}, 1000)
		}
		function submitMSGSub(valid, msg){
			if(valid){
				var msgClasses = "validation-success";
			} else {
				var msgClasses = "validation-danger";
			}
			$("#validator-newsletter").removeClass().addClass(msgClasses).text(msg);
		}
		// AJAX MailChimp
		$(".newsletter-form").ajaxChimp({
			url: "https://envytheme.us20.list-manage.com/subscribe/post?u=60e1ffe2e8a68ce1204cd39a5&amp;id=42d6d188d9", // Your url MailChimp
			callback: callbackFunction
        });
    });
    jQuery(window).on('load', function() {
        jQuery(".preloader-wrap").fadeOut(500);
    });
}(jQuery));