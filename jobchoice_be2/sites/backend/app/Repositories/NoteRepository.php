<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class NoteRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $note;

    // Constructor to bind model to repo
    public function __construct(Model $note)
    {
        $this->note = $note;
    }

     /**
     * Retrive all Notes
     * @return Object Notes collections
     */
    public function all()
    {
        return $this->note->all();
    }

    /**
     * Saving note data to Notes resource
     * @param array $data Input from user
     * @return collection Saved note from db
     */
    public function create(array $data)
    {
        $this->note->fill($data);
        $this->note->save();
        return $this->note;
    }

    
    /**
     * Updating note data to Notes resource
     * @param array $data Input from user client
     * @param int $id ID of note to update
     * @return collection note Updated note from database
     */
    public function update(array $data, $id)
    {
        $note = $this->note->find($id);
        return $note->update($data);
    }

    // remove record from the database
    public function destroy($id)
    {
        return $this->note->destroy($id);
    }

    /**
     * Retrive specific note
     * @param  Int $id
     * @return Object note collections
     */
    public function show($id)
    {
        return $this->note
                    ->where('id', '=', $id)
                    ->first();
    }

    /**
     * Get first record of note using where method based on params
     * @param array $data
     * @return Object note collection
     */
    public function whereFirst(array $data)
    {
        return $this->note
                    ->where($data)
                    ->first();
    }

 }
