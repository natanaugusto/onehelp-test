<?php

namespace App;

use App\Contracts\ModelInterface;
use Illuminate\Database\Eloquent\Model;

class Discount extends Model implements ModelInterface
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'reference',
        'user_id',
        'type',
        'value',
    ];

    protected $casts = [
        'reference' => 'string',
        'user_id' => 'integer',
        'type' => 'string',
        'value' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
