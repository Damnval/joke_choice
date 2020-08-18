<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Services\JobChoiceService;

use App\Models\Note;
use DB;

class NoteController extends Controller
{
    public function __construct(JobChoiceService $jobChoiceService)
    {
        parent::__construct();

        $this->jobChoiceService = $jobChoiceService;
    }

    /**
     * Display a listing of the resource.
     * @return \Illuminate\Http\Response
     */
	public function index()
	{
        try{

            $notes = $this->jobChoiceService->note()->index();
            $this->data['results']['notes'] = $notes;

            $this->data['status'] = 200;
        } catch (\Exception $e) {
            $this->data['error'] = $e->getMessage();
        }

        return response()->json($this->data, $this->data['status']);
	}

    /**
     * Saving note based on the current logged job seeker
     * @param  Request $request user client input
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
       DB::beginTransaction();

       try {

            validateInput($request->all(), Note::createRules());
            $note = $this->jobChoiceService->note()->store($request);

            if ($note) {
                $this->data['results']['message'] = "Note successfully saved.";
                $this->data['note'] = $note;
                $this->data['status'] = 200;
            }
        
        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
            }

        DB::commit();

        return response()->json($this->data, $this->data['status']);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \Illuminate\Http\Request  $request
     * @param int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {

        DB::beginTransaction();
        try	{

            $note = $this->jobChoiceService->note()->update($request, $id);

            if ($note) {
                $this->data['results']['message'] = "Note successfully updated.";
                $this->data['status'] = 200;
                }

        } catch (\Exception $e) {
            DB::rollBack();
            $this->data['error'] = $e->getMessage();
        }

        DB::commit();
        return response()->json($this->data, $this->data['status']);
    }
}
