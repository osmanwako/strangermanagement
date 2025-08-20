<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Paths
    |--------------------------------------------------------------------------
    |
    | The endpoints that should be accessible from your frontend.
    | Include 'sanctum/csrf-cookie' so the CSRF token request works.
    |
    */
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Methods
    |--------------------------------------------------------------------------
    */
    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Put your React Vite frontend URL here.
    | Example: http://localhost:5173 for Vite dev server.
    |
    */
    'allowed_origins' => ['http://localhost:5173', 'http://127.0.0.1:5173'],

    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | Allowed Headers
    |--------------------------------------------------------------------------
    */
    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Sanctum SPA auth needs cookies, so this must be true.
    |
    */
    'supports_credentials' => true,

];
