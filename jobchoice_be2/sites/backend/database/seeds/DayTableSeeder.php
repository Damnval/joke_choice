<?php

use Illuminate\Database\Seeder;
use App\Models\Day;

class DayTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {   
        factory(Day::class)->create(['day'=>'Sunday', 'job_id'=>1]); 
        factory(Day::class)->create(['day'=>'Sunday', 'job_id'=>2]);
        factory(Day::class)->create(['day'=>'Sunday', 'job_id'=>3]);

        factory(Day::class)->create(['day'=>'Monday', 'job_id'=>4]); 
        factory(Day::class)->create(['day'=>'Monday', 'job_id'=>5]);
        factory(Day::class)->create(['day'=>'Monday', 'job_id'=>1]);

        factory(Day::class)->create(['day'=>'Tuesday', 'job_id'=>2]); 
        factory(Day::class)->create(['day'=>'Tuesday', 'job_id'=>3]);
        factory(Day::class)->create(['day'=>'Tuesday', 'job_id'=>4]);
        
        factory(Day::class)->create(['day'=>'Wednesday', 'job_id'=>5]); 
        factory(Day::class)->create(['day'=>'Wednesday', 'job_id'=>1]);
        factory(Day::class)->create(['day'=>'Wednesday', 'job_id'=>2]);

        factory(Day::class)->create(['day'=>'Thursday', 'job_id'=>3]); 
        factory(Day::class)->create(['day'=>'Thursday', 'job_id'=>4]);
        factory(Day::class)->create(['day'=>'Thursday', 'job_id'=>5]);

        factory(Day::class)->create(['day'=>'Friday', 'job_id'=>1]); 
        factory(Day::class)->create(['day'=>'Friday', 'job_id'=>2]);
        factory(Day::class)->create(['day'=>'Friday', 'job_id'=>3]);

        factory(Day::class)->create(['day'=>'Saturday', 'job_id'=>4]); 
        factory(Day::class)->create(['day'=>'Saturday', 'job_id'=>5]);
        factory(Day::class)->create(['day'=>'Saturday', 'job_id'=>1]);

        factory(Day::class)->create(['day'=>'Thursday', 'job_id'=>6]); 
        factory(Day::class)->create(['day'=>'Thursday', 'job_id'=>7]);
        factory(Day::class)->create(['day'=>'Thursday', 'job_id'=>8]);

        factory(Day::class)->create(['day'=>'Monday', 'job_id'=>7]); 
        factory(Day::class)->create(['day'=>'Monday', 'job_id'=>8]);
        factory(Day::class)->create(['day'=>'Monday', 'job_id'=>9]);

        factory(Day::class)->create(['day'=>'Wednesday', 'job_id'=>6]); 
        factory(Day::class)->create(['day'=>'Wednesday', 'job_id'=>9]);
        factory(Day::class)->create(['day'=>'Wednesday', 'job_id'=>10]);
    }
}
