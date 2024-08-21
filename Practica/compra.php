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
    $cart = json_decode(file_get_contents("php://input"), true);
    $total = 0;

    foreach ($cart as $item) {
        $sql = "SELECT * FROM juegos WHERE id_juego = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("i", $item['id_juego']);
        $stmt->execute();
        $result = $stmt->get_result();
        $game = $result->fetch_assoc();

        if ($game) {
            $total += $game['precio'] * $item['cantidad'];

            $newStock = $game['stock'] - $item['cantidad'];
            $sqlUpdate = "UPDATE juegos SET stock = ? W
