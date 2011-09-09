(function ($) {
	
	'use strict';
	
	$.fn.slideshow = function (options) {

		return this.each(function () {
			
			// Function to determin whether an object has an index
			function indexExists(arr, obj) {
				return (arr.indexOf(obj) !== -1);
			}
			
			// Slideshow object 
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
				controlPanel = slideshow.controlPanel,
				controlsEvent = opts.controls[3] ? 'click'  : 'mouseover';
				
			// Determines whether animation is slide or fade	
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
							'left': 0,
							'z-index': 0
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
							.css({'z-index': 1})
							.addClass('active');
					}
				});
				break;
			}	
			
			// Slideshow method to add control panel and corresponding property
			Slideshow.prototype.controls = function () {
				$(container)
					.append('<section class="control-panel" />');
				this.controlPanel = $('.control-panel', container);
			};

			// If controls not false control panel is build
			if (indexExists(opts.controls, true)) {
				
				slideshow.controls();
        
				controlPanel = slideshow.controlPanel;
				
				$(controlPanel)
					.css({
						'position': 'absolute',
						'top': 0,
						'left': 0,
						'height': contHeight,
						'width': contWidth,
						'background-color': 'transparent',
						'z-index': 99
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
				}
				
				// Needed a
				if (opts.controls[2]) {
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
			
			// Disables next/prev if loop is false and have reached the end of the slideshow
			function controlToggle(e, a) {
				a ? $(e, controlPanel).addClass('disabled') : $(e, controlPanel).removeClass('disabled');
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
				
				!opts.loop && currentSlide >= lastSlide || currentSlide <= 0 ? console.log('It works') : console.log("Doesn't work");
			}
	
			$(container)
				.bind(
					'click', 
					function () {
						if (opts.controls[2]) {
							advance('next');
						}
					}
				).mouseover(function () {
				
				}).mouseleave(function () {
				
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
					}
				);
			
			// Prev click
			$('.prev', controlPanel)
				.click(function () {
					advance('prev');
				});
			
			// Next click
			$('.next', controlPanel)
				.click(function () {
					advance('next');
				});
		});
	};

	// Slideshow default options
	$.fn.slideshow.defaults = {
		animation: 'fade', // Can be set to 'fade'(default) or 'slide', anything other than fade or slide will default to fade
		autoSizeSlides: true, // Adds inline css to slides that matches the height and width of the container
		controls: [true, false, false, true], // [controls,next/prev,clicking container advances slideshow, controls hover/click]
		loop: true, // Allows for the slideshow to cycle 
		slideSelector: null, // By default the slideshow will transition all first level children, if you so desire you can pass a selector such as ".slide"
		speed: 300, // Animation speed for slide progression
		autoplay: 2000  // Autoplay speed; Use 0 to disable autoplay
	};
	
})(jQuery);