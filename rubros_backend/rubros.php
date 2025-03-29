<?php
// Incluir configuración de conexión
require_once 'config.php';

// Establecer codificación
$conn->set_charset("utf8");

// Encabezado para respuesta JSON
header('Content-Type: application/json');

// === GET: Listar rubros ===
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, nombre_es AS nombre_es, keyword_google, busqueda FROM ll_rubros ORDER BY nombre";
    $resultado = $conn->query($sql);

    if (!$resultado) {
        http_response_code(500);
        echo json_encode(["error" => "Error en la consulta: " . $conn->error]);
        exit;
    }

    $rubros = [];
    while ($fila = $resultado->fetch_assoc()) {
        $rubros[] = $fila;
    }

    echo json_encode($rubros);
    exit;
}

// === POST: Actualizar rubro ===
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['id'])) {
    $id = intval($_GET['id']);
    $json = file_get_contents("php://input");
    $datos = json_decode($json, true);

    if (!$datos) {
        http_response_code(400);
        echo json_encode(["error" => "JSON inválido."]);
        exit;
    }

    $nombre_es = $conn->real_escape_string($datos['nombre_es']);
    $keyword_google = $conn->real_escape_string($datos['keyword_google']);
    $busqueda = intval($datos['busqueda']);

    $sql = "UPDATE ll_rubros 
            SET nombre = '$nombre_es', 
                keyword_google = '$keyword_google', 
                busqueda = $busqueda 
            WHERE id = $id";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["mensaje" => "Rubro actualizado correctamente."]);
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
