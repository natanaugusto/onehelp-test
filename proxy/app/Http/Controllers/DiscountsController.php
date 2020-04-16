<?php

namespace App\Http\Controllers;

use Exception;

use App\User;
use App\Discount;
use App\Services\DiscountService;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Http\JsonResponse;
use OneHelpSDK\Facades\Discounts;
class DiscountsController extends Controller
{
    public function __construct(DiscountService $service)
    {
        $this->service = $service;
    }

    public function list(): JsonResponse
    {
        return response()->json(Discount::all());
    }

    public function create(Request $request): JsonResponse
    {
        try {
            $data = $request->all();
            $this->service->sync(null, $data);
            return response()->json(null, Response::HTTP_CREATED);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update(Request $request, int $id): JsonResponse
    {
        try {
            $data = $request->all();
            $discount = Discount::select('reference')->findOrFail($id);
            $this->service->sync($discount->reference, $data);
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
            $this->service->delete(Discount::findOrFail($id));
            return response()->json(null, Response::HTTP_NO_CONTENT);
        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
