document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("gameForm");
    const gamesTable = document.getElementById("gamesTable").getElementsByTagName('tbody')[0];

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const gameData = {
            name: document.getElementById("gameName").value,
            description: document.getElementById("gameDescription").value,
            price: document.getElementById("gamePrice").value,
            stock: document.getElementById("gameStock").value
        };

        fetch("crud.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(gameData)
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                loadGames();
                form.reset();
            } else {
                alert("Error al agregar el juego.");
            }
        })
        .catch(error => console.error("Error:", error));
    });

    function loadGames() {
        fetch("crud.php")
            .then(response => response.json())
            .then(data => {
                gamesTable.innerHTML = '';
                data.forEach(game => {
                    const row = gamesTable.insertRow();
                    row.innerHTML = `
                        <td>${game.nombre}</td>
                        <td>${game.descripcion}</td>
                        <td>${game.precio}</td>
                        <td>${game.stock}</td>
                        <td>
                            <button class="edit-btn" data-id="${game.id_juego}">Editar</button>
                            <button class="delete-btn" data-id="${game.id_juego}">Eliminar</button>
                        </td>
                    `;
                });
            })
            .catch(error => console.error("Error:", error));
    }

    loadGames();

    gamesTable.addEventListener("click", function(event) {
        if (event.target.classList.contains("delete-btn")) {
            const gameId = event.target.getAttribute("data-id");
            if (confirm("¿Estás seguro de eliminar este juego?")) {
                fetch(`crud.php?id_juego=${gameId}`, { method: "DELETE" })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            loadGames();
                        } else {
                            alert("Error al eliminar el juego.");
                        }
                    })
                    .catch(error => console.error("Error:", error));
            }
        }
    });
});
