$(document).ready(function () {

	'use strict';

	// Settings to customize...
	var carouselId = 'carousel-homepage', // ID of the carousel
		randomInitialSlide = false, // true or false
		slideInterval = 6000; // number of milliseconds slide stays active
		//slideInterval = false; // if false, carousel will not automatically cycle

	var myCarousel = $('div#' + carouselId),
		carouselItems = myCarousel.find('.carousel-item'),
		numOfSlides = carouselItems.length,
		initialSlideIndex = randomInitialSlide ? Math.floor(Math.random()*numOfSlides) : 0;


	// Add animation-duration and animation-delay to each element in each carousel caption
	carouselItems.each(function () {

		$(this).find('div.carousel-caption > .animated').each(function(index) {

			var animElement = $(this),
				captionContainer = animElement.parent(),
				animDur,
				animDelay;

			if (captionContainer.hasClass('speed-slow')) {
				animDur = 1000;
				animDelay = 700 * (index + 1);
			} else if (captionContainer.hasClass('speed-fast')) {
				animDur = 500;
				animDelay = 300 * (index + 1);
			} else { // speed-normal
				animDur = 750;
				animDelay = 500 * (index + 1);
			}

			animElement.css({"animation-duration": animDur + "ms", "animation-delay": animDelay + "ms"});
		});

	});


	// Auto-generate carousel-indicators HTML
	myCarousel.append("<ol class='carousel-indicators d-none d-md-flex d-print-none' aria-label='Carousel Navigation'></ol>");
	var carouselIndicators = myCarousel.find(".carousel-indicators");
	carouselItems.each(function(index) {
		if(index === initialSlideIndex) {
            carouselIndicators.append('<li role="button" tabindex="0" data-target="#' + carouselId + '" data-slide-to="'+index+'" class="active"><span class="sr-only">Show slide '+(index + 1)+'</span></li>');
        } else {
            carouselIndicators.append('<li role="button" tabindex="0" data-target="#' + carouselId + '" data-slide-to="'+index+'"><span class="sr-only">Show slide '+(index + 1)+'</span></li>');
        }
	});

	// Add event listener to indicator items for "Enter" keypress to cycle carousel to that slide
    carouselIndicators.children('li[data-slide-to]').each(function() {
        var indicatorItem = $(this);
        indicatorItem.on('keypress', function (e) {
            var key = e.which || e.keyCode;
            if (key === 13) { // 13 is 'Enter'
                myCarousel.carousel(indicatorItem.data('slide-to'));
            }
        });
	});

	
	// Play/Pause Button

	if (numOfSlides > 1) {
		carouselIndicators.append('<li role="button" tabindex="0" class="togglePausePlay"><span class="sr-only">Pause</span></li>');
	}

    myCarousel.find('.togglePausePlay').on('click keypress', function(e) {

        var key = e.which || e.keyCode;
        if (e.type === 'click' || key === 13) { // clicked or "Enter" key pressed
            
            var playPauseButton = $(this);
            if(playPauseButton.hasClass('paused')) {
                // If a pause button, play when clicked...
                myCarousel.carousel('cycle');
                playPauseButton.toggleClass('paused').html('<span class="sr-only">Pause</span>'); // removes class
            } else {
                // If a play button, pause when clicked...
                myCarousel.carousel('pause');
                playPauseButton.toggleClass('paused').html('<span class="sr-only">Play</span>'); // adds class
            }
            return false;

		}
        
    });

	// Add swipe support for touch devices
    // Requires hammer.min.js
    if (carouselItems.length > 1 && 'Hammer' in window) {
        
        var hammerElement = document.getElementById(carouselId),
        hammerObj = new Hammer(hammerElement);

        hammerObj.on('swipeleft', function() {
            myCarousel.carousel('next');
        });
        hammerObj.on('swiperight', function() {
            myCarousel.carousel('prev');
        });

    }

	// Set initial slide to active 
	carouselItems.eq(initialSlideIndex).addClass('active');

	// For all but the initial slide...
	// add sr-only class to all animated child elements within carousel caption
	// add tabindex of -1 to all links within the carousel items
	var carouselItemsHiddenInitially = carouselItems.not('.active');
	carouselItemsHiddenInitially.find('div.carousel-caption > .animated').addClass('sr-only');
	carouselItemsHiddenInitially.find('a').attr('tabindex', '-1');

	myCarousel.on('slid.bs.carousel', function () {

		var hiddenCarouselItems = carouselItems.not('.active'),
		activeCarouselItem = carouselItems.filter('.active');

		// Needed in conjunction with the CSS for restarting the CSS animation
		hiddenCarouselItems.find('div.carousel-caption > .animated').addClass('sr-only');
		activeCarouselItem.find('div.carousel-caption > .animated').removeClass('sr-only');

		// Set the tabindex to remove focus from slides that are not visible
		hiddenCarouselItems.find('a').attr('tabindex', '-1');
		activeCarouselItem.find('a').removeAttr('tabindex');

	});

	// Initialize the carousel
	myCarousel.carousel({ interval:slideInterval });

});
