<?php

use Validator as Validator;

/**
 * Will check and array field if all values are null or empty
 * @param  array $field
 * @return bool true or false
 */
function isFieldArrayNull(array $field)
{
	$result = true;

	foreach ($field as $key => $value) {
		if (!empty($value)) {
			$result = false;
		}
	}

	return $result;
}

/**
 * Will validate input data depending on validation type
 * @param array $data input by user
 * @param array $to_validate_data model rules
 * @param array $custom_message custom error messages on validation
 */
function validateInput(array $data, array $to_validate_data, array $custom_message = [])
{
	$validator = Validator::make($data, $to_validate_data, $custom_message);

	if ($validator->fails()) {
		throw new \Exception($validator->errors());
	}
}

/**
 * Intersects result from normal seach and keyWord Search
 * @param  array $params Array of arrays to interserct
 * @return array array_intersect result
 */
function arrayIntersectResults(array $params)
{
    $count = 0;
    //checks if params is empty, return empty array
    if (count($params) == 0) {
        return [];
    }

    foreach ($params as $value) {

        if ($count > 0) {
            $result = array_intersect($result, $value);
        } else {
            $result = $value;
        }
        $count++;
    }
    return $result;
}

/**
 * Intersects result from normal search and keyWord Search
 * @param  array $params Array of arrays of collection
 * @return array Array intersected Collections
 */
function collectionIntersectResults(array $params)
{
    $count = 0;
    //checks if params is empty, return empty array
    if (count($params) == 0) {
        return [];
    }

    foreach ($params as $value) {

        if ($count > 0) {
            $result = $result->intersect($value);
        } else {
            $result = $value;
        }
        $count++;
    }

    return $result;
}

/**
 * generates random integer
 * @param  Int $length interger length to be returned
 * @return Int Random digits
 */
function generateRandomInt($length)
{
    $result = '';

    for ($i=0; $i < $length; $i++) {

        $result = $result . rand(0,9);
    }

    return $result;
}

/**
 * Dynamic method that formats the whereBetween params
 * @param  String $field  Field to be search in whereBetween
 * @param  Mixed $param1 min value
 * @param  Mixed $param2 max value
 * @return Array Formated array to be used in repositories
 */
function formatWhereBetweenParams($field, $param1, $param2)
{
    return [
        $field => [$param1, $param2]
    ];
}
