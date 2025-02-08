document.addEventListener("DOMContentLoaded", () => {
    const loginBtn = document.getElementById("login-btn");
    const loginContainer = document.getElementById("login-container");
    const storeContainer = document.getElementById("store-container");
    const clearCartBtn = document.getElementById("clear-cart");
    const cartList = document.getElementById("cart-list");  

    if (sessionStorage.getItem("isLoggedIn")) {
        loginContainer.classList.add("hidden");
        storeContainer.classList.remove("hidden");
        loadProducts();
        updateCart();
    } else {
        loginContainer.classList.remove("hidden");
        storeContainer.classList.add("hidden");
    }

    loginBtn.addEventListener("click", () => {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email && password) {
            localStorage.setItem("user", email); 
            sessionStorage.setItem("isLoggedIn", "true"); 
            loginContainer.classList.add("hidden");
            storeContainer.classList.remove("hidden");
            loadProducts();
            updateCart();
        } else {
            alert("Please enter email and password.");
        }
    });

    function loadProducts() {
        fetch("https://fakestoreapi.com/products")
            .then(response => response.json())
            .then(data => {
                const productContainer = document.getElementById("products-container");
                productContainer.innerHTML = "";
                data.forEach(product => {
                    const productCard = document.createElement("div");
                    productCard.classList.add("product");
                    productCard.innerHTML = `
                        <img src="${product.image}" alt="${product.title}">
                        <h4>${product.title.substring(0, 20)}...</h4>
                        <p>$${product.price}</p>
                        <button class="btn btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
                    `;
                    productContainer.appendChild(productCard);
                });

                document.querySelectorAll(".add-to-cart").forEach(button => {
                    button.addEventListener("click", (event) => {
                        const productId = event.target.getAttribute("data-id");
                        addToCart(productId);
                    });
                });
            })
            .catch(error => console.error("Error loading products:", error));
    }

    function addToCart(productId) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(productId);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCart();
    }

    function updateCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cartList.innerHTML = ""; 

        if (cart.length === 0) {
            cartList.innerHTML = "<li>Your cart is empty.</li>";
            return;
        }

        cart.forEach(id => {
            const li = document.createElement("li");
            li.textContent = `Product ID: ${id}`;
            cartList.appendChild(li);
        });
    }

    clearCartBtn.addEventListener("click", () => {
        localStorage.removeItem("cart");
        updateCart();
    });

    document.getElementById("search-bar").addEventListener("input", event => {
        const searchValue = event.target.value.toLowerCase();
        document.querySelectorAll(".product").forEach(product => {
            product.style.display = product.innerText.toLowerCase().includes(searchValue) ? "block" : "none";
        });
    });
});


