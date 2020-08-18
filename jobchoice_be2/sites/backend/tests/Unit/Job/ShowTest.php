<?php

namespace Tests\Unit;

use Tests\TestCase;

class ShowTest extends TestCase
{
    
    /**
     * Test case that gets job details
     * @test 
     */
    public function show()
    {
        $response = $this->json('GET', 'api/job/9');
        $response->assertStatus(200);
    }

    /**
     * Test case that fails job details test
     * @test
     */
    public function showFail()
    {
        $response = $this->json('GET', 'api/job/12314123');
        $response->assertStatus(500);
    }
   
}
