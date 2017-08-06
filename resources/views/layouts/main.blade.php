<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title>GIPSY FILTER</title>

        <meta name="csrf-token" content="{{ csrf_token() }}">

        <link rel="apple-touch-icon" sizes="57x57" href="/images/favicon/apple-icon-57x57.png">
		<link rel="apple-touch-icon" sizes="60x60" href="/images/favicon/apple-icon-60x60.png">
		<link rel="apple-touch-icon" sizes="72x72" href="/images/favicon/apple-icon-72x72.png">
		<link rel="apple-touch-icon" sizes="76x76" href="/images/favicon/apple-icon-76x76.png">
		<link rel="apple-touch-icon" sizes="114x114" href="/images/favicon/apple-icon-114x114.png">
		<link rel="apple-touch-icon" sizes="120x120" href="/images/favicon/apple-icon-120x120.png">
		<link rel="apple-touch-icon" sizes="144x144" href="/images/favicon/apple-icon-144x144.png">
		<link rel="apple-touch-icon" sizes="152x152" href="/images/favicon/apple-icon-152x152.png">
		<link rel="apple-touch-icon" sizes="180x180" href="/images/favicon/apple-icon-180x180.png">
		<link rel="icon" type="image/png" sizes="192x192"  href="/images/favicon/android-icon-192x192.png">
		<link rel="icon" type="image/png" sizes="32x32" href="/images/favicon/favicon-32x32.png">
		<link rel="icon" type="image/png" sizes="96x96" href="/images/favicon/favicon-96x96.png">
		<link rel="icon" type="image/png" sizes="16x16" href="/images/favicon/favicon-16x16.png">
		<link rel="manifest" href="/images/favicon/manifest.json">

		<meta name="msapplication-TileColor" content="#ffffff">
		<meta name="msapplication-TileImage" content="/images/favicon/ms-icon-144x144.png">
		<meta name="theme-color" content="#ffffff">

		<meta name="twitter:card" content="summary" />
		<meta name="twitter:site" content="Gipsy Filter" />
		<meta name="twitter:creator" content="Gipsy Filter" />

		<meta property="og:url" content="http://web-cam.dev999.com" />
		<meta property="og:type" content="article" />
		<meta property="og:title" content="Gipsy Filter" />
		<meta property="og:description" content="Este año no pierdo mi morenito gracias al #GipsyFilter, ¿qué os parece? ¡Probadlo en www.gipsyfilter.com!" />
		<meta property="og:image" content="http://web-cam.dev999.com/images/social_share.jpg" />

        <link href="https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet">
        <link href="css/cbp-slider.css" rel="stylesheet" type="text/css">
        <link href="css/style.css" rel="stylesheet" type="text/css">

        <script src="js/jquery-3.1.0.min.js"></script>
        <script src="js/jQuery_load_image/js/load-image.all.min.js"></script>
        <script src="js/exif.js"></script>
        <script src="js/canvas-image-uploader.js"></script>
        <script src="js/webcamjs/webcam.min.js"></script>
        <script src="js/modernizr.custom.js"></script>
        <script src="js/jquery.cbpFWSlider.min.js"></script>
        <script src="js/masonry.pkgd.min.js"></script>
        <script src="js/imagesLoaded.pkgd.min.js"></script>
        <script type="text/javascript" async src="https://platform.twitter.com/widgets.js"></script>
	</head>

	<body><center>
		<script>
		  	window.fbAsyncInit = function() {
			    FB.init({
		      		appId      : '1751274998486858',
		      		xfbml      : true,
		      		version    : 'v2.7'
		    	});
		  	};

		  	(function(d, s, id){
		     	var js, fjs = d.getElementsByTagName(s)[0];
		     	if (d.getElementById(id)) {return;}
		     	js = d.createElement(s); js.id = id;
		     	js.src = "//connect.facebook.net/en_US/sdk.js";
		     	fjs.parentNode.insertBefore(js, fjs);
		   	}(document, 'script', 'facebook-jssdk'));
		</script>

		<div class="container">
			<div class="header">
				<a href="/"><img src="images/logo.png"></a>
			</div>

			<div class="heading">
				<span>Sin vacaciones y sin playa, Gipsy Filter te pone tan moreno como si hubieras estado una semana en Ibiza.&nbsp;<a href="#photo_module" id="photo_module_link">¡Aplícate el filtro</a>&nbsp;y presume con tus colegas!</span>
			</div>

			@yield('content')

			<div class="footer">
				<div class="copyright">
					<span>&copy; gipsyfilter 2016</span>
				</div>

				<div class="share">
					<h6>Compártelo en</h6>
					
					<div class="share-buttons">
						<!-- <img src="images/instagram_black.png" id="instagram_share"> -->
						<img src="images/facebook_black.png" id="facebook_share">
						<img src="images/twitter_black.png" id="twitter_share">
					</div>
				</div>

				<div class="legal-terms">
					<a href="https://www.gitanos.org/legal_notice.html" target="_blank">Privacidad & protección de datos</a>
				</div>
			</div>
		</div>

		<input type="text" id="url" value="{{url('/')}}" hidden />
	</center></body>
</html>