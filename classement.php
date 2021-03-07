<?php
header("content-type:application/json");

//On récupère les variables nom et score
$joueur = isset($_POST['joueur']) ? $_POST['joueur'] : "";
$score = isset($_POST['score']) ? $_POST['score'] : 0;
$secretKey = isset($_POST['secretKey']) ? $_POST['secretKey'] : "";


//On récupère le fichier Json qui contient les dix meilleurs joueurs
$url = './score/top10.json';
$data = file_get_contents($url);
$classement = json_decode($data, true);

$tailleNom = strlen($joueur);

$string = base64_encode("FLAG" . $joueur . $score);
$code = md5($string);

if ($tailleNom < 2 || $tailleNom > 10 || !is_numeric($score) || $score > 100 || $code != $secretKey) {
    echo json_encode($classement);
    exit();
}


//Dans l'éventualité que le fichier json est vide on crée un array
if ($classement == null) {
    $classement = array();
}

//On ajoute l'élément au array
array_push($classement, ['joueur' => $joueur, 'score' => $score]);

//On classe le array en ordre décroissant
usort($classement, cmp('score'));

$temp = array();
$cpt = 0;

foreach ($classement as $item) {
    array_push($temp, $item);

    if (++$cpt == 10)
        break;
}

$fp = fopen($url, 'w');
fwrite($fp, json_encode($temp));
fclose($fp);
echo json_encode($temp);
exit();

function cmp($score)
{
    return function ($a, $b) use ($score) {
        if ($a[$score] == $b[$score]) {
            return 0;
        }
        return ($a[$score] < $b[$score]) ? 1 : -1;
    };
}
