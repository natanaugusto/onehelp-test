<?php

namespace App\Http\Controllers;

use Exception;

use App\Request;
use App\Services\RequestService;

use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
class RequestsController extends Controller
{
    public function __construct(RequestService $service)
    {
        $this->service = $service;
    }

    public function list(): JsonResponse
    {
        return response()->json(Request::all());
    }

    public function create(HttpRequest $http): JsonResponse
    {
        try {
            $data = $http->all();
            $this->service->sync(null, $data);
            return response()->json(null, Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(HttpRequest $http, int $id): JsonResponse
    {
        try {
            $data = $http->all();
            $request = Request::select('reference')->findOrFail($id);
            $this->service->sync($request->reference, $data);
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
            $this->service->delete(Request::findOrFail($id));
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
