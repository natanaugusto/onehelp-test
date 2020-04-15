<?php
namespace OneHelpSDK\Clients;

use OneHelpSDK\Clients\Utils\HttpClient;
use OneHelpSDK\Clients\Utils\HttpResult;

class Cleaning extends HttpClient {
    const BASE_URI = 'http://cleaning.onehelp.natanaugusto.com/v1/';

    public function getRequests(): HttpResult
    {
        return $this->sendRequest('GET', 'requests');
    }

    public function createRequest(array $request): HttpResult
    {
        return $this->sendRequest('POST', 'requests', $request);
    }

    public function updateRequest(string $id, array $request): HttpResult
    {
        return $this->sendRequest('PUT', "requests/{$id}", $request);
    }

    public function deleteRequest(string $id): HttpResult
    {
        return $this->sendRequest('DELETE', "requests/{$id}");
    }

    public function getRequestLastUpdate(): HttpResult
    {
        return $this->sendRequest('GET', 'requests/last-update');
    }

    protected function getHttpSettings(): array
    {
        return [
            'base_uri' => self::BASE_URI
        ];
    }
}
