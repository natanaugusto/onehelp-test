<?php

namespace App;

use App\Contracts\ModelInterface;
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

    protected $casts = [
        'reference' => 'string',
        'user_id' => 'integer',
        'date' => 'date',
        'duration' => 'integer',
        'price' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
