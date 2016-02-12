<?php

include_once "vendor/autoload.php";

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
    $manifest = file_get_contents('blocker/manifest.json');
    $manifest = (array)json_decode($manifest);
    $manifest['version'] = "$sb";
    $manifest = json_encode($manifest, JSON_PRETTY_PRINT);
    $manifest = str_replace("\\/", "/", $manifest);
    file_put_contents('blocker/manifest.json', $manifest);
    return $sb;
}

if (isset($argv[1]) && $argv[1] == '-v') {
    echo version(), " [", build(), "]", PHP_EOL;
    die;
}

try {

    $sbversion = sbversion();

    $minnerJson = file_get_contents('minner.json');
    $minnerJson = json_decode($minnerJson);

    $rules = [];
    $last = [];
    foreach ($minnerJson as $fileName => $data) {
        if ($fileName == '[UnionAll]') {
            foreach ($data as $value) {
                $value->type = mb_strtoupper($value->type);
                $last[$value->type][] = explode('+', $value->data);
            }
        } else {
            $rules[$data->type][$fileName] = $data->data;
        }
    }


    $caches = [];
    $allFiles = [];
    foreach ($rules as $type => $data) {
        $type = mb_strtoupper($type);
        $namespace = "\\MatthiasMullie\\Minify\\" . $type;
        foreach ($data as $fileName => $files) {

            $allFiles[$type][$fileName] = "";
            foreach ($files as $file) {

                if (!isset($caches[$type][$file])) {

                    $minifier = new $namespace();
                    $path = 'src/' . mb_strtolower($type) . '/' . $file;

                    if (file_exists('cache/' . md5($file))) {
                        $caches[$type][$file] = file_get_contents('cache/' . md5($file));
                        if (trim($caches[$type][$file]) == '') {
                            $caches[$type][$file] = '';
                        }
                    }

                    if (empty($caches[$type][$file])) {

                        if (file_exists($path)) {
                            $minifier->add('src/' . mb_strtolower($type) . '/' . $file);
                            $caches[$type][$file] = $minifier->minify();
                        }
                        else {
                            $minifier->add(file_get_contents($file));
                            $caches[$type][$file] = $minifier->minify();
                            file_put_contents('cache/' . md5($file), $caches[$type][$file]);
                        }
                    }

                }

                $allFiles[$type][$fileName] .= PHP_EOL . $caches[$type][$file];

            }

        }
    }

    $unionAllFiles = [];
    foreach ($last as $type => $data) {
        foreach ($data as $file) {
            $srcName = implode('+', $file);
            foreach ($file as $data) {
                $unionAllFiles[$type][$srcName][] = $allFiles[$type][$data];
            }
            $allFiles[$type][$srcName] = implode(';', $unionAllFiles[$type][$srcName]);
        }
    }

    $header = file_get_contents('src/header');
    $header = str_replace("{version}", $sbversion, $header);
    $header = str_replace("{year}", '2013 - ' . date('Y'), $header);

    echo PHP_EOL, $header, PHP_EOL;
    foreach ($allFiles as $type => $dataFiles) {
        $typePath = mb_strtolower($type);
        $maxLength = 0;
        foreach ($dataFiles as $fileName => $data) {
            $fileName = 'blocker/' . $typePath . '/' . $fileName . '.min.' . $typePath;
            file_put_contents($fileName, $header . $data);
            $maxLength = max($maxLength, mb_strlen(mb_strlen($data)));
        }

        foreach ($dataFiles as $fileName => $data) {
            $fileName = 'blocker/' . $typePath . '/' . $fileName . '.min.' . $typePath;
            printf("length: %-" . $maxLength . "d\t fileName: %s" . PHP_EOL, mb_strlen($data), $fileName);
        }
    }

    echo PHP_EOL, "complete!", PHP_EOL, PHP_EOL;

} catch (\Exception $e) {
    var_dump($e);
}