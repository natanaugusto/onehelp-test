<?php
namespace OneHelpSDK\Tests;

trait OneHelpAsserts
{
    public function assertArrayStructure(array $structure, array $array)
    {
        foreach($structure as $key => $value) {
            if (is_string(($key))) {
                $this->assertArrayHasKey($key, $array);
                $this->assertArrayStructure($value, $array[$key]);
                continue;
            }
            $this->assertArrayHasKey($value, $array);
        }
    }
}
