<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\User;
use App\Discount;
use Faker\Generator as Faker;

$factory->define(Discount::class, function (Faker $faker) {
    static $user_id;
    return [
        'user_id' => $user_id ?: function () {
            $user = factory(User::class)->create();
            return $user->id;
        },
        'reference' => $faker->unique()->uuid,
        'type' => $faker->randomElement(['percent', 'absolute']),
        'value' => $faker->numberBetween(0.1, 100),
    ];
});
