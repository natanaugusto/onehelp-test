<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\User;
use App\Request;
use Faker\Generator as Faker;

$factory->define(Request::class, function (Faker $faker) {
    static $user_id;
    return [
        'user_id' => $user_id ?: function () {
            $user = factory(User::class)->create();
            return $user->id;
        },
        'reference' => $faker->unique()->uuid,
        'date' => $faker->date('Y-m-d'),
        'price' => $faker->numberBetween(50, 400),
        'duration' => $faker->numberBetween(1, 8),
    ];
});
