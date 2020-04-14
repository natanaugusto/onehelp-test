<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Request extends Model implements ModelInterface
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reference',
        'user_id',
        'date',
        'duration',
        'price',
    ];
}
