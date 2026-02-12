<?php

use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Home'); // This matches resources/js/Pages/Home.jsx
});
