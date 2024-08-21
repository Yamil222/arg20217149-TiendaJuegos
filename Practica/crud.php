<?php
$servername = "localhost";
$username = "root";
$password = "";
$database = "juegos_fisicos";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM juegos";
    $result = $conn->query($sql);
    $juegos = [];

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $juegos[] = $row;
        }
    }
    echo json_encode($juegos);

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $sql = "INSERT INTO juegos (nombre_juego, descripcion, precio, stock) VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssdi", $data['name'], $data['description'], $data['price'], $data['stock']);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }

    $stmt->close();

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id_juego = $_GET['id_juego'];
    $sql = "DELETE FROM juegos WHERE id_juego = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id_juego);

    if ($stmt->execute()) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }

    $stmt->close();
}

$conn->close();
?>
