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
        /**
         *
         * @api {get} /discounts List Discounts
         * @apiName ProxyListDiscounts
         * @apiGroup ProxyDiscounts
         * @apiVersion v1
         *
         * @apiParam  {String} paramName description
         *
         * @apiSuccess (200) {json} List of discounts
         * @apiSuccessExample {type} Success-Response:
         * [
         *   {
         *       "id": 1,
         *       "reference": "5e94f4fa3440ea0043ea3d4e",
         *       "type": "percent",
         *       "value": 0.23,
         *       "userEmail": "natan@mail.com",
         *       "created_at": "2020-04-13T23:25:46.094Z",
         *       "updated_at": "2020-04-13T23:25:46.094Z",
         *   }
         * ]
         *
         */
        $router->get('', [
            'as' => "{$routerNamePrefix}.list",
            'uses' => 'DiscountsController@list'
        ]);

        /**
         *
         * @api {post} /discounts Create Discount
         * @apiName ProxyCreateDiscount
         * @apiGroup ProxyDiscounts
         * @apiVersion v1
         *
         * @apiParam  {String} type Enum for the types used (percent, absolute)
         * @apiParam  {Number} value The decimal value for the discount
         * @apiParam  {String} userEmail The user email for the discount
         *
         * @apiParamExample  {json} Request-Example:
         * {
         *    "type": "percent",
         *	  "value": 0.23,
         *    "userEmail": "natan@mail.com"
         * }
         *
         * @apiSuccess (201) {json} The discount was create
         */
        $router->post('', [
            'as' => "{$routerNamePrefix}.create",
            'uses' => 'DiscountsController@create'
        ]);

        /**
         *
         * @api {put} /discounts Update Discount
         * @apiName ProxyUpdateDiscount
         * @apiGroup ProxyDiscounts
         * @apiVersion v1
         *
         * @apiParam  {String} type Enum for the types used (percent, absolute)
         * @apiParam  {Number} value The decimal value for the discount
         * @apiParam  {String} userEmail The user email for the discount
         *
         * @apiParamExample  {json} Request-Example:
         * {
         *    "type": "percent",
         *	  "value": 0.23,
         *    "userEmail": "natan@mail.com"
         * }
         *
         * @apiSuccess (201) {json} The discount was updated
         */
        $router->put('{id}', [
            'as' => "{$routerNamePrefix}.update",
            'uses' => 'DiscountsController@update'
        ]);

        /**
         *
         * @api {patch} /discounts Update many discounts
         * @apiName ProxyPatchDiscounts
         * @apiGroup ProxyDiscounts
         * @apiVersion v1
         *
         *
         * @apiParam  {String} type Enum for the types used (percent, absolute)
         * @apiParam  {Number} value The decimal value for the discount
         * @apiParam  {String} userEmail The user email for the discount
         *
         * @apiSuccess (204) {type} name description
         *
         * @apiParamExample  {type} Request-Example:
         * [
         *   {
         *       "id": 1,
         *       "type": "percent",
         *       "value": 0.23,
         *       "userEmail": "natan@mail.com"
         *   },
         *   {
         *       "id": 2,
         *       "type": "percent",
         *       "value": 0.23,
         *       "userEmail": "natan@mail.com"
         *   }
         * ]
         *
         *
         * @apiSuccessExample {empty} Success-Response:
         * No Content
         *
         *
         */
        $router->patch('', [
            'as' => "{$routerNamePrefix}.patch",
            'uses' => 'DiscountsController@patch'
        ]);

        /**
         * @api {delete} /discount/:id Delete Discount
         * @apiName ProxyDeleteDiscount
         * @apiGroup ProxyDiscounts
         * @apiVersion v1
         *
         * @apiSuccess (204) {empty} No Content
         *
         * @apiSuccessExample {empty} Success-Response:
         * No Content
         */
        $router->delete('{id}', [
            'as' => "{$routerNamePrefix}.delete",
            'uses' => 'DiscountsController@delete'
        ]);
    }
);

