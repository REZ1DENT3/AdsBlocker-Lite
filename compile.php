<?php

include_once "vendor/autoload.php";

use MatthiasMullie\Minify;

function sbversion()
{
    $build = file_get_contents('build');
    $build++;
    file_put_contents('build', $build);
    $sb = round($build / ($build * 0.441), 3);
    $manifest = file_get_contents('source/manifest.json');
    $manifest = (array)json_decode($manifest);
    $manifest['version'] = "$sb";
    $manifest = json_encode($manifest, JSON_PRETTY_PRINT);
    $manifest = str_replace("\\/", "/", $manifest);
    file_put_contents('source/manifest.json', $manifest);
    return $sb;
}

try {

    $minnerJson = file_get_contents('minner.json');
    $minnerJson = json_decode($minnerJson);

    $caches = [];
    $sbversion = sbversion();
    foreach ($minnerJson as $fileName => $data) {

        $results = [];
        $results['jquery.min.js'] = file_get_contents('source/src/jquery.min.js');
        $fileName = 'source/js/' . $fileName . '.min.js';

        foreach ($data as $file) {
            $path = 'source/src/' . $file;
            if (!isset($caches[$path])) {
                $minifier = new Minify\JS();
                $minifier->add(file_get_contents(__DIR__ . '/' . $path));
                $caches[$path] = $minifier->minify();
            }
            $results[$file] = $caches[$path];
        }
        $minifier = new Minify\JS();
        $minifier->add(str_replace(PHP_EOL, "", implode(';', $results)));
        $data = file_get_contents('header.js') . $minifier->minify();
        $data = str_replace(";;", ";", $data);
        $data = str_replace("{version}", $sbversion, $data);
        $data = str_replace("{year}", 2013 == date('Y') ? date('Y') : '2013 - ' . date('Y'), $data);
        file_put_contents($fileName, $data);
        var_dump([$fileName => array_keys($results)]);
    }
}
catch (\Exception $e) {
    var_dump($e);
}