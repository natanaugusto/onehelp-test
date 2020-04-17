<?php
namespace OneHelpSDK\Clients;

use OneHelpSDK\Clients\Utils\HttpClient;
use OneHelpSDK\Clients\Utils\HttpResult;

class Discounts extends HttpClient {
    const BASE_URI = 'http://discounts:3002/v1/';

    public function get(): HttpResult
    {
        return $this->sendRequest('GET', 'discounts');
    }

    public function create(array $discount): HttpResult
    {
        return $this->sendRequest('POST', 'discounts', $discount);
    }

    public function update(string $id, array $discount): HttpResult
    {
        return $this->sendRequest('PUT', "discounts/{$id}", $discount);
    }

    public function delete(string $id): HttpResult
    {
        return $this->sendRequest('DELETE', "discounts/{$id}");
    }

    public function getLastUpdate(string $date = null): HttpResult
    {
        $uri = 'discounts/last-update';
        if ($date) {
            $uri .= "?since={$date}";
        }
        return $this->sendRequest('GET', $uri);
    }

    protected function getHttpSettings(): array
    {
        return [
            'base_uri' => self::BASE_URI
        ];
    }
}
