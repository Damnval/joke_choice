<?php 

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class SnSUserRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $sns_user;

   
    /**
     * Constructor to bind model to repo
     * @param Model $sns_user 
     */
    public function __construct(Model $sns_user)
    {
        $this->sns_user = $sns_user ;
    }

     /**
     * Get all feature_job from resource
     * @return Object 
     */
    public function all()
    {
        return $this->sns_user->all();      
    }

    /**
     * Saving feature_job data to feature_job resource
     * @param array $data Input from feature_job
     * @return object feature_job resource
     */
    public function create($data)
    {
        $this->sns_user->fill($data);
        $this->sns_user->save();
        return $this->sns_user;
    }

    public function update($data, $id)
    {
        $sns_user = $this->sns_user->find($id);
        return $sns_user->update($data);
    }

    public function destroy($id)
    {
        return $this->sns_user->destroy($id);
    }

    public function show($id)
    {
        return $this->sns_user->findOrFail($id);
    }   
    
    public function where($data)
    {
        return $this->sns_user->where($data)
                              ->first();               
    }
}
