<?php
namespace OneHelpSDK\Clients\Utils;

use Exception;
use Illuminate\Support\Collection;
use Psr\Http\Message\StreamInterface;

class HttpResult
{
    private $object;

    public function __construct(StreamInterface $body)
    {
        $body = json_decode($body);
        if (is_array($body)) {
            $body = collect($body);
        }
        $this->object = $body;
    }

    public function __get(string $value)
    {
        if ($this->isCollection()) {
            throw new Exception('This object is a Collection');
        }
        return $this->object->{$value};
    }

    public function __call($method, $args)
    {
        if (!method_exists($this->object, $method)) {
            throw new Exception("This object does not have the method: {$method}");
        }
        return call_user_func_array([
            $this->object,
            $method
        ], $args);
    }

    public function toArray(): array
    {
        $object = $this->object;
        if ($this->isCollection()) {
            $object = $object->toArray();
        }
        return json_decode(json_encode($object), true);
    }

    public function isCollection(): bool
    {
        return $this->object instanceof Collection;
    }
}
