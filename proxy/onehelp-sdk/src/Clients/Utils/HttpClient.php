<?php
namespace OneHelpSDK\Clients\Utils;

use Exception;
use GuzzleHttp\Client as GuzzleHttpClient;
use GuzzleHttp\Psr7\Response as GuzzleHttpResponse;

abstract class HttpClient
{
    protected $http;
    protected $response;
    protected $result;

    protected static $methodsAllowed = [
        'GET',
        'POST',
        'PUT',
        'UPDATE',
        'DELETE',
        'PATCH',
    ];

    public function __construct()
    {
        $this->http = new GuzzleHttpClient($this->getHttpSettings());
    }

    public function getResponse(): GuzzleHttpResponse
    {
        return $this->response;
    }

    public function getResult(): HttpResult
    {
        return $this->result;
    }

    public function getStatus(): int
    {
        return $this->response->getStatusCode();
    }

    public function sendRequest(string $method, string $path, array $data = null): HttpResult
    {
        if (!in_array($method, self::$methodsAllowed)) {
            throw new Exception("The method {$method} is not allowed");
        }
        $this->processResponse(
            $this->http->request(
                $method,
                $path,
                $this->generateSendData($data)
            )
        );
        return $this->getResult();
    }

    protected function processResponse(GuzzleHttpResponse $response)
    {
        $this->response = $response;
        $this->result = new HttpResult($response->getBody());
    }

    protected function generateSendData(array $data = null): array
    {
        $return = $this->getHeadersOptions();
        if (!empty($data)) {
            $return += ['body' => json_encode($data)];
        }
        return $return;
    }

    /**
     * Return the headers options
     *
     * @return array
     */
    protected function getHeadersOptions(): array
    {
        return [
            'headers' => [
                'Content-Type' => 'application/json'
            ]
        ];
    }

    abstract protected function getHttpSettings(): array;
}
