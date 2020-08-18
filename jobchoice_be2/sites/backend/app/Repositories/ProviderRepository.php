<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class ProviderRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $provider;

    // Constructor to bind model to repo
    public function __construct(Model $provider)
    {
        $this->provider = $provider;
    }

     /**
     * Retrive all providers
     * @return Object provider collections
     */
    public function all()
    {
        return $this->provider->all();
    }

    /**
     * Saving provider data to providers resource
     * @param array $data Input from user
     * @return collection Saved provider from db
     */
    public function create(array $data)
    {
        $this->provider->fill($data);
        $this->provider->save();
        return $this->provider;
    }

    /**
     * Update provider data to providers resource
     * @param array $data Input from user
     * @param int $id Id of provider from user
     * @return bool 
     */
    public function update(array $data, $id)
    {
        $provider = $this->provider->find($id);
        return $provider->update($data);
    }

    /**
     * Delete provider data from providers resource
     * @param int $id Input from user
     * @return bool 
     */
    public function destroy($id)
    {
        return $this->provider->destroy($id);
    }

    /**
     * Retrieve specific provider from providers resource
     * @param  int $id
     * @return Object providers collections
     */
    public function show($id)
    {
        return $this->provider->findOrFail($id);
    }

    /**
     * Get provider using where method based on params
     * @param array $data
     * @return object provider resource
     */
    public function whereFirst(array $data)
    {
        return $this->provider
                        ->where($data)
                        ->first();
    }

}
