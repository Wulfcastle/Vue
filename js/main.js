jQuery(document).ready(function($){

	var contentSections = $('.cd-section'),
		navigationItems = $('#cd-vertical-nav a');

	updateNavigation();
	$(window).on('scroll', function(){
		updateNavigation();
	});

	//smooth scroll to the section
	navigationItems.on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });
    //smooth scroll to second section
    $('.cd-scroll-down').on('click', function(event){
        event.preventDefault();
        smoothScroll($(this.hash));
    });

    //open-close navigation on touch devices
    $('.touch .cd-nav-trigger').on('click', function(){
    	$('.touch #cd-vertical-nav').toggleClass('open');

    });
    //close navigation on touch devices when selectin an elemnt from the list
    $('.touch #cd-vertical-nav a').on('click', function(){
    	$('.touch #cd-vertical-nav').removeClass('open');
    });

	function updateNavigation() {
		contentSections.each(function(){
			$this = $(this);
			var activeSection = $('#cd-vertical-nav a[href="#'+$this.attr('id')+'"]').data('number') - 1;
			if ( ( $this.offset().top - $(window).height()/2 < $(window).scrollTop() ) && ( $this.offset().top + $this.height() - $(window).height()/2 > $(window).scrollTop() ) ) {
				navigationItems.eq(activeSection).addClass('is-selected');
			}else {
				navigationItems.eq(activeSection).removeClass('is-selected');
			}
		});
	}

	function smoothScroll(target) {
        $('body,html').animate(
        	{'scrollTop':target.offset().top},
        	600
        );
	}

    //open interest point description
	$('.cd-single-point').children('a').on('click', function(){
		var selectedPoint = $(this).parent('li');
		if( selectedPoint.hasClass('is-open') ) {
			selectedPoint.removeClass('is-open').addClass('visited');
		} else {
			selectedPoint.addClass('is-open').siblings('.cd-single-point.is-open').removeClass('is-open').addClass('visited');
		}
	});
	//close interest point description
	$('.cd-close-info').on('click', function(event){
		event.preventDefault();
		$(this).parents('.cd-single-point').eq(0).removeClass('is-open').addClass('visited');
	});

	//on desktop, switch from product intro div to product mockup div
	$('#cd-start').on('click', function(event){
		event.preventDefault();
		//detect the CSS media query using .cd-product-intro::before content value
		var mq = window.getComputedStyle(document.querySelector('.cd-product-intro'), '::before').getPropertyValue('content');
		if(mq == 'mobile') {
			$('body,html').animate({'scrollTop': $($(this).attr('href')).offset().top }, 200);
		} else {
			$('.cd-product').addClass('is-product-tour').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
				$('.cd-close-product-tour').addClass('is-visible');
				$('.cd-points-container').addClass('points-enlarged').one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(){
					$(this).addClass('points-pulsing');
				});
			});
		}
	});
	//on desktop, switch from product mockup div to product intro div
	$('.cd-close-product-tour').on('click', function(){
		$('.cd-product').removeClass('is-product-tour');
		$('.cd-close-product-tour').removeClass('is-visible');
		$('.cd-points-container').removeClass('points-enlarged points-pulsing');
});

    	//store service items
	var fillingBlocks = $('.cd-service').not('.cd-service-divider');

	//store service items top position into an array
	var topValueFillingBlocks = [];
	fillingBlocks.each(function(index){
		var topValue = $(this).offset().top;
		topValueFillingBlocks[topValueFillingBlocks.length] = topValue;
	});

	//add the .focus class to the first service item
	fillingBlocks.eq(0).addClass('focus');

	$(window).on('scroll', function(){
		//check which service item is in the viewport and add the .focus class to it
		updateOnFocusItem(fillingBlocks.slice(1));
		//evaluate the $(window).scrollTop value and change the body::after and body::before background accordingly (using the new-color-n classes)
		bodyBackground(topValueFillingBlocks);
	});





});

function updateOnFocusItem(items) {
	items.each(function(){
		( $(this).offset().top - $(window).scrollTop() <= $(window).height()/2 ) ? $(this).addClass('focus') : $(this).removeClass('focus');
	});
}

function bodyBackground(itemsTopValues) {
	var topPosition = $(window).scrollTop() + $(window).height()/2,
		servicesNumber = itemsTopValues.length;
	$.each(itemsTopValues, function(key, value){
		if ( (itemsTopValues[key] <= topPosition && itemsTopValues[key+1] > topPosition) || (itemsTopValues[key] <= topPosition && key+1 == servicesNumber ) ) {
			$('body').removeClass('new-color-'+(key-1)+' new-color-'+(key+1)).addClass('new-color-'+key);
		}
	});
}

