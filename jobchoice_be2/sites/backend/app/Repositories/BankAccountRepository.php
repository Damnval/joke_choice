<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class BankAccountRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $bank_account;

    /**
     * Constructor to bind model to repo
     * @param Model $bank_account
     */
    public function __construct(Model $bank_account)
    {
        $this->bank_account = $bank_account;
    }

     /**
     * Get all bank_account from resource
     * @return Object
     */
    public function all()
    {
        return $this->bank_account->all();
    }

    /**
     * Saving bank_account data to bank_accounts resource
     * @param array $data Input from user
     * @return object bank_account resource
     */
    public function create(Array $data)
    {
        $this->bank_account->fill($data);
        $this->bank_account->save();
        return $this->bank_account;
    }

    public function update(Array $data, $id)
    {
        $bank_account = $this->bank_account->find($id);
        return $bank_account->update($data);
    }

    public function destroy($id)
    {
        return $this->bank_account->destroy($id);
    }

    public function show($id)
    {
        return $this->bank_account->findOrFail($id);
    }

    /**
     * Dynamic getting only the first bank account resource with where params
     * @param array $data
     * @return object Token resource
     */
    public function whereFirst(array $data)
    {
        return $this->bank_account->where($data)->first();
    }

    /**
     * Saving bank_account data to bank_accounts resource by model
     * @param array $data Input from user
     * @param array $client model
     * @return bool true or false
     */
    public function createModel(Array $data, Model $model)
    {
        return $model->bank_account()->create($data);
    }
  
    /**
     * Updating bank_account data to bank_accounts resource by model
     * @param array $data Input from user
     * @param array $client model
     * @return bool true or false
     */
    public function updateModel(Array $data, Model $model)
    {        
        return $model->bank_account()->update($data);
    }
}
