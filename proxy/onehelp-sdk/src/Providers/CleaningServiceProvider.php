<?php
namespace OneHelpSDK\Providers;

use Illuminate\Support\ServiceProvider;

use OneHelpSDK\Clients\Cleaning as CleaningClient;

class CleaningServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(CleaningClient::class, function ($app) {
            return new CleaningClient();
        });
    }
}
