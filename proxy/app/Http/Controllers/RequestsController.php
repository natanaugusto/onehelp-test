<?php

namespace App\Http\Controllers;

use Exception;

use App\User;
use App\Request;

use Illuminate\Http\Request as HttpRequest;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use OneHelpSDK\Facades\Cleaning;
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
            $requestApi = Cleaning::createRequest($data);
            if (Cleaning::getStatus() !== 201) {
                throw new Exception('An error occurred when the request was saved');
            }
            $user = User::firstOrCreate($data['user']);
            if (empty($user->id)) {
                $user->save();
            }
            $data['user_id'] = $user->id;
            unset($data['user']);
            $request = new Request($data);
            $request->reference = $requestApi->_id;
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
            $request = Request::findOrFail($id);
            Cleaning::updateRequest($request->reference, $data);
            if (Cleaning::getStatus() !== 201) {
                throw new Exception('An error occurred when the request was updated');
            }
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
            $request = Request::findOrFail($id);
            Cleaning::deleteRequest($request->reference);
            if (Cleaning::getStatus() !== 204) {
                throw new Exception('An error occurred when the request was updated');
            }
            $request->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
