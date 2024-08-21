document.addEventListener("DOMContentLoaded", function() {
    const gamesTable = document.getElementById("gamesTable").getElementsByTagName('tbody')[0];
    const generateReceiptBtn = document.getElementById("generateReceiptBtn");

    function loadGames() {
        fetch("compra.php")
            .then(response => response.json())
            .then(data => {
                gamesTable.innerHTML = '';
                data.forEach(game => {
                    const row = gamesTable.insertRow();
                    row.innerHTML = `
                        <td>${game.nombre}</td>
                        <td>${game.precio}</td>
                        <td>${game.stock}</td>
                        <td><input type="number" class="quantity" min="1" max="${game.stock}" data-id="${game.id_juego}" value="1"></td>
                        <td><button class="add-to-cart" data-id="${game.id_juego}">Agregar al Carrito</button></td>
                    `;
                });
            })
            .catch(error => console.error("Error:", error));
    }

    let cart = [];

    gamesTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("add-to-cart")) {
            const gameId = event.target.getAttribute("data-id");
            const quantityInput = gamesTable.querySelector(`input[data-id="${gameId}"]`);
            const quantity = parseInt(quantityInput.value);
            
            if (quantity > 0) {
                const game = cart.find(g => g.id_juego === gameId);
                if (game) {
                    game.cantidad += quantity;
                } else {
                    cart.push({ id_juego: gameId, cantidad: quantity });
                }
            } else {
                alert("Cantidad inválida.");
            }
        }
    });

    generateReceiptBtn.addEventListener("click", function() {
        if (cart.length > 0) {
            fetch("recibo.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cart)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = "recibo.html";
                } else {
                    alert("Error al generar el recibo.");
                }
            })
            .catch(error => console.error("Error:", error));
        } else {
            alert("El carrito está vacío.");
        }
    });

    loadGames();
});
