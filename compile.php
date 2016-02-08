<?php

include_once "vendor/autoload.php";

use MatthiasMullie\Minify;

function build()
{
    return (int)trim(file_get_contents('build'));
}

function version()
{
    return round(0.000441 * build(), 3);
}

function nextBuild()
{
    $build = build();
    $build++;
    file_put_contents('build', $build);
}

function sbversion()
{
    nextBuild();
    $sb = version();
    $manifest = file_get_contents('source/manifest.json');
    $manifest = (array)json_decode($manifest);
    $manifest['version'] = "$sb";
    $manifest = json_encode($manifest, JSON_PRETTY_PRINT);
    $manifest = str_replace("\\/", "/", $manifest);
    file_put_contents('source/manifest.json', $manifest);
    return $sb;
}

if (isset($argv[1]) && $argv[1] == '-v') {
    echo version(), " [", build(), "]", PHP_EOL;
    die;
}

try {

    $minnerJson = file_get_contents('minner.json');
    $minnerJson = json_decode($minnerJson);

    $caches = [];
    $sbversion = sbversion();
    foreach ($minnerJson as $fileName => $data) {

        $results = [];
        $fileName = 'source/js/' . $fileName . '.min.js';

        $minifier = new Minify\JS();
        foreach ($data as $file) {
            $path = 'src/js/' . $file;
            $minifier->add($path);
            $results[] = $file;
        }

        $data = file_get_contents('src/js/header.js') . $minifier->minify();

        $data = str_replace("{version}", $sbversion, $data);
        $data = str_replace("{year}", '2013 - ' . date('Y'), $data);

        file_put_contents($fileName, $data);
        var_dump([$fileName => array_values($results)]);
    }

    $cssFiles = scandir('src/css');
    unset($cssFiles[0], $cssFiles[1]);
    $minifier = new Minify\CSS();
    foreach ($cssFiles as $file) {
        $minifier->add('src/css/' . $file);
    }
    $minifier->minify('source/css/css.css');
}
catch (\Exception $e) {
    var_dump($e);
}