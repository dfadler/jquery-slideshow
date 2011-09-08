(function ($) {
	$.fn.slideshow = function (options) {

		return this.each(function () {
			
			var $cont = this,
				
				// $options = options;
				
				
			function Slideshow (cont,opts) {
				this.container = cont;
				this.width = $(cont).width();
				this.height = $(cont).height();
				this.opts = $.extend({}, $.fn.slideshow.defaults, options);
				this.slides = this.opts.slideSelector ? $(this.opts.slideSelector, this.container) : $(this.container.children).splice(0,this.container.children.length);
			}
			
			

			// var contWidth = $($cont).width();
			// var contHeight = $($cont).height();

			

			// $cont.opts = $.extend({}, $.fn.slideshow.defaults, $options);

			// var opts = $cont.opts;

			// $cont.slides = $cont.opts.slideSelector ? $($cont.opts.slideSelector, $cont) : $($cont.children).splice(0,$cont.children.length);

			var slides = $cont.slides;

			slides.currentSlide = 0;

			var currentSlide = slides.currentSlide;

			slides.slideCount = slides.length;
			var slideCount = slides.slideCount;
			var lastSlide = slideCount - 1;
			
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
					if(currentSlide > 0) {
					currentSlide -= 1;
					go(currentSlide);
					} else {
					currentSlide = lastSlide;
					go(currentSlide);
					}
					break;

				default:
					console.log('Default');
					break;
				}
			}

			function go(i) {
				$(slides)
					.removeClass('active')
					.css({
					'opacity':0
				});
				$(slides[i])
					.addClass('active')
					.css({
					'opacity':1
				});
			}

			if($($cont).css('position') != 'relative') {
				$($cont).css({'position':'relative'});
			}

			if($(slides).css('position') != 'absolute' ) {
				$(slides).css({
					'position':'absolute',
					'top':0,
					'left':0,
					'z-index':0
				});

				if(opts.autoSizeSlides) {
					$(slides).css({
					'height': contHeight,
					'width': contWidth
					}).wrapInner('<div class="slide-content" style="height:100%;" />');
				}
			}

			$(slides).each(function(){
				if($(this).index() != 0) {
					$(this).css({'opacity':0});
				} else {
					$(this).css({'z-index':1}).addClass('active');
				}

			});


			function indexExists(arr,obj) {
				return (arr.indexOf(obj) != -1);
			}

			if(indexExists(opts.controls,true)){
				$($cont).append('<section class="control-panel" />');
				$cont.controlPanel = $('.control-panel',$cont);
				controlPanel = $cont.controlPanel;

				$(controlPanel).css({
					'position': 'absolute',
					'top': 0,
					'left': 0,
					'height': contHeight,
					'width': contWidth,
					'background-color': 'transparent',
					'z-index': 99
				});
			}



			$($cont).click(function() {
				advance('next');
			}).mouseover(function() {
				
			}).mouseleave(function() {
				
			});

		});

	};

	$.fn.slideshow.defaults = {
		autoSizeSlides:                true,
		clickNext:                     false, // True advances the slidehshow if clicked, fasle will require the use of the controls or pre/next
		controls:         [true,false,false], // True will display controlls wherease false will not
		newControls:                   false,
		controlsClick:                  true, // True will require a click event to use the controls false use the mouseover event
		loop:                           true, // True 
		nextSlide:                     false, // Selector
		prevSlide:                     false, // Selector
		slideSelector:                  null, // By default the slideshow will transition all first level children, if you so desire you can pass a selector such as ".slide"
		// slideLoader:                   'url',
		speed:                           300, // Animation speed for slide progression
		timeout:                        2000  // Autoplay speed; Use 0 to disable autoplay
	};
})(jQuery);