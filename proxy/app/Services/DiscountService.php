<?php
namespace App\Services;

use App\User;
use App\Discount;
use App\Contracts\ModelInterface;
use OneHelpSDK\Facades\Discounts;
use OneHelpSDK\Clients\Utils\HttpResult;

class DiscountService extends SyncableService
{
    protected $sdkClient = Discounts::class;
    protected $sdkCreateMethod = 'create';
    protected $sdkUpdateMethod = 'update';
    protected $sdkDeleteMethod = 'delete';


    protected function syncModel(HttpResult $result): ModelInterface
    {
        $discount = Discount::where(['reference' => $result->_id])->first();
        if(!$discount) {
            $discount = new Discount();
        }
        $user = User::firstOrCreate(['email' => $result->userEmail]);
        $user->save();

        $discount->user_id = $user->id;
        $discount->reference = $result->_id;
        $discount->type = $result->type;
        $discount->value = $result->value;
        $discount->save();
        return $discount;
    }
}
