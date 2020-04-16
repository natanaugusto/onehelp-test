<?php
namespace OneHelpSDK\Tests\Unit;

use Illuminate\Http\Response;

use OneHelpSDK\Tests\TestCase;
use OneHelpSDK\Facades\Cleaning;

use OneHelpSDK\Tests\OneHelpAsserts;

class CleaningTest extends TestCase
{
    use OneHelpAsserts;
    protected $resquestStructure = [
        "user" => [
            "name",
            "email",
        ],
        "duration",
        "price",
        "date",
    ];

    public function testListRequests()
    {
        $requests = Cleaning::getRequests();
        $this->assertTrue($requests->isCollection());
        foreach($requests->toArray() as $request) {
            $this->assertArrayStructure($this->resquestStructure, $request);
        }
    }

    public function testCreateRequest()
    {
        $request = [
            "date" => "2020-10-26",
            "duration" => 3,
            "user" => [
                "name" => "Natan",
                "email" => "natan@mail.com"
            ]
        ];
        $result = Cleaning::createRequest($request);
        $this->assertEquals(Response::HTTP_CREATED, Cleaning::getStatus());
        $this->assertArrayStructure($this->resquestStructure, $result->toArray());
    }

    public function testUpdateRequest()
    {
        $requests = Cleaning::getRequests()->toArray();
        Cleaning::updateRequest($requests[0]['_id'], ['duration' => 8]);
        $this->assertEquals(Response::HTTP_CREATED, Cleaning::getStatus());
    }

    public function testDeleteRequest()
    {
        $requests = Cleaning::getRequests()->toArray();
        Cleaning::deleteRequest($requests[0]['_id']);
        $this->assertEquals(Response::HTTP_NO_CONTENT, Cleaning::getStatus());
    }

    public function testGetRequestLastUpdate()
    {
        $lastUpdate = Cleaning::getRequestLastUpdate();
        $this->assertEquals(Response::HTTP_OK, Cleaning::getStatus());
        $this->assertArrayStructure(['lastUpdate'], $lastUpdate->toArray());
    }
}
