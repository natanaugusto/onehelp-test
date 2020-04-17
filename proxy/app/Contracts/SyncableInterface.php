<?php
namespace App\Contracts;

use OneHelpSDK\Clients\Utils\HttpResult;

interface SyncableInterface
{
    function sync(string $reference = null, array $data = null): void;
    function delete(ModelInterface $model): void;
}
