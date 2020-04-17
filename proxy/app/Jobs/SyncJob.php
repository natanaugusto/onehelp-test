<?php

namespace App\Jobs;

use App\Contracts\SyncableInterface;

class SyncJob extends Job
{
    public $service;
    public $reference;
    public $data;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct(SyncableInterface $service, string $reference = null, array $data = null)
    {
        $this->service = $service;
        $this->reference = $reference;
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $this->service->sync($this->reference, $this->data);
    }
}
