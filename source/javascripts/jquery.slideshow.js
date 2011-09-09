(function ($) {
	
	'use strict';
	
	$.fn.slideshow = function (options) {

		return this.each(function () {
			
			// // Slideshow object 
			function Slideshow(cont, opts) {
				this.container = cont;
				this.containerWidth = $(cont).width();
				this.containerHeight = $(cont).height();
				this.settings = $.extend({}, $.fn.slideshow.defaults, opts);
				this.slides = this.settings.slideSelector ? $(this.settings.slideSelector, this.container) : $(this.container.children).splice(0, this.container.children.length);
				this.currentSlide = 0;
				this.slideCount = this.slides.length;
				this.lastSlide = this.slideCount - 1;
				this.controlPanel = null;
				this.captions = null;
			}
			
			// Slideshow property variable assignments
			var that = this,
				slideshow = new Slideshow(that, options),
				container = slideshow.container,
				slides = slideshow.slides,
				opts = slideshow.settings,
				contWidth = slideshow.containerWidth,
				contHeight = slideshow.containerHeight,
				currentSlide = slideshow.currentSlide,
				lastSlide = slideshow.lastSlide,
				captions = slideshow.captions,
				controlPanel = slideshow.controlPanel,
				controlsEvent = opts.controlEvent ? 'click'  : 'mouseover',
				slideshowActive = null,
				interval = null;

			// Sets up slides for configured animation	
			switch (opts.animation) {

			case 'slide':
				$(container)
					.wrapInner('<div class="window" style="overflow:hidden;"><div class="stage" style="position:relative; left:0; width:' + contWidth * (lastSlide + 1) + 'px;"></div></div>');
				if ($(slides).css('float') !== 'left') {
					$(slides)
						.css({
							'float': 'left'
						});

					if (opts.autoSizeSlides) {
						$(slides)
							.css({
								'height': contHeight,
								'width': contWidth
							})
							.wrapInner('<div class="slide-content" style="height:100%;" />');
					}
				}
				break;

			default:
				if ($(slides).css('position') !== 'absolute') {
					$(slides)
						.css({
							'position': 'absolute',
							'top': 0,
							'left': 0
						});

					if (opts.autoSizeSlides) {
						$(slides)
							.css({
								'height': contHeight,
								'width': contWidth
							})
							.wrapInner('<div class="slide-content" style="height:100%;" />');
					}
				}

				$(slides).each(function () {
					if ($(this).index() !== 0) {
						$(this)
							.css({'opacity': 0});
					} else {
						$(this)
							.addClass('active');
					}
				});
				break;
			}	
			
			// Slideshow method to add control panel and corresponding property
			Slideshow.prototype.controls = function () {
				$(container)
					.append('<div class="control-panel" />');
				this.controlPanel = $('.control-panel', container);
			};
			
			switch (opts.captionAnimation) {
				case 'slide':
					
					break;
				default:
					
					break;
			}

			// Disables next/prev if loop is false and have reached the end of the slideshow
			function toggleNextPrev(obj, b) {
				// $(obj, controlPanel).toggleClass('disabled', b);
				
				if (b) {
					$(obj, controlPanel).addClass('disabled');
				} else {
					$(obj, controlPanel).removeClass('disabled');
				}
			}
			
			// If controls not false control panel is build
			if (opts.controls) {
				
				slideshow.controls();
        
				controlPanel = slideshow.controlPanel;

				$(controlPanel)
					.css({
						'position': 'absolute',
						'top': 0,
						'left': 0,
						'height': contHeight,
						'width': contWidth,
						'background-color': 'none',

					});
				
				// Adds controls to control panel
				if (opts.controls[0]) {
					
					$(controlPanel)
						.append('<div class="controls-container"><ul class="controls"></ul></div>');
					
					$(slides).each(function (i) {
						$('.controls', container)
							.append('<li class="control"><span>' + i + '</span></li>');
					});
					
					$(controlPanel)
						.find('.controls .control:eq(0)')
						.addClass('active');	
				}
				
				// Adds next and prev controls
				if (opts.controls[1]) {
					$(controlPanel)
						.append('<div class="prev-container"><span class="prev">Prev</span></div><div class="next-container"><span class="next">Next</span></div>');
					if (!opts.loop) {
						toggleNextPrev('.prev', true);
					}
				}
				
				// Needed for styling clickable containers if there are multiple instances of the slideshow on one page
				if (opts.containerEvent[0]) {
					$(container)
						.addClass('clickable');
				}
			}

			// Sets the Slideshow container to relative if currently static
			if ($(container).css('position') === 'static') {
				$(container)
					.css({
						'position': 'relative'
					});
			}
			
			// Animation and class progression
			function go(nextSlide) {
				
				switch (opts.animation) {

				case 'slide':
					$('.active', controlPanel)
						.removeClass('active');
					$('.controls .control:eq(' + nextSlide + ')', controlPanel)
						.addClass('active');
					$(slides)
						.removeClass('active');
					$(slides[nextSlide]).addClass('active');
					$('.stage', container)
						.stop(true)
						.animate({
							'left': -contWidth * currentSlide
						}, {duration: opts.speed});
					break;
					
				default:
					$('.active', controlPanel)
						.removeClass('active');
					$('.controls .control:eq(' + nextSlide + ')', controlPanel)
						.addClass('active');
					$(slides)
						.removeClass('active')
						.stop(true)
						.animate({
							'opacity': 0
						}, {duration: opts.speed});
					$(slides[nextSlide])
						.addClass('active')
						.stop(true)
						.animate({
							'opacity': 1
						}, {duration: opts.speed});
					break;
				}
			}

			// Current slide increment/decrement
			function advance(direction) {
			
				switch (direction) {
					
				case 'next':
					if (currentSlide < lastSlide) {
						currentSlide += 1;
						go(currentSlide);
					} else {
						currentSlide = opts.loop ? 0 : lastSlide;
						go(currentSlide);
					}
					break;
			
				case 'prev':
					if (currentSlide > 0) {
						currentSlide -= 1;
						go(currentSlide);
					} else {
						currentSlide = opts.loop ? lastSlide : 0;
						go(currentSlide);
					}
					break;
				
				// Default used for .controls .control
				default:
					go(currentSlide);
					break;
				}
				
				if (opts.controls[1] && !opts.loop) {
					currentSlide >= lastSlide ? toggleNextPrev('.next', true) : toggleNextPrev('.next', false);
					currentSlide <= 0 ? toggleNextPrev('.prev', true) : toggleNextPrev('.prev', false);
				}
			}
			
			opts.autoplay !== 0 ? slideshowActive = true : slideshowActive = false;

			function next() {
				advance('next');
			}
		    
			function prev() {
				advance('prev');
			}

		    function startSlideshow() {
				if (slideshowActive) {
					interval = window.setInterval(next, opts.autoplay);
				} 
		    }

			function stopSlideshow() {
				window.clearInterval(interval);
			}

		    startSlideshow();

			$(container)
				.bind(
					'click', 
					function () {
						if (opts.containerEvent[0]) {
							advance('next');
						}
						if (opts.containerEvent[1]) {
							slideshowActive = false;
						}
					}
				).mouseover(function () {
					if (opts.containerEvent[2]) {
						stopSlideshow();
					}
				}).mouseleave(function () {
					if (opts.containerEvent[2]) {
						startSlideshow();
					}
				});
				
			// Prevents control events from bubbling up
			$('.controls, .next, .prev', controlPanel)
				.bind(
					'click',
					function (e) {
						e.stopPropagation();
					}
				);
				
			// Events for control click/mouseover
			$('.controls .control', controlPanel)
				.bind(
					controlsEvent,
					function () {
						currentSlide = $(this).index();
						advance();
						if (opts.containerEvent[1]) {
							slideshowActive = false;
						}
					}
				);
			
			// Next and Prev click events
			$('.prev, .next', controlPanel)
				.click(
					function (params) {
						params = $(this).attr('class');
						advance(params);
						if (opts.containerEvent[1]) {
							slideshowActive = false;
						}
					}
				);

		});
	};

	// Slideshow default options
	$.fn.slideshow.defaults = {
		animation: 'fade', // Can be set to 'fade'(default) or 'slide', anything other than fade or slide will default to fade
		autoSizeSlides: true, // Adds inline css to slides that matches the height and width of the container
		captions: null, // Selector
		captionAnimation: 'fade',
		containerEvent: [true, true, true], // [container click advances slideshow, stop slideshow when clicked, pauses slideshow on hover]
		controls: [true, false], // [controls, next/prev, clicking container advances slideshow, controls hover/click]
		controlEvent: true, // controls click/hover - true will require a control click to trigger control false will trigger on hover
		loop: true, // Allows for the slideshow to cycle 
		slideSelector: null, // By default the slideshow will transition all first level children, if you so desire you can pass a selector such as ".slide"
		speed: 300, // Animation speed for slide progression
		autoplay: 2000  // Autoplay speed; Use 0 to disable autoplay
	};
	
})(jQuery);