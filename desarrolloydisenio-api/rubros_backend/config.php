<?php
$host = "sv46.byethost46.org";
$dbname = "iunaorg_doli184";
$username = "iunaorg_b3toh";
$password = "elgeneral2018";

// Crear conexión
$conn = new mysqli($host, $username, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}
?>