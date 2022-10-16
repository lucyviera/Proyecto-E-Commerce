//inicializar array
let productscarrito = [];
let cartURL = CART_INFO_URL + USER_ID + EXT_TYPE;


//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", () => {
    getJSONData(cartURL).then(function (resultObj) {
        // si la variable existe
        if (resultObj.status === "ok") {
            productscarrito = resultObj.data.articles;
            //muestra los productos del carrito
            showProductsCart(productscarrito);
            
        }
    })
});
//funcion para mostrar los productos en el carrito, recibe un array con los datos, y los muestra en pantalla a través del uso del DOM
function showProductsCart(){
    let htmlContentToAppend = "";

    for(let i = 0; i < productscarrito.length; i++){ 
        //toma el valor del producto actual 
        let product = productscarrito[i];
        //cantidad por costo unitario
        let total = product.count*product.unitCost;

        htmlContentToAppend += `
        <tr>
        <td>
            <img src="${product.image}" class="img-cart"></td>
            <td><b>`+ product.name + `</b></td>
            <td>`+ product.currency + " " + product.unitCost + `</td>
            <td> <input onchange="cantidadModificada(productscarrito[${i}], ${i})" type="number" id="cantidad${i}" name"cantidad" min="1" value"${product.count}</td>
            <td id="subtotal${i}">${product.currency} ${total}</td>
        </tr>
        `
    }

    document.getElementById("shoppingcart").innerHTML =  htmlContentToAppend;
}


    //Muestra los totales y envio
     function cantidadModificada(articulo, i) {
        let cantidad = document.getElementById("cantidad" + i).value;
        articulo.count = cantidad;
        let total = articulo.count*articulo.unitCost;
        //por cada articulo se suma 10 UDS de envio
        let envio = 10*cantidad;
        //se escriben los valores sobre los campos usando sus ID
        document.getElementById("subtotal"+ i).innerHTML= articulo.currency +" "+ total;
        document.getElementById("totalcompras").innerHTML = total;
        document.getElementById("envio").innerHTML = envio;
        document.getElementById("total").innerHTML = total+envio;
    }
    
