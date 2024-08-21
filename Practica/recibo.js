document.addEventListener("DOMContentLoaded", function() {
    function loadReceipt() {
        fetch("recibo.php")
            .then(response => response.json())
            .then(data => {
                const receiptDiv = document.getElementById("receipt");
                let receiptHTML = `
                    <p>Total en Bolivianos: ${data.total} Bs.</p>
                    <p>Total en Dólares: ${(data.total / 7).toFixed(2)} $</p>
                    <h3>Detalles:</h3>
                    <ul>
                `;
                data.items.forEach(item => {
                    receiptHTML += `<li>${item.name} - ${item.quantity} unidades - ${item.total.toFixed(2)} Bs.</li>`;
                });
                receiptHTML += `</ul>`;
                receiptDiv.innerHTML = receiptHTML;
            })
            .catch(error => console.error("Error:", error));
    }

    loadReceipt();
});
