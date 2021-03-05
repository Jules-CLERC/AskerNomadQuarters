<?php

require_once __DIR__.'/vendor/autoload.php';
use Twilio\Rest\Client;

$sid = "AC99d296fe596a281af11d621be7728e43";
$token = "a285d74bac2c72f97ad896e33126acb4";
$twilio = new Client($sid, $token);
$uploaddir = 'uploads/';

echo '<pre>';

$file_count = count($_FILES["filesName"]['name']);

//send messages
$message = $twilio->messages
    ->create("whatsapp:+33625247922", // to
        array(
            "from" => "whatsapp:+14155238886",
            "body" => "Bonjour monsieur CLERC a un problème avec sa cuisine. Voir les " . $file_count . " fichiers ci-dessous"
        )
    );

//send files
for ($i=0; $i<$file_count; $i++) {
    $uploadfile = $uploaddir . basename($_FILES['filesName']['name'][$i]);
    if (move_uploaded_file($_FILES['filesName']['tmp_name'][$i], $uploadfile)) {
        $message = $twilio->messages
            ->create("whatsapp:+33625247922", // to
                array(
                    "mediaURL" => ["https://nomadquarters.com/askerNQ/uploads/".$_FILES['filesName']['name'][$i]],
                    "from" => "whatsapp:+14155238886"
                )
            );
    } else {
        echo "Attaque potentielle par téléchargement de fichiers.
          Voici plus d'informations :\n";
    }
}

echo '</pre>';

/*
foreach ($_FILES["filesName"]['name'] as $key) {
    if (move_uploaded_file($_FILES['filesName']['tmp_name'][0], $uploadfile)) {
        $sid = "AC99d296fe596a281af11d621be7728e43";
        $token = "a285d74bac2c72f97ad896e33126acb4";
        $twilio = new Client($sid, $token);

        $message = $twilio->messages
            ->create("whatsapp:+33625247922", // to
                array(
                    "mediaURL" => ["https://nomadquarters.com/askerNQ/uploads/".$_FILES['filesName']['name'][0]],
                    "from" => "whatsapp:+14155238886",
                    "body" => "Ceci est un message test"
                )
            );
    } else {
        echo "Attaque potentielle par téléchargement de fichiers.
          Voici plus d'informations :\n";
    }
}
*/

/*
$tmp_dir = sys_get_temp_dir();
//echo $tmp_dir;
foreach ($_FILES["filesName"]['tmp_name'] as $key) {
    echo $tmp_dir . "/" . $key;
    if (file_exists($tmp_dir . "/" . $key)) {
        echo "oui";
    }
    else {
        echo "non";
    }
}
*/


/*
// Update the path below to your autoload.php,
// see https://getcomposer.org/doc/01-basic-usage.md
$sid = "AC99d296fe596a281af11d621be7728e43";
$token = "a285d74bac2c72f97ad896e33126acb4";
$twilio = new Client($sid, $token);

$message = $twilio->messages
    ->create("whatsapp:+33625247922", // to
        array(
            "mediaUrl" => ["https://images.unsplash.com/photo-1431250620804-78b175d2fada?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1600&h=900&fit=crop&ixid=eyJhcHBfaWQiOjF9"],
            "from" => "whatsapp:+14155238886",
            "body" => "Ceci est un message test"
        )
    );
//print($message->sid);
*/
