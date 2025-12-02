let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* Atualiza contador */
function updateCartCount() {
    let totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById("cart-count").textContent = totalQty;
}

/* Salva */
function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

/* Renderiza carrinho */
function renderCart() {
    const container = document.getElementById("cart-items");
    container.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.qty;

        container.innerHTML += `
            <div class="cart-item">
                <img src="${item.image}">
                
                <div class="cart-item-info">
                    <strong>${item.name}</strong><br>
                    R$ ${(item.price * item.qty).toFixed(2)}
                </div>

                <div class="cart-item-controls">
                    <button onclick="changeQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty(${index}, 1)">+</button>
                    <button class="remove" onclick="removeItem(${index})">X</button>
                </div>
            </div>
        `;
    });

    document.getElementById("cart-total").textContent =
        "Total: R$ " + total.toFixed(2);

    updateCartCount();
}

/* Alterar quantidade */
function changeQty(index, amount) {
    cart[index].qty += amount;

    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    renderCart();
}

/* Remover item */
function removeItem(index) {
    cart.splice(index, 1);
    saveCart();
    renderCart();
}

/* Adicionar */
function addToCart(name, price, image) {
    const existing = cart.find(item => item.name === name);

    if (existing) {
        existing.qty++;
    } else {
        cart.push({
            name,
            price,
            image,
            qty: 1
        });
    }

    saveCart();
    renderCart();
}

/* Abrir / Fechar dropdown */
document.getElementById("cart-icon").onclick = (e) => {
    e.stopPropagation();
    document.getElementById("cart-dropdown").classList.toggle("open");
};

/* Fechar ao clicar fora */
document.addEventListener("click", function (e) {
    const dropdown = document.getElementById("cart-dropdown");
    const icon = document.getElementById("cart-icon");

    if (!dropdown.contains(e.target) && !icon.contains(e.target)) {
        dropdown.classList.remove("open");
    }
});

/* Conectar botões dos produtos */
document.querySelectorAll(".produto-card").forEach(card => {
    card.querySelector("button").onclick = () => {
        const name = card.querySelector("h3").innerText;

        const price = parseFloat(
            card.querySelector(".preco").innerText.replace("R$", "").replace(",", ".")
        );

        const image = card.querySelector("img").src;

        addToCart(name, price, image);
    };
});

/* Inicializar carrinho ao carregar */
renderCart();