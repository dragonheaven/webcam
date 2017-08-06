@extends('layouts.main')

@section('content')

	<div class="cbp-fwslider" id="slider">
		<ul id="slider_ul"></ul>
	</div>

	<div class="overlay" id="preloading_overlay">
        <img src="images/loader_white.gif" alt="Loading...">
    </div>

	<script src="js/gallery.js"></script>

@endsection