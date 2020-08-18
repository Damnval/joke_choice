<?php

namespace App\Services;

use File;
use Carbon\Carbon;

class UploadService
{
    public function upload($request, $user_id)
    {
        $imageName = 'profile.jpg';
        $path = '/images/profile/'.$user_id;
        $save = public_path($path);
        // timestamp used in saving to DB so that when changing image, browser reflects with updated image
        $finalPath = config('app.staging_url') . $path . '/' . $imageName . '?' . Carbon::now()->timestamp ;

        if (!file_exists($path)) {
            File::makeDirectory($save, $mode = 0777, true, true);
        }

        if (file_put_contents($save.'/'.$imageName, file_get_contents($request))) {
            return $finalPath;
        } else {
            throw new \Exception('Unable to save the file.');
        }
    }

    /**
    * Dynamic Upload of image
    * @param Collection $request From Request $request input by client
    * @param string $image Params name of image
    * @param string $path Creates a path where to save the file
    * @param string $image_name If developer wants to control the naming of file
    * @return string Path where the file was stored
    */
    public function uploadImage($request, $image, $path = 'Documents', $image_name = null)
    {
        $file = $request->$image;

        if (is_null($image_name)) {
            $image_name = $image;
        }
        return $this->saveImageInStorage($request, $image, $path, $image_name);
    }
    
    /*
    * final saving of upload file
    * dependent on method uploadImage
    * @return String Path where the file was stored
    */
    public function saveImageInStorage($request, $image, $path, $image_name)
    {     
       $image_name = $image_name.'.jpg';
       if (!file_exists($path)) {
            File::makeDirectory($path, $mode = 0777, true, true);
       }
        
       if (file_put_contents($path.'/'.$image_name, file_get_contents($request->$image))) {
            // timestamp used in saving to DB so that when changing image, browser reflects with updated image
            return url('/') . '/' . $path . '/' . $image_name . '?' . Carbon::now()->timestamp;            
        } else { 
            throw new \Exception('Unable to save the file.');
        } 
    }
    
    /**
     * Function that copies an image from a folder to another folder
     * @param  string $job_image    path to the actual image
     * @param  string $path         path where to place the copied image
     * @param  string $image_name
     * @return string $duplicated_job_image_file_path 
     */
    public function copyImage($job_image, $path, $image_name)
    {
        if (!file_exists($path)) {
            File::makeDirectory($path, $mode = 0777, true, true);
        }

        // copies the original job image to another folder
        copy($job_image, $path . '/' . $image_name);

        // creates file path for the duplicated job image
        $duplicated_job_image_file_path = url('/') . '/' . $path . '/' . $image_name;

        return $duplicated_job_image_file_path;
    }

}
