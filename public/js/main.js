$(function() {
	var selected_photo = -1;
	var images = [];
	var currentImages;
	var file;
	var share = 0;
	var progressbar = $('.progress-bar');

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");
	var width, height;
	var imageData;
	var tmpImage;

	var uploader = new CanvasImageUploader({
	    maxSize: 1500,
	    jpegQuality: 0.7
	});
	$('#preloading_overlay').css('display', 'flex');

	// Resize Picture Area
	if ($('.picture-area').width() >= 600)
		$('.picture-area').height($('.picture-area').width() / 2);
	else
		$('.picture-area').height($('.picture-area').width());

	// Resize Photo Menu
	$('.desktop-menu').imagesLoaded(function() {
		$('#save').hide();
		$('#share').hide();
		$('#delete').hide();
		$('.right-side-menu').width($('.photo-menu').width() - $('.left-side-menu').width() - 5);
	});

	// Smooth scrolling to photo module
	$('#photo_module_link').on('click', function(event){
	    event.preventDefault();
	    
	    $('html, body').animate({
	        scrollTop: $( $.attr(this, 'href') ).offset().top
	    }, 500);
	});

	$('#camera').on('click', function() {
  		selected_photo = -1;
		if ($('#camera_view').css('display') == 'none') {
			$('.image-section div').fadeOut('slow', 'swing');
			$('#camera_view').fadeToggle("fast", "swing", function() {
				$('#camera_view').empty();
				Webcam.attach('#camera_view');
				$('.filter img').attr('src', 'images/take_photo.png');
			});
		}
	});

	$('#dropdown_camera').on('click', function() {
  		selected_photo = -1;
		$('.dropdown-menu').slideToggle("slow", "swing", function() {
			if ($('#camera_view').css('display') == 'none') {
				$('.image-section div').fadeOut('slow', 'swing');
				$('#camera_view').fadeToggle("fast", "swing", function() {
					$('#camera_view').empty();
					Webcam.attach('#camera_view');
					$('.filter img').attr('src', 'images/take_photo.png');
				});
			}
		});
	});
	
	$('#image_upload').on('change', function(e) {
		var files = e.target.files;
        if (files.length === 0)
            return;

        // Check that the file is an image
        var ext = $(this).val().split('.').pop().toLowerCase();
		if ($.inArray(ext, ['png', 'jpg', 'jpeg']) == -1) {
		    $('#invalid_overlay').css('display', 'flex');
		    return;
		}

		file = files[0];
	    var options = {
	      	maxWidth: $('#image_preview').width(),
	      	maxHeight: $('#image_preview').height(),
	      	canvas: true,
	      	pixelRatio: window.devicePixelRatio,
	      	downsamplingRatio: 0.5
	    };

	    loadImage.parseMetaData(file, function (data) {
	      	if (data.exif) {
	        	options.orientation = data.exif.get('Orientation');
	      	}

	      	loadImage(file, function(img) {
	      		if (!(img.src || img instanceof HTMLCanvasElement)) {
	      			alert('Loading Image failed');
	      		} else {
	      			$('#preloading_overlay').css('display', 'flex');
					var image_preview = new Image();
					image_preview.onload = function() {
						$('#preloading_overlay').fadeOut('slow', 'swing', function() {
							$('#image_preview').css('background-color', 'white');
							$('#image_preview').css('background-image', 'url(' + image_preview.src + ')');
						});
						
					};
					image_preview.src = img.src || img.toDataURL();
					tmpImage = img.src || img.toDataURL();
	      		}
	      	}, options);
	    });
	});

	$('.filter img').on('click', function() {
		if ($('#camera_view').css('display') == 'block') {
			$('#camera_view video').css('width', '');

			Webcam.snap( function(data_uri) {
                $('.image-section div').fadeOut('slow', 'swing');
            	$('#image_preview').show();
            	$('#upload_overlay').css('display', 'flex');
            	
                var image = new Image();
				image.onload = function() {
					var width = image.width;
					var height = image.height;

					if ($('#camera_view video').length > 0) {
						width = $('#camera_view video').width();
						height = $('#camera_view video').height();
					}

					canvas.width  = width;
	    			canvas.height = height;

					ctx.clearRect(0, 0, width, height);
					ctx.drawImage(image, 0, 0, width, height);

					imageData = ctx.getImageData(0, 0, width, height);
					showSaturation(imageData.data);
				};
				image.src = data_uri;
            });
		} else {
			if (typeof file !== 'undefined' && file != null) {
				$('#upload_overlay').css('display', 'flex');

				var image = new Image();
				image.onload = function() {
					$('#image_upload').val('');
					canvas.width  = image.width;
	    			canvas.height = image.height;

					ctx.clearRect(0, 0, image.width, image.height);
					ctx.drawImage(image, 0, 0, image.width, image.height);

					imageData = ctx.getImageData(0, 0, image.width, image.height);
					showSaturation(imageData.data);
				};
				image.src = tmpImage;
			}
		}
	});

	function showSaturation(data) {
		for (var i = 0; i < data.length; i += 4) {
			var color = [data[i], data[i + 1], data[i + 2], data[i + 3]];
			color = RGB2HSL(color);

			color[1] = color[1] * 2;

			color = HSL2RGB(color);

			data[i] = color[0];
			data[i + 1] = color[1];
			data[i + 2] = color[2];
			data[i + 3] = color[3];
		}
		
		ctx.putImageData(imageData, 0, 0);
		uploadPhoto();
	}

	function uploadPhoto() {
		var dataURL = canvas.toDataURL('image/png');
		uploader.saveCanvasToImageData($('#canvas')[0]);

		var bar = $('.bar');
		var percent = $('.percent');

		var formdata = new FormData();
		formdata.append("_token", $('meta[name="csrf-token"]').attr('content'));
		formdata.append("image", uploader.getImageData());
		$.ajax({
			xhr: function() {
			    var xhr = new window.XMLHttpRequest();
			    xhr.upload.addEventListener("progress", function(evt) {
			      	if (evt.lengthComputable) {
				        var percentComplete = (evt.loaded / evt.total * 100).toFixed(2);
				        var percentVal = percentComplete + '%';
				        bar.width(percentVal);
				        percent.html(percentVal);
			      	}
			    }, false);
			    return xhr;
			},
	 		url: $("#url").val() + '/uploadPhoto',
	 		type: 'POST',
	 		data: formdata,
	 		processData: false,
	 		contentType: false,
	 		success: function(data) {
	 			if (data == "Fail" || data == null || data.length == 0) {
		 			bar.width('0%');
					percent.html('0%');
	 				$('#upload_overlay').fadeOut('slow', 'swing');
	 				$('#alert_overlay').css('display', 'flex');
	 			} else {
	 				showUploadedPhoto(data);
	 			}
	 		}
	 	});
	}

	function hue2rgb( p, q, h ) {
		h = ( h + 1 ) % 1;
		if ( h * 6 < 1 ) {
			return p + (q - p) * h * 6;
		}
		if ( h * 2 < 1) {
			return q;
		}
		if ( h * 3 < 2 ) {
			return p + (q - p) * ((2/3) - h) * 6;
		}
		return p;
	}

	function RGB2HSL( rgba ) {
		if ( rgba[ 0 ] == null || rgba[ 1 ] == null || rgba[ 2 ] == null ) {
			return [ null, null, null, rgba[ 3 ] ];
		}
		var r = rgba[ 0 ] / 255,
			g = rgba[ 1 ] / 255,
			b = rgba[ 2 ] / 255,
			a = rgba[ 3 ],
			max = Math.max( r, g, b ),
			min = Math.min( r, g, b ),
			diff = max - min,
			add = max + min,
			l = add * 0.5,
			h, s;

		if ( min === max ) {
			h = 0;
		} else if ( r === max ) {
			h = ( 60 * ( g - b ) / diff ) + 360;
		} else if ( g === max ) {
			h = ( 60 * ( b - r ) / diff ) + 120;
		} else {
			h = ( 60 * ( r - g ) / diff ) + 240;
		}

		if ( diff === 0 ) {
			s = 0;
		} else if ( l <= 0.5 ) {
			s = diff / add;
		} else {
			s = diff / ( 2 - add );
		}
		return [ Math.round(h) % 360, s, l, a == null ? 1 : a ];
	};

	function HSL2RGB( hsla ) {
		if ( hsla[ 0 ] == null || hsla[ 1 ] == null || hsla[ 2 ] == null ) {
			return [ null, null, null, hsla[ 3 ] ];
		}
		var h = hsla[ 0 ] / 360,
			s = hsla[ 1 ],
			l = hsla[ 2 ],
			a = hsla[ 3 ],
			q = l <= 0.5 ? l * ( 1 + s ) : l + s - l * s,
			p = 2 * l - q;

		return [
			Math.round( hue2rgb( p, q, h + ( 1 / 3 ) ) * 255 ),
			Math.round( hue2rgb( p, q, h ) * 255 ),
			Math.round( hue2rgb( p, q, h - ( 1 / 3 ) ) * 255 ),
			a
		];
	};

	$('.alert-close').on('click', function() {
		$('.overlay').fadeOut('slow', 'swing');
	});

	$('.alert-link').on('click', function() {
		$('.overlay').fadeOut('slow', 'swing');
	});

  	$('#load').on('click', function() {
  		$('.image-section div').fadeOut('slow', 'swing');
		$('#image_preview').fadeIn('slow', 'swing');
		$('#image_upload').click();
  	});

  	$('#dropdown_load').on('click', function() {
		$('.dropdown-menu').slideToggle("slow", "swing", function() {
			$('.image-section div').fadeOut('slow', 'swing');
			$('#image_preview').fadeIn('slow', 'swing');
			$('#image_upload').click();
  		});
  	});

  	$('#save').on('click', function() {
		if (selected_photo >= 0) {
	  		$('a.download').attr('href', images[selected_photo]['image_url']);
	  		$('a.download').click();
	  	}
  	});

  	$('#dropdown_save').on('click', function() {
  		$('.dropdown-menu').slideToggle("slow", "swing", function() {
	  		if (selected_photo >= 0) {
		  		$('a.download').attr('href', images[selected_photo]['image_url']);
		  		$('a.download').click();
		  	}
		});
  	});

  	$('#share').on('click', function() {
  		if ($('.submenu').css('display') == 'none')
  			$('.submenu').css('display', 'inline-block');
  		else
  			$('.submenu').css('display', 'none');

  		// Resize Photo Menu
		$('.right-side-menu').width($('.photo-menu').width() - $('.left-side-menu').width() - 5);
  	});

  	$('#dropdown_share').on('click', function() {
  		$('.dropdown-submenu').slideToggle("slow", "swing");
  	});

  	// Facebook share
  	$('#facebook').on('click', function() {
  		ShowShareOverlay(1);
  	});

  	$('#dropdown_facebook').on('click', function() {
  		ShowShareOverlay(1);
  	});

  	// Twitter share
  	$('#twitter').on('click', function() {
  		ShowShareOverlay(2);
  	});

  	$('#dropdown_twitter').on('click', function() {
  		ShowShareOverlay(2);
  	});

  	function ShowShareOverlay(num) {
  		$('#share_overlay').css('display', 'flex');
  		share = num;
  	}

  	$('#facebook_share').on('click', function() {
  		FB.ui({
		    method: 'share',
		    display: 'popup',
		    mobile_iframe: true,
		    href: $('#url').val(),
	  	}, function(response){});
  	});

  	$('#twitter_share').on('click', function() {
  		window.open('http://twitter.com/intent/tweet/?text=Este año no pierdo mi morenito gracias al %23GipsyFilter, ¿qué os parece? ¡Probadlo en gipsyfilter.com!%0D&url=' + encodeURI($('#url').val()), "", "width=500, height=300");
  	});

  	$('#alert_share').on('click', function() {
  		if (selected_photo >= 0) {
  			if (share == 1) {
  				FB.ui({
				    method: 'share',
				    display: 'popup',
				    mobile_iframe: true,
				    href: $('#url').val() + "/" + images[selected_photo]['image_url'],
				    quote: 'Este año no pierdo mi morenito gracias al #GipsyFilter, ¿qué os parece? ¡Probadlo en gipsyfilter.com!',
			  	}, function(response){});
  			} else if (share == 2) {
  				window.open('http://twitter.com/intent/tweet/?text=Este año no pierdo mi morenito gracias al %23GipsyFilter, ¿qué os parece? ¡Probadlo en gipsyfilter.com!%0D&url=' + encodeURI($('#url').val() + "/" + images[selected_photo]['image_url']), "", "width=500, height=300");
  			}
  		} else {
  			$('#invalid_overlay').css('display', 'flex');
  		}
  	});

  	// Mobile dropdown menu
  	$('#dropdown_menu').on('click', function() {
  		$('.dropdown-menu').slideToggle("slow", "swing");
  	});

  	$('#delete').on('click', function() {
  		if (selected_photo >= 0) {
			$('#remove_overlay').css('display', 'flex');

			var formdata = new FormData();
			formdata.append("_token", $('meta[name="csrf-token"]').attr('content'));
			formdata.append("image_id", images[selected_photo]['id']);
			$.ajax({
		 		url: $("#url").val() + '/removePhoto',
		 		type: 'POST',
		 		data: formdata,
		 		processData: false,
		 		contentType: false,
		 		success: function(data) {
		 			$('#grid_item_' + selected_photo).remove();
		 			$('.grid').masonry('destroy');
		 			$('.grid').masonry();

					images.splice(selected_photo, 1);
					selected_photo = -1;

					$('#image_preview').css('background-color', 'transparent');
					$('#image_preview').css('background-image', 'none');
					$('#remove_overlay').fadeOut('slow', 'swing');

					$('#save').hide();
					$('#share').hide();
					$('#delete').hide();
					$('.submenu').hide();
					$('.right-side-menu').width($('.photo-menu').width() - $('.left-side-menu').width() - 5);
		 		}
		 	});
  		}
  	});

	$('#dropdown_delete').on('click', function() {
  		if (selected_photo >= 0) {
			$('#remove_overlay').css('display', 'flex');

			var formdata = new FormData();
			formdata.append("_token", $('meta[name="csrf-token"]').attr('content'));
			formdata.append("image_id", images[selected_photo]['id']);
			$.ajax({
		 		url: $("#url").val() + '/removePhoto',
		 		type: 'POST',
		 		data: formdata,
		 		processData: false,
		 		contentType: false,
		 		success: function(data) {
		 			$('#grid_item_' + selected_photo).remove();
		 			$('.grid').masonry('destroy');
		 			$('.grid').masonry();

					images.splice(selected_photo, 1);
					selected_photo = -1;

					$('#image_preview').css('background-color', 'transparent');
					$('#image_preview').css('background-image', 'none');
					$('#remove_overlay').fadeOut('slow', 'swing');

					$('#dropdown_save').hide();
					$('#dropdown_share').hide();
					$('#dropdown_delete').hide();
					$('.dropdown-submenu').hide();
					$('.right-side-menu').width($('.photo-menu').width() - $('.left-side-menu').width() - 5);
		 		}
		 	});
  		}
  	});

	$('#reload_link').on('click', function() {
  		if (selected_photo >= 0) {
			$('#remove_overlay').css('display', 'flex');

			var formdata = new FormData();
			formdata.append("_token", $('meta[name="csrf-token"]').attr('content'));
			formdata.append("image_id", images[selected_photo]['id']);
			$.ajax({
		 		url: $("#url").val() + '/removePhoto',
		 		type: 'POST',
		 		data: formdata,
		 		processData: false,
		 		contentType: false,
		 		success: function(data) {
		 			$('#grid_item_' + selected_photo).remove();
		 			$('.grid').masonry('destroy');
		 			$('.grid').masonry();

					images.splice(selected_photo, 1);
					selected_photo = -1;

					$('#image_preview').css('background-color', 'transparent');
					$('#image_preview').css('background-image', 'none');
					$('#remove_overlay').fadeOut('slow', 'swing');

					$('#save').hide();
					$('#share').hide();
					$('#delete').hide();
					$('.submenu').hide();
					$('.right-side-menu').width($('.photo-menu').width() - $('.left-side-menu').width() - 5);
		 		}
		 	});
  		}
  	});

	$('.filter').on('mouseenter', function() {
		$('.filter').css('background', 'linear-gradient(230deg, #40ffd8, #da80ff)');
		if ($('.filter img').attr('src') == 'images/filter.png')
			$('.filter img').attr('src', 'images/filter_hover.png');
		else if ($('.filter img').attr('src') == 'images/take_photo.png')
			$('.filter img').attr('src', 'images/take_photo_hover.png');
	});

	$('.filter').on('mouseleave', function() {
		$('.filter').css('background', 'white');
		if ($('.filter img').attr('src') == 'images/filter_hover.png')
			$('.filter img').attr('src', 'images/filter.png');
		else if ($('.filter img').attr('src') == 'images/take_photo_hover.png')
			$('.filter img').attr('src', 'images/take_photo.png');
	});

	$('.cookie-close').on('click', function() {
		$('.cookies').fadeOut('slow', 'swing');
	});

	$('.cookie-link').on('click', function() {
		$('.cookies').fadeOut('slow', 'swing');
	});

	$('.cookie-show').on('click', function() {
		$('#cookie_overlay').css('display', 'flex');
	});

	function showUploadedPhoto(data) {
		var uploaded_photo = new Image();
		uploaded_photo.onload = function() {
			$('#image_preview').css('background-color', 'white');
			$('#image_preview').css('background-image', 'url(' + data[0]['image_url'] + ')');
			$('#upload_overlay').fadeOut('slow', 'swing');
			$('.bar').width('0%');
			$('.percent').html('0%');
			$('.filter img').attr('src', 'images/filter.png');

			var addGrid = $('<div class="grid-item" id="grid_item_' + images.length + '"><img class="lazy" src="' + data[0]['image_url'] + '"><div class="add-image" id="add_image_' + images.length + '"><img src="images/add.png"></div></div>');
			$('.grid').prepend(addGrid).masonry('prepended', addGrid).masonry('layout');

			$('#grid_item_' + images.length).hide();
			$('#grid_item_' + images.length).imagesLoaded(function() {
				var id = $(this)[0].elements[0].id.substring(10);
				$('#grid_item_' + id).fadeIn('slow', 'swing');
			});

			$('#add_image_' + images.length).on('click', function() {
				var id = $(this).attr('id').substr(10);
				location.replace($('#url').val() + '/gallery?image_id=' + images[id]['id']);
			});

			// Grid Hover
			$('#grid_item_' + images.length).on('mouseenter', function() {
				var id = $(this).attr('id').substr(10);
				$('#add_image_' + id).slideToggle("fast", "swing");
			});

			$('#grid_item_' + images.length).on('mouseleave', function() {
				var id = $(this).attr('id').substr(10);
				$('#add_image_' + id).slideToggle("fast", "swing");
			});

			selected_photo = images.length;
			images.push(data[0]);

			$('#save').show();
			$('#share').show();
			$('#delete').show();
			$('.right-side-menu').width($('.photo-menu').width() - $('.left-side-menu').width() - 5);
		};
		uploaded_photo.src = data[0]['image_url'];
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
 			
 			currentImages = (data.length > 15)? data.length - 15 : 0;
 			for (var i = data.length - 1; i >= currentImages; i--) {
 				var addGrid = $('<div class="grid-item" id="grid_item_' + i + '"><img src="' + data[i]['image_url'] + '"><div class="add-image" id="add_image_' + i + '"><img src="images/add.png"></div></div>');
 				$('.grid').append(addGrid);

				$('#grid_item_' + i).hide();
				$('#grid_item_' + i).imagesLoaded(function() {
					var id = $(this)[0].elements[0].id.substring(10);
					$('#grid_item_' + id).fadeIn('slow', 'swing');
				});

				// Grid Hover
				$('#grid_item_' + i).on('mouseenter', function() {
					var id = $(this).attr('id').substr(10);
					$('#add_image_' + id).slideToggle("fast", "swing");
				});

				$('#grid_item_' + i).on('mouseleave', function() {
					var id = $(this).attr('id').substr(10);
					$('#add_image_' + id).slideToggle("fast", "swing");
				});

	 			$('#add_image_' + i).on('click', function() {
					var id = $(this).attr('id').substr(10);
					location.replace($('#url').val() + '/gallery?image_id=' + images[id]['id']);
				});
 			}

 			// Masonry Grid
 			$('.grid').masonry();
			$('.grid').imagesLoaded(function() {
				$('.grid').masonry('layout');
				$('#preloading_overlay').fadeOut('slow', 'swing');
			}).progress(function() {
				$('.grid').masonry('layout');
			});

			var firstVisit = localStorage.getItem("first_visit");
			if (!firstVisit) {
			    $('.cookies').fadeIn('slow', 'swing');
			    localStorage.setItem("first_visit", "1");
			}

			$(window).scroll(function() { 
			   	if ($(window).scrollTop() == ($(document).height() - $(window).height()) && $('#preloading_overlay').css('display') == 'none') {
			   		if (currentImages != 0) {
			   			$('#preloading_overlay').css('display', 'flex');

			   			var scrollPos = $(window).scrollTop();
			 			$('.grid').masonry('destroy');

				   		var firstImage = currentImages;
				   		currentImages = (currentImages > 15)? currentImages - 15 : 0;
			 			for (var i = firstImage - 1; i >= currentImages; i--) {
			 				var addGrid = $('<div class="grid-item" id="grid_item_' + i + '"><img src="' + images[i]['image_url'] + '"><div class="add-image" id="add_image_' + i + '"><img src="images/add.png"></div></div>');
			 				$('.grid').append(addGrid);

							$('#grid_item_' + i).hide();
							$('#grid_item_' + i).imagesLoaded(function() {
								var id = $(this)[0].elements[0].id.substring(10);
								$('#grid_item_' + id).fadeIn('slow', 'swing');
							});

							// Grid Hover
							$('#grid_item_' + i).on('mouseenter', function() {
								var id = $(this).attr('id').substr(10);
								$('#add_image_' + id).slideToggle("fast", "swing");
							});

							$('#grid_item_' + i).on('mouseleave', function() {
								var id = $(this).attr('id').substr(10);
								$('#add_image_' + id).slideToggle("fast", "swing");
							});

				 			$('#add_image_' + i).on('click', function() {
								var id = $(this).attr('id').substr(10);
								location.replace($('#url').val() + '/gallery?image_id=' + images[id]['id']);
							});
			 			}

			 			// Masonry Grid
			 			$('.grid').masonry();
						$('.grid').imagesLoaded(function() {
							$('.grid').masonry('layout');
							$('#preloading_overlay').fadeOut('slow', 'swing');
						}).progress(function() {
							$('.grid').masonry('layout');
						});

						$(window).scrollTop(scrollPos);
					}
			   	}
			});

			var url = window.location.href;
			var suburl =  url.split('#');
			if (suburl.length > 1 && url.split('#')[1] == 'photo_module') {
				$('html, body').animate({
			        scrollTop: $('#photo_module').offset().top
			    }, 500);
			}
 		}
 	});
});