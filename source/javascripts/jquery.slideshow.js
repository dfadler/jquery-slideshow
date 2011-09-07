(function($){

$.fn.slideshow = function(options) {

  return this.each(function() {

    $cont = this;
    
    var contWidth = $($cont).width();
    var contHeight = $($cont).height();

    $options = options;
    
    $cont.opts = $.extend({}, $.fn.slideshow.defaults, $options);
    
    var opts = $cont.opts;
    
    if($($cont).css('position') != 'relative') {
      $($cont).css({'position':'relative'});
    }

    $cont.slides = $cont.opts.slideSelector ? $($cont.opts.slideSelector, $cont) : $cont.children;
    
    var slides = $cont.slides;
    slides.currentSlide = 0;
    var currentSlide = slides.currentSlide;
    slides.slideCount = slides.length - 1;
    var slideCount = slides.slideCount;
    
    
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
        $(this).css({'z-index':1});
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
    
    var next= advance($cont,'next');
    var prev = advance($cont,'prev');
    // var go = advance($cont,)
    
    
    $($cont).click(function() {
      $(slides[next()]).addClass('active')
      
    }).mouseover(function() {
      // console.log('Mouse entered ' + $cont);
    }).mouseleave(function() {
      // console.log('Mouse has left ' + $cont);
    });

  });

};

function advance(cont,direction) {
  
  var text = 'Hello ' + direction; // local variable  
  
  // var 
  var currentSlide = cont.slides.currentSlide;
  //   // var nextCurrentSlide = currentSlide += 1;
  //   // var prevCurrentSlide = currentSlide -= 1;
  //   var slideCount = cont.slides.slideCount;
  var goSlide = null;
  
  
  switch(direction) {
    case 'next':
    
      
      var sayAlert = function() { goSlide = currentSlide += 1;  }
      return sayAlert;
      
      if(currentSlide != slideCount) {
        
  
        return nextCurrentSlide;
  
      } else {
        console.log('Else');
        currentSlide = 0;
      }
  
      break;
  
    case 'prev':
      break;
  
    default:
      console.log('Default');
      break;
  }
}

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