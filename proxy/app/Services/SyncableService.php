<?php
namespace App\Services;

use App\Contracts\ModelInterface;
use OneHelpSDK\Clients\Utils\HttpResult;

abstract class SyncableService
{
    protected $sdkClient;
    protected $sdkCreateMethod;
    protected $sdkUpdateMethod;
    protected $sdkDeleteMethod;

    /**
     * Sincronize the local data with the remote data
     *
     * @param string $reference
     * @param array $data
     * @return void
     */
    public function sync(string $reference = null, array $data = null): void
    {
        $httpResult = $reference
            ? $this->apiPut($reference, $data)
            : $this->apiPost($data);

        $model = $this->syncModel($httpResult);
        $model->save();
    }

    /**
     * Delete the data from local and remote
     *
     * @param ModelInterface $model
     * @return void
     */
    public function delete(ModelInterface $model): void
    {
        $this->sdkClient::{$this->sdkDeleteMethod}($model->reference);
        $model->delete();
    }

    /**
     * Update a remote data
     *
     * @param string $reference
     * @param array $data
     * @return HttpResult
     */
    protected function apiPut(string $reference, array $data): HttpResult
    {
        return $this->sdkClient::{$this->sdkUpdateMethod}($reference, $data);
    }

    /**
     * Create a remote data
     *
     * @param array $data
     * @return HttpResult
     */
    protected function apiPost(array $data): HttpResult
    {
        return $this->sdkClient::{$this->sdkCreateMethod}($data);
    }

    /**
     * Syncronize the local data with the result of the remote request
     *
     * @param HttpResult $result
     * @return ModelInterface
     */
    abstract protected function syncModel(HttpResult $result): ModelInterface;
}
