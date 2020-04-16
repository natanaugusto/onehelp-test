<?php
namespace Tests\Features;

use App\User;
use App\Discount;
use Tests\TestCase;
use Illuminate\Http\Response;

class DiscountsTest extends TestCase
{
    public function testList()
    {
        $discounts = factory(Discount::class, 10)->create();

        $this->get(route('discounts.list'))
        ->assertStatus(Response::HTTP_OK)
        ->assertJson($discounts->toArray());
    }

    public function testCreate()
    {
        $discount = factory(Discount::class)->raw();
        $discount['userEmail'] = User::find($discount['user_id'])->email;
        unset($discount['user_id']);

        $this->json('POST',route('discounts.create'), $discount)
        ->assertStatus(Response::HTTP_CREATED);
    }

    public function testUpdate()
    {
        $discount = factory(Discount::class)->create([
            'reference' => '5e97b433fb775a004229a8a2'
        ]);

        $this->json(
            'PUT',
            route('discounts.update', ['id' => $discount->id]),
            ['value' => 0.25, 'type' => 'percent']
        )
        ->assertStatus(Response::HTTP_NO_CONTENT);
    }

    public function testDelete()
    {
        $discount = factory(Discount::class)->create([
            'reference' => '5e97b436fb775a004229a8a3'
        ]);

        $this->json(
            'DELETE',
            route('discounts.delete', ['id' => $discount->id])
        )
        ->assertStatus(Response::HTTP_NO_CONTENT);
    }

    public function testPatch()
    {
        $discounts = factory(Discount::class, 10)->create();
        $discounts = $discounts->filter(function ($discount) {
            return $discount->id % 2 === 0;
        });
        $discounts = array_values($discounts->toArray());
        for ($key = 0; $key < count($discounts); $key++) {
            $discounts[$key]['value'] = 0.25;
            $discounts[$key]['type'] = 'percent';
        }

        $this->json(
            'PATCH',
            route('discounts.patch'), $discounts
        )
        ->assertStatus(Response::HTTP_NO_CONTENT);
    }
}
