<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Input;
use Illuminate\Support\Facades\DB;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class MainController extends Controller
{
    /**
     * Upload Photo
     *
     * @return \Illuminate\Http\Response
     */
    public function uploadPhoto(Request $request) {
        define('UPLOAD_DIR', 'images/uploads/');
        if (array_key_exists('image', $_FILES) && $_FILES['image']['error'] == 0 ) {
            $image = $_FILES['image'];
            $name = str_replace(" ", "_", $image['name']);
            $target_file = UPLOAD_DIR . uniqid() . '.jpg';
            if (move_uploaded_file($image['tmp_name'], $target_file)) {
                DB::table('images')->insert(['image_url' => $target_file]);
                return DB::table('images')->where('image_url', $target_file)->get();
            } else {
                return 'Fail';
            }
        } else {
            return 'Fail';
        }
    }

    /**
     * Load Photo
     *
     * @return \Illuminate\Http\Response
     */
    public function loadPhoto(Request $request) {
        $images = DB::table('images')->get();
        return $images;
    }

    /**
     * Remove Photo
     *
     * @return \Illuminate\Http\Response
     */
    public function removePhoto(Request $request) {
        $image_id = $request->input('image_id');
        if (DB::table('images')->where('id', $image_id)->delete())
            return "Success";
        else
            return "Fail";
    }
}