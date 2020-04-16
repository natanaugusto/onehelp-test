<?php
namespace Tests\Features;

use App\User;
use App\Request;
use Tests\TestCase;
use Illuminate\Support\Arr;
use Illuminate\Http\Response;

class RequestsTests extends TestCase
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
            'reference' => '5e94f54fc3a0820023f06753'
        ]);

        $con = $this->json(
            'PUT',
            route('requests.update', ['id' => $request->id]),
            ['duration' => 8]
        )
        ->assertStatus(Response::HTTP_NO_CONTENT);
    }

    public function testDelete()
    {
        $request = factory(Request::class)->create([
            'reference' => '5e94779d2799fa0022ab9167',
        ]);

        $this->json('DELETE', route('requests.delete', ['id' => $request->id]))
        ->assertStatus(Response::HTTP_NO_CONTENT);
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
