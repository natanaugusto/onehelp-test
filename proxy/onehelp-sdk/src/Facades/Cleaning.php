<?php
namespace OneHelpSDK\Facades;

use OneHelpSDK\Clients\Cleaning as CleaningClient;

use Illuminate\Support\Facades\Facade;

class Cleaning extends Facade
{
    protected static function getFacadeAccessor() { return CleaningClient::class; }
}
