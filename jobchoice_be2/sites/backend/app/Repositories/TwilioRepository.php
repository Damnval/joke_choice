<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class TwilioRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $twilio;

    // Constructor to bind model to repo
    public function __construct(Model $twilio)
    {
        $this->twilio = $twilio;
    }

    /**
     * Not Being Used
     */
    public function all()
    {
        // Add Code Here
    }

    /**
     * Save twilio code in the database
     * 
     * @param string $code
     */
    public function create(array $data) {
        $this->twilio->fill($data);
        $this->twilio->save();
        return $this->twilio;
    }

    /**
     * Update twilio code status after successfully verified
     * by the user
     * 
     * @param array $data
     * @param int $id
     */
    public function update(array $data, $id) {
        $twilio = $this->twilio->find($id);
        return $twilio->update($data);
    }

    /**
     * Not being used
     */
    public function destroy($id)
    {
        // Add Code Here
    }


    /**
     * Validate twilio Code
     * 
     * @param array $data
     */
    public function whereFirst(array $data)
    {
        return $this->twilio->where($data)->first();
    }

    /**
     * Not being used
     */
    public function show($id)
    {
        // Add Code Here
    }
}
