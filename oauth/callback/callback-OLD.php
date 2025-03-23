<?php
// Verifica si Google ha enviado un código de autorización
if (!isset($_GET['code'])) {
    die("Error: No se recibió el código de autorización.");
}

$auth_code = $_GET['code']; // Captura el código de autorización

// Configura los datos de la aplicación (reemplaza con tus valores reales)
$client_id = "1063860719621-c4h094m96rr1shk8e6tk50kmmko1dj9q.apps.googleusercontent.com";
$client_secret = "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";
$redirect_uri = "https://desarrolloydisenio.com.ar/oauth/callback/";

// Intercambiar el código por un access_token
$token_url = "https://oauth2.googleapis.com/token";
$data = [
    "code" => $auth_code,
    "client_id" => $client_id,
    "client_secret" => $client_secret,
    "redirect_uri" => $redirect_uri,
    "grant_type" => "authorization_code"
];

$options = [
    "http" => [
        "header"  => "Content-Type: application/x-www-form-urlencoded",
        "method"  => "POST",
        "content" => http_build_query($data)
    ]
];

$context  = stream_context_create($options);
$response = file_get_contents($token_url, false, $context);
$result = json_decode($response, true);

// Verifica si se recibió un access_token
if (isset($result["access_token"])) {
    file_put_contents("access_token.json", json_encode($result, JSON_PRETTY_PRINT));
    echo "Token de acceso obtenido y guardado correctamente.";
} else {
    echo "Error al obtener el token: " . $response;
}
?>
