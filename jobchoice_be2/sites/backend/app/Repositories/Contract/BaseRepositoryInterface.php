<?php 

namespace App\Repositories\Contract;

interface BaseRepositoryInterface
{
    public function all();

    public function create(array $data);

    public function update(array $data, $id);

    public function destroy($id);

    public function show($id);
}
