<?php

namespace App\Console\Commands;

use App\Request;
use App\Jobs\SyncJob;
use App\Services\RequestService;

use OneHelpSDK\Facades\Cleaning;

use Illuminate\Console\Command;

class SyncRequests extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sync:requests {date?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sincronize the proxy with the lastest cleaning requests';

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
            $lastUpdated = Request::select('updated_at')->latest()->first();
            $date = $lastUpdated->count() ? $lastUpdated->updated_at : 'all';
        }
        $latests = $date === 'all'
            ? Cleaning::getRequests()->toArray()
            : Cleaning::getRequestLastUpdate($date)->toArray();
        $requestService = new RequestService();
        foreach($latests as $request) {
            dispatch(new SyncJob($requestService, $request['_id'], $request));
        }
    }
}
