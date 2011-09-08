(function ($) {
	
	'use strict';
	
	$.fn.slideshow = function (options) {

		return this.each(function () {
			
			function indexExists(arr, obj) {
				return (arr.indexOf(obj) !== -1);
			}
			
			function Slideshow(cont, opts) {
				this.container = cont;
				this.containerWidth = $(cont).width();
				this.containerHeight = $(cont).height();
				this.settings = $.extend({}, $.fn.slideshow.defaults, opts);
				this.slides = this.settings.slideSelector ? $(this.settings.slideSelector, this.container) : $(this.container.children).splice(0, this.container.children.length);
				this.currentSlide = 0;
				this.slideCount = this.slides.length;
				this.lastSlide = this.slideCount - 1;
				this.controlPanel = $('.control-panel', this.container);
			}
			
			var that = this,
				slideshow = new Slideshow(that, options),
				container = slideshow.container,
				slides = slideshow.slides,
				opts = slideshow.settings,
				contWidth = slideshow.containerWidth,
				contHeight = slideshow.containerHeight,
				currentSlide = slideshow.currentSlide,
				lastSlide = slideshow.lastSlide,
				controlPanel = slideshow.controlPanel;
				
			function BuildControls() {

			}
				
			if (indexExists(opts.controls, true)) {
				$(container).append('<section class="control-panel" />');

				$(controlPanel).css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'height': contHeight,
					'width': contWidth,
					'background-color': 'transparent',
					'z-index': 99
				});

				if (opts.controls[0]) {
					console.log("I'm true");
					$(controlPanel).append('<ul class="controls"></ul>');
					$(slides).each(function (i) {
						$('.controls',container).append('<li class="controls"><span>'+i+'</span></li>');
					});
				}

				if (opts.controls[1]) {

				}

				if (opts.controls[2]) {

				}
			}
				
			switch (opts.animation) {

			case 'slide':
				$(container).wrapInner('<div class="window" style="overflow:hidden;"><div class="stage" style="position:relative; left:0; width:' + contWidth * (lastSlide + 1) + 'px;"></div></div>');
				if ($(slides).css('float') !== 'left') {
					$(slides).css({
						'float': 'left'
					});

					if (opts.autoSizeSlides) {
						$(slides).css({
							'height': contHeight,
							'width': contWidth
						}).wrapInner('<div class="slide-content" style="height:100%;" />');
					}
				}

				break;
				
			default:
				if ($(slides).css('position') !== 'absolute') {
					$(slides).css({
						'position': 'absolute',
						'top': 0,
						'left': 0,
						'z-index': 0
					});

					if (opts.autoSizeSlides) {
						$(slides).css({
							'height': contHeight,
							'width': contWidth
						}).wrapInner('<div class="slide-content" style="height:100%;" />');
					}
				}

				$(slides).each(function () {
					if ($(this).index() !== 0) {
						$(this).css({'opacity': 0});
					} else {
						$(this).css({'z-index': 1}).addClass('active');
					}

				});
				break;
			}				
				
			
			function go(nextSlide) {
				
				switch (opts.animation) {

				case 'slide':
					$(slides).removeClass('active');
					$(slides[nextSlide]).addClass('active');
					
					$('.stage', container)
						.stop(true)
						.animate({
							'left': -contWidth * currentSlide
						}, {duration: opts.speed});
					break;
					
				default:		
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
			
			function advance(direction) {
			
				switch (direction) {
					
				case 'next':
					if (currentSlide < lastSlide) {
						currentSlide += 1;
						go(currentSlide);
					} else {
						currentSlide = 0;
						go(currentSlide);
					}
					break;
			
				case 'prev':
					if (currentSlide > 0) {
						currentSlide -= 1;
						go(currentSlide);
					} else {
						currentSlide = lastSlide;
						go(currentSlide);
					}
					break;
			
				default:
					break;
				}
			}

			if ($(container).css('position') !== 'relative') {
				$(container).css({'position': 'relative'});
			}

			$(container).click(function () {
				advance('next');
			}).mouseover(function () {
				
			}).mouseleave(function () {
				
			});
			

		});

	};

	$.fn.slideshow.defaults = {
		animation: 'fade',
		autoSizeSlides: true,
		clickNext: false, // True advances the slidehshow if clicked, fasle will require the use of the controls or pre/next
		controls: [true, false, false], // True will display controlls wherease false will not
		controlsClick: true, // True will require a click event to use the controls false use the mouseover event
		loop: true, // True 
		nextSlide: false, // Selector
		prevSlide: false, // Selector
		slideSelector: null, // By default the slideshow will transition all first level children, if you so desire you can pass a selector such as ".slide"
		speed: 300, // Animation speed for slide progression
		timeout: 2000  // Autoplay speed; Use 0 to disable autoplay
	};
	
})(jQuery);