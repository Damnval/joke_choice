<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

use Carbon\Carbon;

class TokenRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $token;

    /**
     * Constructor to bind model to repo
     * @param Model $token
     */
    public function __construct(Model $token)
    {
        $this->token = $token;
    }

    /**
     * Get all token from resource
     * @return Object
     */
    public function all()
    {
        return $this->token->all();
    }

     /**
     * Dynamic getting Token resource with where params
     * @param array $data
     * @return object Token resource
     */
    public function where(array $data)
    {
        return $this->token->where($data)
                            ->with('user')
                            ->get();
    }
    
    /**
     * Dynamic getting only the first Token resource with where params
     * @param array $data
     * @return object Token resource
     */
    public function whereFirst(array $data)
    {
        return $this->token->where($data)
                            ->first();
    }

    /**
     * Dynamic saving of token
     * @param array $data Request converted to array
     * @return object token saved token from db
     */
    public function create(array $data)
    {
        $this->token->fill($data);
        $this->token->token =  md5(Carbon::now() . str_random(40));
        $this->token->active = 1;

        return $this->token->save();
    }

    public function update(array $data, $id)
    {
        $token = $this->token->find($id);
        return $token->update($data);
    }

    public function destroy($id)
    {
        return $this->token->destroy($id);
    }

    public function show($id)
    {
        return $this->token->findOrFail($id);
    }
}
