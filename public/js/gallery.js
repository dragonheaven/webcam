$(function() {
	var images = [];

	$('#preloading_overlay').css('display', 'flex');

	$('#photo_module_link').on('click', function(event){
	    event.preventDefault();
	    location.replace($('#url').val() + '/#photo_module');
	});

	$('#facebook_share').on('click', function() {
  		FB.ui({
		    method: 'share',
		    display: 'popup',
		    mobile_iframe: true,
		    href: $('#url').val(),
	  	}, function(response){});
  	});

  	$('#twitter_share').on('click', function() {
  		window.open('http://twitter.com/intent/tweet/?text=Este año no pierdo mi morenito gracias al gipsyFilter, ¿qué os parece? ¡Probadlo en gipsyfilter.com!%20;&url=' + encodeURI($('#url').val()), "", "width=500, height=300");
  	});

	function getParameterByName(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
	        results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	var formdata = new FormData();
	formdata.append("_token", $('meta[name="csrf-token"]').attr('content'));
	$.ajax({
 		url: $("#url").val() + '/loadPhoto',
 		type: 'POST',
 		data: formdata,
 		processData: false,
 		contentType: false,
 		success: function(data) {
 			images = data;
 			var image_id = parseInt(getParameterByName('image_id'));
 			for (var i = 0; i < data.length; i++) {
 				var addSlide = $('<li id="slide_item_' + i + '"><img src="' + data[i]['image_url'] + '" id="slide_image_' + i + '" /><img class="slide-hover" id="slide_hover_' + i + '" src="images/close.png" /></li>');
				addSlide.appendTo('#slider ul');

				if (image_id == data[i]['id']) {
					image_id = i;
				}

				$('#slide_item_' + i).imagesLoaded(function() {
					var id = $(this)[0].elements[0].id.substr(11);
					var right = ($('#slide_item_' + id).width() - $('#slide_image_' + id).width()) / 2;
					$('#slide_hover_' + id).css('right', right + 'px');
				});

				$('#slide_item_' + image_id).imagesLoaded(function() {
					$('#preloading_overlay').fadeOut('slow', 'swing');
				});
 			}

 			$('#slider').height($('#slider').width() / 2);
			$('#slider').cbpFWSlider({
				current: image_id
			});

			var posX = - (100 / images.length) * image_id;
			$('#slider_ul').css({transform: 'translateX(' + posX + '%)'});

			$('body').on('mousemove', function(event) {
				var mx, my;
				if (event.x != undefined && event.y != undefined) {
					mx = event.x;
					my = event.y;
				} else {
					mx = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
					my = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
				}

				if ($('.slide-hover').css('display') == 'block') {
					if (mx < $('#slider').position().left || mx > ($('#slider').position().left + $('#slider').width()) || my < $('#slider').position().top || my > ($('#slider').position().top + $('#slider').height())) {
						$('.slide-hover').css('display', 'none');
						$('.cbp-fwslider nav span').css('display', 'none');
					}
				} else {
					if (mx >= $('#slider').position().left && mx <= ($('#slider').position().left + $('#slider').width()) && my >= $('#slider').position().top && my <= ($('#slider').position().top + $('#slider').height())) {
						$('.slide-hover').css('display', 'block');
						$('.cbp-fwslider nav span').css('display', 'block');
					}
				}				
			});

			$('.slide-hover').on('click', function() {
				location.replace($('#url').val());
			});
 		}
 	});
});