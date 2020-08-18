<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class InquiryRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $inquiry;

    // Constructor to bind model to repo
    public function __construct(Model $inquiry)
    {
        $this->inquiry = $inquiry;
    }

     /**
     * Retrieve all inquiries
     * @return Object inquiry collections
     */
    public function all()
    {
        return $this->inquiry->all();
    }

    /**
     * Saving inquiry data to inquiries resource
     * @param array $data Input from user
     * @return collection Saved inquiry from db
     */
    public function create(array $data)
    {
        $this->inquiry->fill($data);
        $this->inquiry->save();
        return $this->inquiry;
    }

    /**
     * Update inquiry data to inquiries resource
     * @param array $data Input from user
     * @param int $id Id of inquiry from user
     * @return bool 
     */
    public function update(array $data, $id)
    {
        $inquiry = $this->inquiry->find($id);
        return $inquiry->update($data);
    }

    /**
     * Deleting inquiry data to inquiries resource
     * @param integer $id Input from user
     * @return boolean 
     */
    public function destroy($id)
    {
        return $this->inquiry->destroy($id);
    }

    /**
     * Retrieve specific inquiry from inquiries resource
     * @param  int $id
     * @return Object inquiry collections
     */
    public function show($id)
    {
        return $this->inquiry->findOrFail($id);
    }

}
