<?php
namespace App\Services;

use App\User;
use App\Request;
use App\Contracts\ModelInterface;
use OneHelpSDK\Facades\Cleaning;
use OneHelpSDK\Clients\Utils\HttpResult;
use Carbon\Carbon;

class RequestService extends SyncableService
{
    protected $sdkClient = Cleaning::class;
    protected $sdkCreateMethod = 'createRequest';
    protected $sdkUpdateMethod = 'updateRequest';
    protected $sdkDeleteMethod = 'deleteRequest';


    protected function syncModel(HttpResult $result): ModelInterface
    {
        $request = Request::where(['reference' => $result->_id])->first();
        if(!$request) {
            $request = new Request();
        }
        $user = User::where(['email' => $result->user->email])->first();
        if (!$user) {
            $user = new User();
            $user->email = $result->user->email;
        }
        if (!empty($result->user->name)) {
            $user->name = $result->user->name;
        }

        $user->save();
        $request->user_id = $user->id;
        $request->reference = $result->_id;
        $request->date = (new Carbon($result->date))->format('Y-m-d');
        $request->duration = $result->duration;
        $request->price = $result->price;
        $request->save();
        return $request;
    }
}
