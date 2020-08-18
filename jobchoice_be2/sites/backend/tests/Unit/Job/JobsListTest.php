<?php

namespace Tests\Unit;

use Tests\TestCase;

class JobsListTest extends TestCase
{
    /**
     * Test case that gets all jobs
     * @test 
     */
    public function getAllJobsList()
    {
        $response = $this->json('GET', 'api/job');
        $response->assertStatus(200);
    }

}
