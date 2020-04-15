<?php
namespace OneHelpSDK\Tests\Unit;

use Illuminate\Http\Response;

use OneHelpSDK\Tests\TestCase;
use OneHelpSDK\Facades\Discounts;

use OneHelpSDK\Tests\OneHelpAsserts;

class DiscountsTest extends TestCase
{
    use OneHelpAsserts;
    protected $resquestStructure = [
       "userEmail",
       "type",
       "value"
    ];

    public function testList()
    {
        $discounts = Discounts::get();
        $this->assertTrue($discounts->isCollection());
        foreach($discounts->toArray() as $discount) {
            $this->assertArrayStructure($this->resquestStructure, $discount);
        }
    }

    public function testCreate()
    {
        $discount = [
            "userEmail" => "natan@mail.com",
            "type" => "percent",
            "value" => 0.25,
        ];
        $result = Discounts::create($discount);
        $this->assertEquals(Response::HTTP_CREATED, Discounts::getStatus());
        // $this->assertArrayStructure($this->resquestStructure, $result->toArray());
    }

    public function testUpdate()
    {
        $discounts = Discounts::get()->toArray();
        Discounts::update($discounts[0]['_id'], ['value' => 1]);
        $this->assertEquals(Response::HTTP_NO_CONTENT, Discounts::getStatus());
    }

    public function testDelete()
    {
        $discounts = Discounts::get()->toArray();
        Discounts::delete($discounts[0]['_id']);
        $this->assertEquals(Response::HTTP_NO_CONTENT, Discounts::getStatus());
    }

    public function testGetLastUpdate()
    {
        $lastUpdate = Discounts::getLastUpdate();
        $this->assertEquals(Response::HTTP_OK, Discounts::getStatus());
        $this->assertArrayStructure(['lastUpdate'], $lastUpdate->toArray());
    }
}
