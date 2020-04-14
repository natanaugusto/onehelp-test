<?php
namespace App;

interface ModelInterface {
    /**
     * Save the model to the database.
     *
     * @param  array  $options
     * @return bool
     */
    public function save(array $options = []);
}