$routerNamePrefix = 'requests';
$router->group(['prefix' => $routerNamePrefix],
    function () use ($router, $routerNamePrefix) {

        /**
         * @api {get} /requests List Requests
         * @apiName ProxyListRquests
         * @apiGroup ProxyRequests
         * @apiVersion v1
         *
         * @apiSuccess (200) {json} List of all requests
         *
         * @apiSuccessExample {json} Success-Response:
         * [
         *   {
         *     id: 1,
         *     duration: 3,
         *     price: null,
         *     reference: '5e8d2b3eeb2249ed2136a62a',
         *     date: '2020-04-07T00:00:00.000Z',
         *     user: { name: 'Paula Saraiva', email: 'sulen.silva@live.com' }
         *   },
         *   {
         *     id: 2,
         *     duration: 8,
         *     price: null,
         *     reference: '5e8d2b3eeb2249ed2136a62b',
         *     date: '2020-04-07T00:00:00.000Z',
         *     user: { name: 'Breno Pereira', email: 'fbio_oliveira@live.com' }
         *   }
         * ]
         */
        $router->get('', [
            'as' => "{$routerNamePrefix}.list",
            'uses' => 'RequestsController@list'
        ]);

        /**
         * @api {post} /requests Create Request
         * @apiName ProxyCreateRquests
         * @apiGroup ProxyRequests
         * @apiVersion v1
         *
         * @apiParam  {Data} date Date when the cleaning request should be executed
         * @apiParam  {Number} duration Duration of the cleaning request
         * @apiParam  {String} user.name User name
         * @apiParam  {String} user.email User email
         *
         * @apiSuccess (201) {json} A new cleaning request was created
         *
         * @apiParamExample  {json} Request-Example:
         * {
         *   date: '2020-10-26',
         *   duration: 5,
         *   user: {
         *     name: 'Natan Augusto',
         *     email: 'natanaugusto@gmail.com'
         *   }
         * }
         *
         *
         * @apiSuccessExample {json} Success-Response:
         * {
         *   date: '2020-10-26',
         *   duration: 5,
         *   price: 250,
         *   user: {
         *     name: 'Natan Augusto',
         *     email: 'natanaugusto@gmail.com'
         *   }
         * }
         */
        $router->post('', [
            'as' => "{$routerNamePrefix}.create",
            'uses' => 'RequestsController@create'
        ]);

        /**
         * @api {put} /requests/:id Update Request
         * @apiName ProxyUpdateRequest
         * @apiGroup ProxyRequests
         * @apiVersion v1
         *
         * @apiParam  {Data} date Date when the cleaning request should be executed
         * @apiParam  {Number} duration Duration of the cleaning request
         * @apiParam  {String} user.name User name
         * @apiParam  {String} user.email User email
         *
         * @apiSuccess (204) {empty} No content
         *
         * @apiParamExample  {json} Request-Example:
         * {
         *   date: '2020-10-26',
         *   duration: 5,
         *   user: {
         *     name: 'Natan Augusto',
         *     email: 'natanaugusto@gmail.com'
         *   }
         * }
         *
         * @apiSuccessExample {empty} Success-Response:
         * No Content
         */
        $router->put('{id}', [
            'as' => "{$routerNamePrefix}.update",
            'uses' => 'RequestsController@update'
        ]);

        /**
         * @api {patch} /api/v1/requests Patch Requests
         * @apiName PatchRequests
         * @apiGroup Requests
         * @apiVersion v1
         *
         * @apiParam  {Array} none Multiple requests
         *
         * @apiSuccess (204) {empty} No Content
         *
         * @apiSuccessExample {empty} Success-Response:
         * No Content
         */
        $router->patch('', [
            'as' => "{$routerNamePrefix}.patch",
            'uses' => 'RequestsController@patch'
        ]);

        /**
         * @api {delete} /requests/:id Delete Request
         * @apiName ProxyDeleteRequest
         * @apiGroup ProxyRequests
         * @apiVersion v1
         *
         * @apiSuccess (204) {empty} No Content
         *
         * @apiSuccessExample {empty} Success-Response:
         * No Content
         */
        $router->delete('{id}', [
            'as' => "{$routerNamePrefix}.delete",
            'uses' => 'RequestsController@delete'
        ]);
    }
);
