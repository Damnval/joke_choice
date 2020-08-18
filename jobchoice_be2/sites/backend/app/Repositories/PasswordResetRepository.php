<?php 

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class PasswordResetRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $password_reset;

    /**
     * Constructor to bind model to repo
     * @param Model $password_reset 
     */
    public function __construct(Model $password_reset)
    {
        $this->password_reset = $password_reset;
    }

     /**
     * Get all password_reset from resource
     * @return Object 
     */
    public function all()
    {
        return $this->password_reset->all();   
    }

    /**
     * Saving password_reset data to password_reset resource
     * @param array $data Input from password_reset
     * @return object password_reset resource
     */
    public function create(Array $data)
    {
        $this->password_reset->fill($data);
        $this->password_reset->save();
        return $this->password_reset;
    }

    /**
     * Updating password_reset data to password_resets resource
     * @param array $data Input from user
     * @param int $id ID of password reset to be updated
     * @return Collection Saved password_reset from db
     */
    public function update(Array $data, $id)
    {
        $password_reset = $this->password_reset->find($id);
        return $password_reset->update($data);
    }

    /**
     * Remove password_reset from resource
     * @param int $id ID of password_reset
     * @return Boolean Result if deleted
     */
    public function destroy($id)
    {
        return $this->password_reset->destroy($id);
    }

    /**
     * Retrieve specific password_reset
     * @param int $id
     * @return Object Password Reset collections
     */
    public function show($id)
    {
        return $this->password_reset->findOrFail($id);
    }
    
    /**
     * Retrieves all Password Reset based on given parameter
     * @param array $data values to search
     * @return Object Password Reset collection
     */
    public function where(Array $data)
    {
        return $this->password_reset->where($data)
                                    ->first();
    }

    /**
     * Updating Password Reset data to Password Reset resource
     * @param array $data Input from user client
     * @param array $where where params
     * @return collection Password Reset
     */
    public function updateWhere(array $data, array $where)
    {
        return $this->password_reset->where($where)
                                    ->update($data);
    }

}
