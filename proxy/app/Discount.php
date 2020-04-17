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

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
