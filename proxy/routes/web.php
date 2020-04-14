<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});


$routerNamePrefix = 'discounts';
$router->group(['prefix' => $routerNamePrefix],
    function () use ($router, $routerNamePrefix) {
        $router->get('', [
            'as' => "{$routerNamePrefix}.list",
            'uses' => 'DiscountsController@list'
        ]);

        $router->post('', [
            'as' => "{$routerNamePrefix}.create",
            'uses' => 'DiscountsController@create'
        ]);

        $router->put('{id}', [
            'as' => "{$routerNamePrefix}.update",
            'uses' => 'DiscountsController@update'
        ]);

        $router->patch('', [
            'as' => "{$routerNamePrefix}.patch",
            'uses' => 'DiscountsController@patch'
        ]);

        $router->delete('{id}', [
            'as' => "{$routerNamePrefix}.delete",
            'uses' => 'DiscountsController@delete'
        ]);
    }
);

$routerNamePrefix = 'requests';
$router->group(['prefix' => $routerNamePrefix],
    function () use ($router, $routerNamePrefix) {
        $router->get('', [
            'as' => "{$routerNamePrefix}.list",
            'uses' => 'RequestsController@list'
        ]);

        $router->post('', [
            'as' => "{$routerNamePrefix}.create",
            'uses' => 'RequestsController@create'
        ]);

        $router->put('{id}', [
            'as' => "{$routerNamePrefix}.update",
            'uses' => 'RequestsController@update'
        ]);

        $router->patch('', [
            'as' => "{$routerNamePrefix}.patch",
            'uses' => 'RequestsController@patch'
        ]);

        $router->delete('{id}', [
            'as' => "{$routerNamePrefix}.delete",
            'uses' => 'RequestsController@delete'
        ]);
    }
);
