// function addItemToCart(image-product-1) {
//     // Add the product to the cart.
//     cart.addProduct(image-pro);
//     // Update the cart total.
//     cartTotal = cart.getTotalPrice();
//     // Update the number of items in the cart.
//     numberOfItems = cart.getNumberOfItems();
//     // Update the UI.
//     updateCartUI();
//   }
//   function removeItemFromCart(productId) {
//     // Remove the product from the cart.
//     cart.removeProduct(productId);
//     // Update the cart total.
//     cartTotal = cart.getTotalPrice();
//     // Update the number of items in the cart.
//     numberOfItems = cart.getNumberOfItems();
//     // Update the UI.
//     updateCartUI();
//   }
//   function updateCartUI() {
//     // Update the number of items in the cart.
//     document.getElementById("numberOfItems").innerHTML = numberOfItems;
//     // Update the cart total.
//     document.getElementById("cartTotal").innerHTML = cartTotal;
//   }

// var mainImage = document.querySelector("#image-product-1");
// var thumbnails = document.querySelectorAll(".Thumbnails img");
// for (var i = 0; i < thumbnails.length; i++) {
//   thumbnails[i].addEventListener("click", function(event) {
//     mainImage.src = this.src;
//   });
// }

// document.addEventListener("add-to-cart", function(event) {
//     // Get the product ID from the event.
//     var productId = event.detail.productId;
//     // Add the product to the cart.
//     cart.addProduct(productId);
//   });

import {listProducts, createProduct, updateProduct, deleteProduct} from './services/api.js';

let arrProductos = [];
const formulario = document.querySelector("form");
const updateProd = document.querySelector("#updateProduct")
let editButton = null;
let idSelectedProduct = null;

// updateProd.addEventListener('click', async()=>{
//     const formdata = new FormData(formulario);

//     const jsonData = {};

//     for (let [key, value] of formdata.entries()) {
//         jsonData[key] = value;
//     }
//     jsonData['id'] = idSelectedProduct
//     await updateProduct(jsonData)
// })

document.addEventListener('click', (event) =>  {
    if(event.target.classList.contains('editProduct')) {
        idSelectedProduct = event.target.attributes['data-id'].value;
        const product = arrProductos.find(item => item.id == idSelectedProduct)
        
        document.getElementById("nombre").value = product.nombre;
        document.getElementById("precio").value = product.precio;
        document.getElementById("cantidad").value = product.cantidad;
        document.getElementById("categoria").value = product.categoria;
    }

    if(event.target.classList.contains('deleteProduct')) {
        idSelectedProduct = event.target.attributes['data-id'].value;
        deleteProduct(idSelectedProduct)
    }
})


const printProductos = async() => {
    arrProductos = await listProducts();
    let html = ``;
    console.log(arrProductos);
    arrProductos.forEach(item => {
        const li = `
        <section class="py-5 col-md-6">
            <div class="container">
                <img class="mainImage" id="image-product-1" src="${item.imagenPrincipal}" alt="Imagen principal">
                <div class="Thumbnails">
                    <a href="#"><img src="${item.Thumbnails[1]}" alt="Miniatura1" onclick="changeImage('images/product-1-thumbnail.jpg')"></a>
                    <a href="#"><img src="images/image-product-2-thumbnail.jpg" alt="Miniatura2" onclick="changeImage('images/product-2-thumbnail.jpg')"></a>
                    <a href="#"><img src="images/image-product-3-thumbnail.jpg" alt="Miniatura3" onclick="changeImage('images/producto-3-thumbnail.jpg')"></a>
                    <a href="#"><img src="images/image-product-4-thumbnail.jpg" alt="Miniatura4" onclick="changeImage('images/producto-4-thumbnail.jpg')"></a>
                </div>
            </div>
        </section>
        <article class="col-md-6"> 
            <div class="Product-details">
                <h6>SNEAKER COMPANY</h6>
                <h1>Fall Limited Edition Sneakers</h1>
                <p>These low-profile sneakers are you perfect profile wear companion. Featuring a durable rubber outer sole, they'll withstand everything the weather can offer.</p>
                <div class="Price">
                    <p>$125.00</p>
                    <div id="cont50">
                        <p>50%</p>
                    </div>
                </div>
                <s id="descuento">$250.00</s>
            </div>
            <div class="add-article">
                <div class="counter">
                    <button class="counter-buttons">-</button>
                    <p>1</p>
                    <button class="counter-buttons">+</button>
                </div>
                <button id="Add-to-cart">
                <img src="images/shopping-cart.jpg" alt="">
                Add to cart
                </button>
            </div>
        </article>`
        html += li
    });
    const ul = document.getElementById('listaProductos')
    ul.innerHTML = html;
    editButton = document.querySelector(".editProduct");

}



formulario.addEventListener('submit', async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const formdata = new FormData(formulario);

    const jsonData = {};

    for (let [key, value] of formdata.entries()) {
        jsonData[key] = value;
    }

    await createProduct(jsonData);
    printProductos();
});

printProductos();