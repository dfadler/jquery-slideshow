$(document).ready(function(){

	// animation: 'fade', // Can be set to 'fade'(default) or 'slide', anything other than fade or slide will default to fade
	// autoSizeSlides: true, // Adds inline css to slides that matches the height and width of the container
	// captions: null, // Selector
	// captionAnimation: 'fade',
	// containerEvent: [true, true, true], // [container click advances slideshow, stop slideshow when clicked, pauses slideshow on hover]
	// controls: [true, false], // [controls, next/prev, clicking container advances slideshow, controls hover/click]
	// controlEvent: true, // controls click/hover - true will require a control click to trigger control false will trigger on hover
	// loop: true, // Allows for the slideshow to cycle 
	// slideSelector: null, // By default the slideshow will transition all first level children, if you so desire you can pass a selector such as ".slide"
	// speed: 300, // Animation speed for slide progression
	// autoplay: 2000  // Autoplay speed; Use 0 to disable autoplay


	$('#content').slideshow({
		captionAnimation: 'slide',
		captions:'.caption',
		containerEvent:[false,true,true],
		controls:[true,true],
		loop:false
	});

	$('#content-2').slideshow({
		animation:'slide',
		captions:'.caption',
		controls:[true,true],
		controlEvent: false
	});

});