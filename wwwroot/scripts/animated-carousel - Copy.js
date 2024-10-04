isReadyState(function () {
	'use strict';

	// notes: set data-bs-pause in markup as explained in https://stackoverflow.com/questions/66420794/how-to-pause-carousel-in-bootstrap-5,
	//        otherwise pause() method doesn't work
	//        4/15/2023 : class "carousel-fade" on <div id="carousel-homepage"> causes a delay when clicking a slide to when the slide comes into view

	// settings to customize...
	// id of the carousel
	const carouselId = 'carousel-homepage';

    var carouselElement = document.querySelector('div#' + carouselId);
    if (carouselElement != null) {
        var carouselItems = carouselElement.querySelectorAll('.carousel-item');
        var togglePausePlayContainer = carouselElement.querySelectorAll('.togglePausePlay');

        // the value of data-bs-interval in the main carousel <div> takes precedence
        var slideInterval = Number(carouselElement.dataset.bsInterval || 6000);

        // initialize the carousel
        //var carousel = new bootstrap.Carousel(carouselElement, {
        //	interval: slideInterval,
        //	ride: 'carousel'
        //});
        var carousel = new bootstrap.Carousel(carouselElement);

        // add animation-duration and animation-delay to each element in each carousel caption
        carouselItems.forEach(item => {
            item.querySelectorAll('div.carousel-caption > .animated').forEach((caption, index) => {
                var captionContainer = caption.parentElement;
                var animDur;
                var animDelay;

                if (captionContainer.classList.contains('speed-slow')) {
                    animDur = 1000;
                    animDelay = 700 * (index + 1);
                } else if (captionContainer.classList.contains('speed-fast')) {
                    animDur = 500;
                    animDelay = 300 * (index + 1);
                } else {
                    // speed-normal
                    animDur = 750;
                    animDelay = 500 * (index + 1);
                }

                caption.style.animationDuration = animDur + 'ms';
                caption.style.animationDelay = animDelay + 'ms';
            });
        });

        var carouselIndicators = carouselElement.querySelector('.carousel-indicators');
        // add event listener to indicator items for "Enter" keypress to cycle carousel to that slide
        carouselIndicators.querySelectorAll('button[data-bs-slide-to]').forEach(item => {
            item.addEventListener('keypress', function (e) {
                var key = e.which || e.keyCode;
                // 13 is 'Enter'
                if (key === 13) {
                    carousel.to(indicatorItem.dataset.bsSlideTo);
                }
            });
        });
    }

	function DoPausePlayEvent(e) {
		// 'this' equals 'e.currentTarget', both are the togglePausePlay button
		var key = e.which || e.keyCode;
		// clicked or "Enter" key pressed
		if (e.type === 'click' || key === 13) {
			if (this.getAttribute('aria-label') === 'Pause') {
				// carousel.pause() determines the behavior when a hovering over the carousel.
				// if you don't want the carousel to cycle automatically, you need to set interval=false.
				carousel.pause();
				carousel.interval = false;
				carouselElement.dataset.bsInterval = false;
				this.classList.add('paused');
				this.setAttribute('aria-label', 'Play');
				this.innerHTML = '<span class="sr-only">Play</span>';
			}
			else {
				carousel.cycle();
				carousel.interval = slideInterval;
				carouselElement.dataset.bsInterval = slideInterval;
				this.classList.remove('paused');
				this.setAttribute('aria-label', 'Pause');
				this.innerHTML = '<span class="sr-only">Pause</span>';
			}
			return false;
		}
	}

	// handle events for togglePausePlayContainer
	['click', 'keypress'].forEach(event => {
		togglePausePlayContainer.forEach(item => {
			item.addEventListener(event, DoPausePlayEvent);
		});
	});

	// TODO : enable hammer support/code. is this needed for bs5?
	/*
	// add swipe support for touch devices. requires hammer.min.js
    if (carouselItems.length > 1 && 'Hammer' in window) {        
		var hammerElement = document.getElementById(carouselId);
        var hammerObj = new Hammer(hammerElement);

		// TODO : works without jQuery?
		hammerObj.on('swipeleft', () => {
			carousel.next();
		});
		hammerObj.on('swiperight', () => {
			carousel.prev();
        });
    }
	*/

	// for all but the initial slide...
	// add sr-only class to all animated child elements within carousel caption
	// add tabindex of -1 to all links within the carousel items
	var carouselItemsHiddenInitially = carouselElement.querySelectorAll('.carousel-item:not(.active)');
	carouselItemsHiddenInitially.forEach(item => {
		item.querySelectorAll('div.carousel-caption > .animated').forEach(caption => caption.classList.add('sr-only'));
		item.querySelectorAll('a').forEach(item => item.setAttribute('tabindex', '-1'));
	});

	carouselElement.addEventListener('slid.bs.carousel', function (e) {
		var hiddenCarouselItems = carouselElement.querySelectorAll('.carousel-item:not(.active)');
		var activeCarouselItem = carouselElement.querySelector('.carousel-item.active');

		// needed in conjunction with the CSS for restarting the CSS animation
		hiddenCarouselItems.forEach(item => {
			item.querySelectorAll('div.carousel-caption > .animated').forEach(caption => caption.classList.add('sr-only'));
		});

		// set the tabindex to remove focus from slides that are not visible
		hiddenCarouselItems.forEach(item => {
			item.querySelectorAll('a').forEach(anchor => anchor.setAttribute('tabindex', '-1'));
		});

		//activeCarouselItem.classList.remove('sr-only');
		activeCarouselItem.querySelectorAll('div.carousel-caption > .animated').forEach(caption => caption.classList.remove('sr-only'));
		activeCarouselItem.querySelectorAll('a').forEach(anchor => anchor.removeAttribute('tabindex'));
	});
});
