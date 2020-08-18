<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class PublicationPostEnd extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'publication:post-end';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update job status to post end if it is already the end date of their published date';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $now = \Carbon\Carbon::now()->toDateString();

        $where = [
            'draft' => 0,
            'publishable_type' => 'Job',
            'deleted_at' => null,
            'published_end_date' => $now
        ];

        $jobs = \DB::table('publications')
                    ->where($where)
                    ->update(['status' => 'post_end']);
    }
}
