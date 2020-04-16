<?php
namespace App\Services;

use App\User;
use App\Request;
use App\Contracts\ModelInterface;
use OneHelpSDK\Facades\Cleaning;
use OneHelpSDK\Clients\Utils\HttpResult;

class RequestService extends SyncableService
{
    protected $sdkClient = Cleaning::class;
    protected $sdkCreateMethod = 'createRequest';
    protected $sdkUpdateMethod = 'updateRequest';
    protected $sdkDeleteMethod = 'deleteRequest';


    protected function syncModel(HttpResult $result): ModelInterface
    {
        $request = Request::first(['reference' => $result->_id]);
        if(!$request) {
            $request = new Request();
        }
        $user = User::firstOrCreate((array)$result->user);
        $user->save();

        $request->user_id = $user->id;
        $request->reference = $result->_id;
        $request->date = $result->date;
        $request->duration = $result->duration;
        $request->price = $result->price;
        $request->save();
        return $request;
    }
}
