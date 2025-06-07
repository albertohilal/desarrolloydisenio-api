<?php
require_once 'config.php';
header('Content-Type: application/json');
$conn->set_charset("utf8");

// === GET: listar zonas ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, nombre, latitud, longitud, busqueda, activo FROM ll_zonas ORDER BY nombre";
    $res = $conn->query($sql);

    if (!$res) {
        http_response_code(500);
        echo json_encode(["error" => "Error en la consulta: " . $conn->error]);
        exit;
    }

    $zonas = [];
    while ($row = $res->fetch_assoc()) {
        $zonas[] = $row;
    }

    echo json_encode($zonas);
    exit;
}

// === POST: actualizar zona ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $json = file_get_contents("php://input");
    $datos = json_decode($json, true);

    if (!$datos) {
        http_response_code(400);
        echo json_encode(["error" => "JSON inválido."]);
        exit;
    }

    $nombre = $conn->real_escape_string($datos['nombre']);
    $lat = floatval($datos['latitud']);
    $lng = floatval($datos['longitud']);
    $busqueda = intval($datos['busqueda']);
    $activo = intval($datos['activo']);

    $sql = "UPDATE ll_zonas 
            SET nombre = '$nombre',
                latitud = $lat,
                longitud = $lng,
                busqueda = $busqueda,
                activo = $activo
            WHERE id = $id";

    if ($conn->query($sql)) {
        echo json_encode(["mensaje" => "Zona actualizada correctamente."]);
    } else {
        http_response_code(500);
        echo json_encode(["error" => "Error al actualizar: " . $conn->error]);
    }

    exit;
}

// Método no permitido
http_response_code(405);
echo json_encode(["error" => "Método no permitido."]);
?>
