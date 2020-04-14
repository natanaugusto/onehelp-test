<?php

namespace App\Http\Controllers;

use Exception;

use App\User;
use App\Discount;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;

class DiscountsController extends Controller
{
    public function list(): JsonResponse
    {
        return response()->json(Discount::all());
    }

    public function create(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            $user = User::firstOrCreate(['email' => $data['userEmail']]);
            if (empty($user->id)) {
                $user->save();
            }
            $data['user_id'] = $user->id;
            unset($data['userEmail']);
            $discount = new Discount($data);
            $discount->reference = Str::uuid();
            $discount->save();
            return response()->json(null, Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $data = $request->all();
            $discount = Discount::firstOrFail($id);
            $this->fillWithData($discount, $data);
            $discount->save();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function patch(Request $request): JsonResponse
    {
        try {
            $discounts = $request->all();
            foreach ($discounts as $data) {
                $discount = Discount::find($data['id']);
                if ($discount) {
                    $this->fillWithData($discount, $data);
                    $discount->save();
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
            $discount = Discount::firstOrFail($id);
            $discount->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
