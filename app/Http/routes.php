<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It's a breeze. Simply tell Laravel the URIs it should respond to
| and give it the controller to call when that URI is requested.
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/#photo_module', function () {
    return view('welcome');
});

Route::get('/gallery', function () {
    return view('gallery');
});

Route::post('/gallery', function () {
    return view('gallery');
});

Route::post('/uploadPhoto', 'MainController@uploadPhoto');

Route::post('/loadPhoto', 'MainController@loadPhoto');

Route::post('/removePhoto', 'MainController@removePhoto');