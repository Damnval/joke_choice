<?php

namespace App\Repositories;

use Illuminate\Database\Eloquent\Model;
use App\Repositories\Contract\BaseRepositoryInterface;

class SkillRepository implements BaseRepositoryInterface
{
    // model property on class instances
    protected $skill;

    // Constructor to bind model to repo
    public function __construct(Model $skill)
    {
        $this->skill = $skill;
    }

     /**
     * Retrive all skills
     * @return Object skill collections
     */
    public function all()
    {
        return $this->skill->all();
    }

    /**
     * Saving skill data to skill resource
     * @param array $data Input from user
     * @return collection Saved skill from db
     */
    public function create(array $data)
    {
        $this->skill->fill($data);
        $this->skill->save();
        return $this->skill;
    }

    /**
     * Update skill data to skill resource
     * @param array $data Input from user
     * @param int $id Id of skill from user
     * @return bool 
     */
    public function update(array $data, $id)
    {
        $skill = $this->skill->find($id);
        return $skill->update($data);
    }

    /**
     * Saving skill data to skill resource
     * @param array $data Input from user
     * @return bool 
     */
    public function destroy($id)
    {
        return $this->skill->destroy($id);
    }

    /**
     * Retrieve specific skill from skill resource
     * @param  int $id
     * @return Object skill collections
     */
    public function show($id)
    {
        return $this->skill->findOrFail($id);
    }

}
