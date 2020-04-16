<?php

namespace App\Http\Controllers;

use Exception;

use App\User;
use App\Discount;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use OneHelpSDK\Facades\Discounts;
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
            $discountApi = Discounts::create($data);
            if (Discounts::getStatus() !== 201) {
                throw new Exception('An error occurred when the discount was saved');
            }
            $user = User::firstOrCreate(['email' => $data['userEmail']]);
            if (empty($user->id)) {
                $user->save();
            }
            $data['user_id'] = $user->id;
            unset($data['userEmail']);
            $discount = new Discount($data);
            $discount->reference = $discountApi->_id;
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
            $discount = Discount::findOrFail($id);
            Discounts::update($discount->reference, $data);
            if (Discounts::getStatus() !== 201) {
                throw new Exception('An error occurred when the discount was updated');
            }
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
            $discount = Discount::findOrFail($id);
            Discounts::delete($discount->reference);
            if (Discounts::getStatus() !== 204) {
                throw new Exception('An error occurred when the request was updated');
            }
            $discount->delete();
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
