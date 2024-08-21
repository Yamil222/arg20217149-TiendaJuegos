<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "juegos_fisicos";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

// Obtener la última compra realizada
$sql = "SELECT id_compra, total FROM compras ORDER BY id_compra DESC LIMIT 1";
$result = $conn->query($sql);
$purchase = $result->fetch_assoc();

// Obtener los detalles de los juegos comprados
$sql = "SELECT j.nombre_juego, j.precio, (c.quantity * j.precio) AS total, c.quantity 
        FROM juegos AS j 
        JOIN compra_juegos AS c ON j.id_juego = c.id_juego 
        WHERE c.id_compra = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $purchase['id_compra']);
$stmt->execute();
$result = $stmt->get_result();

$items = [];
while ($row = $result->fetch_assoc()) {
    $items[] = [
        "name" => $row['nombre_juego'],
        "quantity" => $row['quantity'],
        "total" => $row['total']
    ];
}

// Preparar el recibo en formato JSON
$receipt = [
    "total" => $purchase['total'],
    "items" => $items
];

echo json_encode($receipt);

$stmt->close();
$conn->close();
?>
