<?php

require_once __DIR__.'/vendor/autoload.php';
require __DIR__. '/google-drive.php';
use Twilio\Rest\Client;

$person = "Jules CLERC";
$problem = "Problème de cuisine";
$msg = "Bonjour actuellement dans mon appartement, mon évier ne se vide pas.";

$sid = "AC99d296fe596a281af11d621be7728e43";
$token = "92d935a3eb386b4eb06492c20109195b";
$twilio = new Client($sid, $token);
$uploaddir = 'uploads/';

echo '<pre>';

$objDateTime = new DateTime('NOW');
$dateTimeNow = $objDateTime->format('Y-m-d\TH:i:s');

$folder_id = create_folder($dateTimeNow, "1rTAlHXJGSq8uAelakEgLXINqhHYS5Lhg");

$file_count = count($_FILES["filesName"]['name']);

//send messages
$message = $twilio->messages
    ->create("whatsapp:+33625247922", // to
        array(
            "from" => "whatsapp:+14155238886",
            "body" => "(Une personne a envoyé un message depuis le site internet NQ) $person rencontre le problème suivant : $problem.\n
            Voir les " . $file_count . " fichiers qu'elle a envoyé à l'adresse suivante :
            https://drive.google.com/drive/folders/$folder_id\n
            Informations Supplémentaires :\n
            $msg"
        )
    );

//send files
for ($i=0; $i<$file_count; $i++) {
    $uploadfile = $uploaddir . basename($_FILES['filesName']['name'][$i]);
    if (move_uploaded_file($_FILES['filesName']['tmp_name'][$i], $uploadfile)) {
        insert_file_to_drive( $uploadfile , $_FILES['filesName']['name'][$i], $folder_id);
    } else {
        echo "Attaque potentielle par téléchargement de fichiers.";
    }
}

echo '</pre>';

// This will create a folder and also sub folder when $parent_folder_id is given
function create_folder( $folder_name, $parent_folder_id=null ){

    $folder_list = check_folder_exists( $folder_name );

    // if folder does not exists
    if( count( $folder_list ) == 0 ){
        $service = new Google_Service_Drive( $GLOBALS['client'] );
        $folder = new Google_Service_Drive_DriveFile();

        $folder->setName( $folder_name );
        $folder->setMimeType('application/vnd.google-apps.folder');
        if( !empty( $parent_folder_id ) ){
            $folder->setParents( [ $parent_folder_id ] );
        }

        $result = $service->files->create( $folder );

        $folder_id = null;

        if( isset( $result['id'] ) && !empty( $result['id'] ) ){
            $folder_id = $result['id'];
        }

        return $folder_id;
    }

    return $folder_list[0]['id'];

}

// This will check folders and sub folders by name
function check_folder_exists( $folder_name ){

    $service = new Google_Service_Drive($GLOBALS['client']);

    $parameters['q'] = "mimeType='application/vnd.google-apps.folder' and name='$folder_name' and trashed=false";
    $files = $service->files->listFiles($parameters);

    $op = [];
    foreach( $files as $k => $file ){
        $op[] = $file;
    }

    return $op;
}

// This will insert file into drive and returns boolean values.
function insert_file_to_drive( $file_path, $file_name, $parent_file_id = null ){
    $service = new Google_Service_Drive( $GLOBALS['client'] );
    $file = new Google_Service_Drive_DriveFile();

    $file->setName( $file_name );

    if( !empty( $parent_file_id ) ){
        $file->setParents( [ $parent_file_id ] );
    }

    $result = $service->files->create(
        $file,
        array(
            'data' => file_get_contents($file_path),
            'mimeType' => 'application/octet-stream',
        )
    );

    $is_success = false;

    if( isset( $result['name'] ) && !empty( $result['name'] ) ){
        $is_success = true;
    }

    return $is_success;
}
