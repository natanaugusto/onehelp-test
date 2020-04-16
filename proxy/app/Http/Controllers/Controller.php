<?php

namespace App\Http\Controllers;

use App\Contracts\ModelInterface;
use Laravel\Lumen\Routing\Controller as BaseController;

class Controller extends BaseController
{
    protected function fillWithData(ModelInterface &$model, array $data): void
    {
        foreach ($data as $property => $value) {
            $model->{$property} = $value;
        }
    }
}
