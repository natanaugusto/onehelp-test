<?php
namespace Tests;

use Laravel\Lumen\Testing\DatabaseMigrations;
use Laravel\Lumen\Http\Request as LumenRequest;
use Symfony\Component\HttpFoundation\File\UploadedFile as SymfonyUploadedFile;
use Symfony\Component\HttpFoundation\Request as SymfonyRequest;

abstract class TestCase extends \AlbertCht\Lumen\Testing\TestCase
{
    use DatabaseMigrations;

    private $lastRequest;

    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__.'/../bootstrap/app.php';
    }

    public function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Call the given URI and return the Response.
     *
     * @param  string  $method
     * @param  string  $uri
     * @param  array  $parameters
     * @param  array  $cookies
     * @param  array  $files
     * @param  array  $server
     * @param  string  $content
     * @return \Illuminate\Http\Response
     */
    public function call($method, $uri, $parameters = [], $cookies = [], $files = [], $server = [], $content = null)
    {
        $this->currentUri = $this->prepareUrlForRequest($uri);

        $symfonyRequest = SymfonyRequest::create(
            $this->currentUri, $method, $parameters,
            $cookies, $files, $server, $content
        );

        $this->app['request'] = LumenRequest::createFromBase($symfonyRequest);

        return $this->response = $this->createTestResponse(
            $this->app->prepareResponse($this->app->handle($this->app['request']))
        );
    }

    /**
     * Extract the file uploads from the given data array.
     *
     * @param  array  $data
     * @return array
     */
    protected function extractFilesFromDataArray(&$data)
    {
        $files = [];

        foreach ($data as $key => $value) {
            if ($value instanceof SymfonyUploadedFile) {
                $files[$key] = $value;

                unset($data[$key]);
            }

            if (is_array($value)) {
                $files[$key] = $this->extractFilesFromDataArray($value);
                if (!empty($files[$key])) {
                    unset($data[$key]);
                }
                $data[$key] = $value;
            }
        }

        return $files;
    }

    /**
     * Create the test response instance from the given response.
     *
     * @param  \Illuminate\Http\Response $response
     * @return TestResponse
     */
    protected function createTestResponse($response)
    {
        return TestResponse::fromBaseResponse($response);
    }
}
