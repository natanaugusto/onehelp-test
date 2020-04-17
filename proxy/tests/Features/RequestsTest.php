<?php
namespace Tests\Features;

use App\User;
use App\Request;
use App\Discount;
use Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Http\Response;

class RequestsTest extends TestCase
{
    public function testList()
    {
        $requests = factory(Request::class, 10)->create();

        $this->get(route('requests.list'))
        ->assertStatus(Response::HTTP_OK)
        ->assertJson($requests->toArray());
    }

    public function testCreate()
    {
        $request = factory(Request::class)->raw();
        $request['user'] = Arr::only(
            User::find($request['user_id'])->toArray(),
            ['name', 'email']
        );
        unset($request['user_id']);
        $this->json('POST', route('requests.create'), $request)
        ->assertStatus(Response::HTTP_CREATED);
    }

    public function testUpdate()
    {
        $request = factory(Request::class)->create([
            'reference' => '5e97709cb667c500213b0dcc'
        ]);

        $this->json(
            'PUT',
            route('requests.update', ['id' => $request->id]),
            ['duration' => 8]
        )
        ->assertStatus(Response::HTTP_NO_CONTENT);
    }

    public function testDelete()
    {
        $request = factory(Request::class)->create([
            'reference' => '5e97700cb667c500213b0dcb',
        ]);

        $this->json('DELETE', route('requests.delete', ['id' => $request->id]))
        ->assertStatus(Response::HTTP_NO_CONTENT);
    }

    public function testGetPrice()
    {
        $request = factory(Request::class)->raw();
        $user = User::find($request['user_id'])->toArray();
        $request['user'] = Arr::only(
            $user,
            ['name', 'email']
        );
        unset($request['price']);
        unset($request['user_id']);
        $this->json('GET', route('requests.price'), $request)
        ->assertStatus(Response::HTTP_OK)
        ->assertJson(
            ['price' => $request['duration'] * config('onehelp.defaultRequestPrice')]
        );

        $discount = factory(Discount::class)->create([
            'user_id' => $user['id'],
            'type' => 'percent',
            'value' => 0.25,
        ]);
        $price = $request['duration']
            * config('onehelp.defaultRequestPrice');

        $this->json('GET', route('requests.price'), $request)
        ->assertStatus(Response::HTTP_OK)
        ->assertJson(
            [
                'price' => $price - $price * $discount->value,
            ]
        );
    }
    public function testPatch()
    {
        $requests = factory(Request::class, 10)->create();
        $requests = $requests->filter(function ($request) {
            return $request->id % 2 === 0;
        });
        $requests = array_values($requests->toArray());
        for ($key = 0; $key < count($requests); $key++) {
            $requests[$key]['duration'] = 8;
        }

        $this->patch(route('requests.patch'), $requests)
        ->assertStatus(Response::HTTP_NO_CONTENT);
    }
}
