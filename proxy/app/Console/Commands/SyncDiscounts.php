<?php

namespace App\Console\Commands;

use App\Discount;
use App\Jobs\SyncJob;
use App\Services\DiscountService;

use OneHelpSDK\Facades\Discounts;

use Illuminate\Console\Command;

class SyncDiscounts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:discounts {date?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincronize the proxy with the lastest discounts';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        $date = $this->argument('date');
        if (!$date) {
            $lastUpdated = Discount::select('updated_at')->latest()->first();
            $date = $lastUpdated->count() ? $lastUpdated->updated_at : 'all';
        }
        $latests = $date === 'all'
            ? Discounts::get()->toArray()
            : Discounts::getLastUpdate($date)->toArray();
        $requestService = new DiscountService();
        foreach($latests as $request) {
            dispatch(new SyncJob($requestService, $request['_id'], $request));
        }
    }
}
