<?php
if (!isset($_GET['code'])) {
    die("Error: No se recibió el código de autorización.");
}

$auth_code = $_GET['code'];

$client_id = "1063860719621-c4h094m96rr1shk8e6tk50kmmko1dj9q.apps.googleusercontent.com";
$client_secret = "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";
$redirect_uri = "https://desarrolloydisenio.com.ar/oauth/callback/callback.php";

$token_url = "https://oauth2.googleapis.com/token";
$data = [
    'code' => $auth_code,
    'client_id' => $client_id,
    'client_secret' => $client_secret,
    'redirect_uri' => $redirect_uri,
    'grant_type' => 'authorization_code'
];

$options = [
    'http' => [
        'header'  => "Content-Type: application/x-www-form-urlencoded\r\n",
        'method'  => 'POST',
        'content' => http_build_query($data)
    ]
];

$context  = stream_context_create($options);
$result = file_get_contents($token_url, false, $context);

if ($result === FALSE) {
    echo "❌ Error al obtener el token.";
} else {
    $response = json_decode($result, true);
    
    if (isset($response['access_token'])) {
        echo "✅ Token de acceso obtenido con éxito: " . $response['access_token'];
    } else {
        echo "❌ Error en la respuesta de Google: <pre>" . json_encode($response, JSON_PRETTY_PRINT) . "</pre>";
    }
}
?>
