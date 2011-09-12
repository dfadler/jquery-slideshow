$(function () {

	// autoplay: 2000,  // Autoplay speed; Use 0 to disable autoplay
	// autoSizeSlides: true, // Adds inline css to slides that matches the height and width of the container
	// captions: null, // Selector
	// captionAnimation: false,
	// containerEvent: [true, true, true], // [container click advances slideshow, stop slideshow when clicked, pauses slideshow on hover]
	// controls: [true, false], // [controls, next/prev, clicking container advances slideshow, controls hover/click]
	// controlEvent: true, // controls click/hover - true will require a control click to trigger control false will trigger on hover
	// loop: true, // Allows for the slideshow to cycle 
	// slideSelector: null, // By default the slideshow will transition all first level children, if you so desire you can pass a selector such as ".slide"
	// slideAnimation: false, // Can be set to 'fade'(default) or 'slide', anything other than fade or slide will default to fade
	// speed: 300 // Animation speed for slide progression

	$('#content')
		.slideshow({
			containerEvent: [false,true,true],
			captionAnimation: 'slide',
			captions: '.caption',
			slideAnimation: 'fade',
			controls: [true, true],
			loop: false
		});

	$('#content-2')
		.slideshow({
			slideAnimation: 'slide',
			captionAnimation: 'fade',
			captions: '.caption',
			controls: [true, true],
			controlEvent: false
		});
	
	$('#content-3')
		.slideshow({
			captions: '.caption',
			controls: [true, true],
			controlEvent: false,
			loop: false
		});

});