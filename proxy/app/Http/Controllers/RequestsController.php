<?php

namespace App\Http\Controllers;

use Exception;

use App\User;
use App\Request;

use Illuminate\Support\Str;
use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class RequestsController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(Request::all());
    }

    public function create(HttpRequest $http): JsonResponse
    {
        try {
            $data = $http->all();
            $user = User::firstOrCreate($data['user']);
            if (empty($user->id)) {
                $user->save();
            }
            $data['user_id'] = $user->id;
            unset($data['user']);
            $request = new Request($data);
            $request->reference = Str::uuid();
            $request->save();
            return response()->json(null, Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(HttpRequest $http, int $id): JsonResponse
    {
        try {
            $data = $http->all();
            $request = Request::firstOrFail($id);
            $this->fillWithData($request, $data);
            $request->save();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function patch(HttpRequest $http): JsonResponse
    {
        try {
            $requests = $http->all();
            foreach ($requests as $data) {
                $request = Request::find($data['id']);
                if ($request) {
                    $this->fillWithData($request, $data);
                    $request->save();
                }
            }
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function delete(int $id): JsonResponse
    {
        try {
            $request = Request::firstOrFail($id);
            $request->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
