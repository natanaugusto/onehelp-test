<?php
namespace OneHelpSDK\Facades;

use OneHelpSDK\Clients\Discounts as DiscountsClient;

use Illuminate\Support\Facades\Facade;

class Discounts extends Facade
{
    protected static function getFacadeAccessor() { return DiscountsClient::class; }
}
