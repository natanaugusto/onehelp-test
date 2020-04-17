<?php
namespace Tests\Features;

use App\Jobs\SyncJob;
use App\Services\RequestService;
use App\Services\DiscountService;
use Tests\TestCase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Artisan;

class SyncCommandsTest extends TestCase
{
    public function testSyncRequests()
    {
        Bus::fake();

        Artisan::call('sync:requests', ['date' => '2020-04-15']);

        Bus::assertDispatched(SyncJob::class, function ($job) {
            return $job->service instanceof RequestService;
        });
    }

    public function testSyncDiscounts()
    {
        Bus::fake();

        Artisan::call('sync:discounts', ['date' => '2020-04-16']);

        Bus::assertDispatched(SyncJob::class, function ($job) {
            return $job->service instanceof DiscountService;
        });
    }
}
