f<?php

use Illuminate\Database\Seeder;
use App\Models\Document;

class DocumentTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        for ($x = 1; $x < 6; $x++) {
            factory(Document::class, 1)->create([
                'documentable_id' => $x,
                'documentable_type' => 'Notification',
            ]);
        }
    }
}
