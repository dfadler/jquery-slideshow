$(document).ready(function(){

	$('#content').slideshow({
		controls:[true,true,false,true],
		loop:false
	});

	$('#content-2').slideshow({
		animation:'slide',
		controls:[true,true,true,false]
	});

});