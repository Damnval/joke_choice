<?php

namespace App\Http\Controllers\API;

use DB;
use Illuminate\Http\Request;
use App\Services\JobChoiceService;
use App\Http\Controllers\Controller;

class HatarakiKataResourceController extends Controller
{

	public function __construct(JobChoiceService $jobChoiceService)
	{
		parent::__construct();

		$this->jobChoiceService = $jobChoiceService;
	}
	 /**
     * Update method is used in saving hataraki kata resource instead of update.
     * this is equivalent to store as resource.
     * Though update naming is used, will changed the logic to save hataraki kata resource
     * @param  int  $id
     * @param  Object $request Input from user client
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        DB::beginTransaction();
        
        try	{
            
            $this->jobChoiceService->hataraki_kata_resource()->store($request, $id);
            
            $this->data['results'] = 'Hataraki Kata successfully Saved.';
            $this->data['status'] = 200;

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }

}
