<?php
namespace Tests;

class TestResponse extends \AlbertCht\Lumen\Testing\TestResponse
{
    /**
     * Assert that the response is a superset of the given JSON.
     *
     * @param  array  $data
     * @param  bool  $strict
     * @return $this
     */
    public function assertJson(array $data, $strict = false)
    {
        \Tests\Assert::assertArraySubset(
            $data, $this->decodeResponseJson(), $strict, $this->assertJsonMessage($data)
        );

        return $this;
    }
}
