<?php
namespace OneHelpSDK\Providers;

use Illuminate\Support\ServiceProvider;

use OneHelpSDK\Clients\Discounts as DiscountsClient;

class DiscountsServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton(DiscountsClient::class, function ($app) {
            return new DiscountsClient();
        });
    }
}
