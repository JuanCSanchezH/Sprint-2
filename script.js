import {listProducts, createProduct, updateProduct, deleteProduct} from './services/api.js';

let arrProductos = [];
const formulario = document.querySelector("form");
const updateProd = document.querySelector("#updateProduct")
let editButton = null;
let pCount = null;
let idSelectedProduct = null;
let cart = [];
let total = null;
let img = null;

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

    if(event.target.classList.contains("counter-buttons")){
        console.log('Hola')
        idSelectedProduct = event.target.attributes['data-id'].value;
        const operacion = event.target.attributes["value"].nodeValue;
        const product = arrProductos.find(item => item.ID == idSelectedProduct);
        pCount.forEach(item =>{
            item.textContent = '';
            if(idSelectedProduct==item.attributes['data-id'].value){
                if(operacion == "+"){
                    console.log(product.contador);
                    product.contador += 1;
                }else if(operacion == "-" && product.contador>1){
                    console.log(product.contador);
                    product.contador -= 1;
                }
                item.textContent = product.contador;
            }
        })
    }

    if(event.target.classList.contains("addToCart")){
        $("[data-bs-toggle='popover']").popover('show');
        let html = document.getElementById("contenido");
        html.innerHTML = ``;
        idSelectedProduct = event.target.attributes['data-id'].value;
        const product = arrProductos.find(item => item.ID == idSelectedProduct)
        swal({
            title: product.nombre,
            type: "success",
            text: "This product has been added to your cart.",
            showConfirmButton: false,
            timer: 2500
        });
        if(cart.includes(product)){
            product.unidades += product.contador;
        }else{
            product.unidades = product.contador; 
            cart.push(product);
        }
        total = 0;
        cart.forEach(item => {
            total += item.precio*item.unidades;
            html.innerHTML += `
            <div class="row mb-2">
                <div class="col-5">
                    <img src=${item.imagenPrincipal[0]} alt="">
                </div>
                <div class="col-7">
                    <h6><b>${item.nombre}</b></h6>
                    <div class="row">
                        <p class="col-6" id="price-popover">$${item.precio}</p>
                        <p class="col-6" id="discount-popover">${item.descuento}% off</p>
                    </div>
                    <p id="units-popover">Units: ${item.unidades}</p>
                </div>
            </div>
            `
        });
        html.innerHTML += `
            <div class="row mb-2">
                <p class="col-12" id="price-popover">Total: $${total}</p>
            </div>
            <!-- Button trigger modal -->
            <button id="button-buy-now" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Buy now
            </button>
        `
        const btnBuy = document.getElementById("button-buy-now");    
        btnBuy.onclick = function(){
            $('#exampleModal2').modal('hide');
            $('body').removeClass('modal-open');
            $('.modal-backdrop').remove();
        }
        if(cart.length > 0){
            const p = document.getElementById("p-cart");
            p.textContent = cart.length;
        }
    }

    if(event.target.classList.contains("mainImage")){
        $('#exampleModal').modal('hide');
        $('body').removeClass('modal-open');
        $('.modal-backdrop').remove();
    }
})

const printProductos = async() => {
    arrProductos = await listProducts();
    let html = ``;
    arrProductos.forEach(item => {
        const originalPrice = (item.precio/(1-(item.descuento/100))).toFixed(2);
        const li = `
        <section class="py-5 col-md-6">
            <div class="container">
                <a class="mainImage" href="#" data-bs-toggle="modal" data-bs-target="#exampleModal2"><img class="mainImage" id="myImg" src=${item.imagenPrincipal[0]} alt="Imagen principal"></a>
                <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <div id="carouselExampleFade" class="carousel slide carousel-fade">
                                <div class="carousel-inner">
                                <div class="carousel-item active">
                                    <img src=${item.imagenPrincipal[0]} class="d-block w-100" alt="...">
                                </div>
                                <div class="carousel-item">
                                    <img src=${item.imagenPrincipal[1]} class="d-block w-100" alt="...">
                                </div>
                                <div class="carousel-item">
                                    <img src=${item.imagenPrincipal[2]} class="d-block w-100" alt="...">
                                </div>
                                </div>
                                <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleFade" data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                                </button>
                            </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="Thumbnails">
                    <a href="#"><img src=${item.Thumbnails[0]} alt="Miniatura1" onclick="changeImage('images/product-1-thumbnail.jpg')"></a>
                    <a href="#"><img src=${item.Thumbnails[1]} alt="Miniatura2" onclick="changeImage('images/product-2-thumbnail.jpg')"></a>
                    <a href="#"><img src=${item.Thumbnails[2]} alt="Miniatura3" onclick="changeImage('images/producto-3-thumbnail.jpg')"></a>
                    <a href="#"><img src=${item.Thumbnails[3]} alt="Miniatura4" onclick="changeImage('images/producto-4-thumbnail.jpg')"></a>
                </div>
                <!--<div id="myModal" class="modal">
                    <span class="close">&times;</span>
                    <img class="modal-content" id="img01">
                </div> -->
            </div>
        </section>
        <article class="col-md-6"> 
            <div class="Product-details">
                <h6>SNEAKER COMPANY</h6>
                <h1>${item.nombre}</h1>
                <p>${item.descripcion}</p>
                <div class="Price">
                    <p>$${item.precio}</p>
                    <div id="cont50">
                        <p>${item.descuento}%</p>
                    </div>
                </div>
                <s id="descuento">$${originalPrice}</s>
            </div>
            <div class="add-article">
                <div class="counter">
                    <button class="counter-buttons" value="-" data-id="${item.ID}">-</button>
                    <p class="p-count" data-id="${item.ID}">${item.contador}</p>
                    <button class="counter-buttons" value="+" data-id="${item.ID}">+</button>
                </div>
                <button type="button" id="Add-to-cart" class="addToCart" data-id="${item.ID}">
                    <img src="images/shopping-cart.jpg" alt="">
                    Add to cart
                </button>
            </div>
        </article>`
        html += li
    });
    const ul = document.getElementById('listaProductos');
    ul.innerHTML = html;
    editButton = document.querySelector(".editProduct");
    pCount = document.querySelectorAll(".p-count")
    pCount.value = 0;
    //img = document.getElementById("myImg");    
    // Get the modal
    // let modal = document.getElementById("myModal");

    // // Get the image and insert it inside the modal - use its "alt" text as a caption
    // var img = document.getElementById("myImg");
    // var modalImg = document.getElementById("img01");
    //     img.onclick = function(){
    //     modal.style.display = "block";
    //     modalImg.src = this.src;
    // }

    // // Get the <span> element that closes the modal
    // var span = document.getElementsByClassName("close")[0];

    // // When the user clicks on <span> (x), close the modal
    // span.onclick = function() { 
    // modal.style.display = "none";
    // }
    
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
