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
				this.captions = this.settings.captions ? $(this.settings.captions, this.container) : null;
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
				captionHeight = null,
				controlPanel = slideshow.controlPanel,
				controlsEvent = opts.controlEvent ? 'click'  : 'mouseover',
				slideshowActive = null,
				interval = null;

			// Sets up slides for configured animation	
			switch (opts.slideAnimation) {

			case 'slide':
				$(container)
					.wrapInner('<div class="window" style="overflow:hidden; width:' + contWidth + 'px; position:relative;"><div class="stage" style="position:relative; left:0; width:' + contWidth * (lastSlide + 1) + 'px;"></div></div>');
				if ($(slides).css('float') !== 'left') {
					$(slides)
						.css({
							'float': 'left',
							'position': 'relative'
						});

					if (opts.autoSizeSlides) {
						$(slides)
							.css({
								'height': contHeight,
								'width': contWidth
							})
							.wrapInner('<div class="slide-content" />');
					}
				}
				
				break;
			
			case 'fade':
				if ($(slides).css('position') !== 'absolute') {
					$(slides)
						.css({
							'position': 'absolute',
							'top': 0,
							'left': 0,
							'opacity': 0
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

				break;
			}	
			
			$(slides).each(function () {
				if ($(this).index() !== 0) {
					$(this)
						.css({
							'z-index': 1
						});
				} else {
					$(this)
						.addClass('active')
						.css({
							'z-index': 2,
							'opacity': 1
						});
				}
			});
			
			if (captions) {

				$(captions[0])
					.addClass('active');
					
				$(captions)
					.css({
						'position': 'absolute',
						'left': 0,
						'bottom': 0
					});
				
				// Sets up captions for configured animations
				switch (opts.captionAnimation) {
					
				case 'slide':
					$(slides)
						.css({
							'overflow': 'hidden'
						});
						
					captionHeight = parseInt($(captions).css('padding-top'), 0) * 2 + $(captions).height();
					
					$(captions)
						.css({
							'bottom': -captionHeight
						});
					break;			
							
				case 'fade':
					$(captions)
						.css({
							'opacity': 0
						});
					break;	
					
				default:
					$(captions)
						.css({
							'opacity': 1
						});
					break;
				}	
			}

			// Slideshow method to add control panel and corresponding property
			Slideshow.prototype.controls = function () {
				$(container)
					.append('<div class="control-panel" />');
					
				this.controlPanel = $('.control-panel', container);
			};

			// Disables next/prev if loop is false and have reached the end of the slideshow
			function toggleNextPrev(obj, bol) {
				if (bol) {
					$(obj, controlPanel).addClass('disabled');
				} else {
					$(obj, controlPanel).removeClass('disabled');
				}
			}
			
			// Builds control panel
			if (opts.controls) {
				
				slideshow.controls();
        
				controlPanel = slideshow.controlPanel;

				$(controlPanel)
					.css({
						'position': 'absolute',
						'top': 0,
						'left': 0,
						'height': contHeight,
						'width': contWidth
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

			function toggleCaptions(bol) {
				function bolToggle(bol) {
					bol = bol ? bol = 0 : bol = -captionHeight;
				}
				
				if (captions) {
					switch (opts.captionAnimation) {

					case 'slide':
						bolToggle(bol);
						$(captions)
							.each(
								function () {
									if ($(this).hasClass('active') && $(container).hasClass('hovering')) {
										$(this)
											.animate({
												'bottom': 0
											}, {
												duration: opts.speed
											});
									} else {
										$(this)
											.stop(true)
											.animate({
												'bottom': -captionHeight
											}, {
												duration: opts.speed
											});
									}
								}
							);
						break;
					case 'fade':
						bolToggle(bol);
						$(captions)
							.each(
								function () {
									if ($(this).hasClass('active') && $(container).hasClass('hovering')) {
										$(this)
											.animate({
												'opacity': 1
											}, {
												duration: opts.speed
											});
									} else {
										$(this)
											.stop(true)
											.animate({
												'opacity': 0
											}, {
												duration: opts.speed
											});
									}
								}
							);
						break;
					default:
						bolToggle(bol);
						$(captions)
							.each(
								function () {
									if ($(this).hasClass('active') && $(container).hasClass('hovering')) {
										$(this)
											.css({
												'opacity': 1
											});
									} else {
										$(this)
											.stop(true)
											.css({
												'opacity': 1
											});
									}
								}
							);
						break;
					}
				}	
			}
			
			// Animation and class progression
			function go(nextSlide) {
				
				switch (opts.slideAnimation) {

				case 'slide':
					if (captions) {
						toggleCaptions(false);
						
						$(captions)
							.removeClass('active');
							
						$(captions[nextSlide])
							.addClass('active');
					}
					$('.active', controlPanel)
						.removeClass('active');
						
					$('.controls .control:eq(' + nextSlide + ')', controlPanel)
						.addClass('active');
						
					$(slides)
						.removeClass('active')
						.css({
							'z-index': 1
						});
						
					$(slides[nextSlide])
						.addClass('active')
						.css({
							'z-index': 2
						});
						
					$('.stage', container)
						.stop(true)
						.animate(
							{
								'left': -contWidth * currentSlide
							}, 
							{
								duration: opts.speed
							}, 
							toggleCaptions(true)
						);
					break;
				
				case 'fade':
					if (captions) {
						toggleCaptions(false);
						
						$(captions)
							.removeClass('active');
							
						$(captions[nextSlide])
							.addClass('active');
							
						toggleCaptions(true);	
					}
					
					$('.active', controlPanel)
						.removeClass('active');
						
					$('.controls .control:eq(' + nextSlide + ')', controlPanel)
						.addClass('active');
						
					$(slides)
						.removeClass('active')
						.css({
							'z-index': 1
						})
						.stop(true)
						.animate(
							{
								'opacity': 0
							}, 
							{
								duration: opts.speed
							}
						);
						
					$(slides[nextSlide])
						.addClass('active')
						.css({
							'z-index': 2
						})
						.stop(true)
						.animate(
							{
								'opacity': 1
							},
							{
								duration: opts.speed
							},
							toggleCaptions(true)
						);
					break;
				
				default:
					if (captions) {
						toggleCaptions(false);
						
						$(captions)
							.removeClass('active')
							.css({
								'opacity': 0,
								'z-index': 1
							});
							
						$(captions[nextSlide])
							.addClass('active')
							.css({
								'opacity': 1,
								'z-index': 2
							});
							
						toggleCaptions(true);	
					}
					
					$('.active', controlPanel)
						.removeClass('active');
						
					$('.controls .control:eq(' + nextSlide + ')', controlPanel)
						.addClass('active');
						
					$(slides)
						.removeClass('active')
						.css({
							'opacity': 0,
							'z-index': 1
						});
						
					$(slides[nextSlide])
						.addClass('active')
						.css(
							{
								'opacity': 1,
								'z-index': 2
							}
						);
						
					toggleCaptions(true);
					
					break;
				}
			}
			
			// Slideshow Progression
			function advance(direction) {
				
				function toggleLoop(direction) {
					if (opts.loop && direction === 'next') {
						currentSlide = 0;
					} else if (opts.loop && direction === 'prev') {
						currentSlide = lastSlide;
					} else {
						return;
					}
				}
				
				toggleCaptions(false);
				
				switch (direction) {
					
				case 'next':
					if (currentSlide < lastSlide) {
						currentSlide += 1;
						go(currentSlide);
					} else {
						toggleLoop(direction);
						go(currentSlide);
					}
					break;
			
				case 'prev':
					if (currentSlide > 0) {
						currentSlide -= 1;
						go(currentSlide);
					} else {
						toggleLoop(direction);
						go(currentSlide);
					}
					break;
				
				// Default used for .controls .control
				default:
					go(currentSlide);
					break;
				}
				
				if (opts.controls[1] && !opts.loop) {
					if (currentSlide >= lastSlide) {
						toggleNextPrev('.next', true);
					} else {
						toggleNextPrev('.next', false);
					}
					
					if (currentSlide <= 0) {
						toggleNextPrev('.prev', true);
					} else {
						toggleNextPrev('.prev', false);
					}
				}
			}
			
			if (opts.autoplay !== 0) {
				slideshowActive = true;
			} else {
				slideshowActive = false;
			}

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
			
			
			// Toggle cursor pointer
			function togglePointer(bol, obj) {
				
				bol = bol ? bol =  'pointer' : bol = 'text';
				
				$(obj)
					.css({
						'cursor': bol
					});
			}
			
			// Prevents control events from bubbling up
			$('.controls, .next, .prev, .caption', container)
				.bind(
					'click',
					function (e) {						
						e.stopPropagation();
					}
				);
			
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
						$(this).addClass('hovering');
						toggleCaptions(true);
					}
					
					if ($(container).hasClass('clickable')) {
						togglePointer(true, this);
					}
				}).mouseleave(function () {
					if (opts.containerEvent[2]) {
						startSlideshow();
						$(this).removeClass('hovering');
						toggleCaptions(false);
					}
					
					if ($(container).hasClass('clickable')) {
						togglePointer(false, this);
					}
				});
				
			
			
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
		autoplay: 2000,  // Autoplay speed; Use 0 to disable autoplay
		autoSizeSlides: true, // Adds inline css to slides that matches the height and width of the container
		captions: null, // Selector
		captionAnimation: false, // Can be set to 'fade', 'slide', or false(default)
		containerEvent: [true, true, true], // [container click advances slideshow, stop slideshow when clicked, pauses slideshow on hover]
		controls: [true, false], // [controls, next/prev, clicking container advances slideshow, controls hover/click]
		controlEvent: true, // controls click/hover - true will require a control click to trigger control false will trigger on hover
		loop: true, // Allows for the slideshow to cycle 
		slideSelector: null, // By default the slideshow will transition all first level children, if you so desire you can pass a selector such as ".slide"
		slideAnimation: false, // Can be set to 'fade'(default) or 'slide', anything other than fade or slide will default to fade
		speed: 300 // Animation speed for slide progression
	};

})(jQuery);