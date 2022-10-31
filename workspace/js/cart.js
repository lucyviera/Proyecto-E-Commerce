//inicializar array
let productscarrito = [];
let cartURL = CART_INFO_URL + USER_ID + EXT_TYPE;
let eliminararticulo = document.getElementsByName('borrar');
let MONEY_SYMBOL = "USD";
let porcentaje = 0;


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
            for (let i = 0; i < eliminararticulo.length; i++) {
                eliminararticulo[i].addEventListener('click', () => {
                    eliminar(i);
                })

            }

        }
    })
});

function eliminar(posicion) {
    productscarrito.splice(posicion, 1);
    //¡¡¡falta que elimine tambien lo del resumen de compra!!!!//
    showProductsCart();

}
document.getElementById("premium").addEventListener("change", function () {
    porcentaje = 0.15;
    showProductsCart(porcentaje);
});

document.getElementById("express").addEventListener("change", function () {
    porcentaje = 0.07;
    showProductsCart(porcentaje);
});

document.getElementById("standard").addEventListener("change", function () {
    porcentaje = 0.05;
    showProductsCart(porcentaje);
});
//funcion para mostrar los productos en el carrito, recibe un array con los datos, y los muestra en pantalla a través del uso del DOM
function showProductsCart(porcentaje) {
    let htmlContentToAppend = "";

    for (let i = 0; i < productscarrito.length; i++) {
        //toma el valor del producto actual 
        let product = productscarrito[i];
        //cantidad por costo unitario
        let total = product.count * product.unitCost;

        htmlContentToAppend += `
        <tr>
        <td>
            <img src="${product.image}" class="img-cart"></td>
            <td><b>` + product.name + `</b></td>
            <td>` + product.currency + " " + product.unitCost + `</td>
            <td> <input onchange="cantidadModificada(productscarrito[${i}],porcentaje, ${i})" type="number" id="cantidad${i}" name"cantidad" value=1 min="0"</td>
            <td id="subtotal${i}">${product.currency} ${total}</td>
            <td> <button class="btn btn-light fa fa-trash" name="borrar" width=30></button></td>
        </tr>
        `
    }

    document.getElementById("shoppingcart").innerHTML = htmlContentToAppend;
}


//Muestra los totales y envio
function cantidadModificada(articulo, porcentaje, i) {
    let cantidad = document.getElementById("cantidad" + i).value;
    articulo.count = cantidad;
    let total = articulo.count * articulo.unitCost;
    let totalenvio = porcentaje * total;
    let envio = ""
    if (porcentaje == 0.15) {
        envio = "Premium(15%)"
    } else if (porcentaje == 0.07) {
        envio = "Express(7%)"
    } else {
        envio = "Estandar(5%)"
    }
    //se escriben los valores sobre los campos usando sus ID
    document.getElementById("subtotal" + i).innerHTML = articulo.currency + " " + total;
    document.getElementById("totalcompras").innerHTML = total;
    document.getElementById("envio").innerHTML = envio;
    document.getElementById("total").innerHTML = MONEY_SYMBOL + " " + parseFloat(total + totalenvio);
}


document.getElementById('finalizarcompra').addEventListener('click', (event)=>{
    if (!validacion() || !this.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
    }
      document.body.classList.add('was-validated');
  
      let form = ['change', 'input'];
      
      form.forEach (event=> {document.body.addEventListener(event, validacion)})
      validarpagos()


function validacion(){

    //variable de tipo bool que tendrá valor true, y se convertira en false cuando la condicion no se cumpla
    let todocorrecto =true;

    //El primer campo a comprobar es calle. Lo traemos con su id y verificamos la condicion. En este caso, le decimos que tiene que ingresar una calle para que sea valido, Si el campo esta vacio, la variable todocorrecto devolvera false. 
    if(document.getElementById('calle').value === "text" ){
        todocorrecto = false;
    }
    //Hacemos lo mismo con el campo esquina.
    if(document.getElementById('esquina').value === "text" ){
    todocorrecto = false;
    }
    //Para comprobar el numero, utilizaremos la función isNaN(), que nos dirá si el valor ingresado NO es un número (NaN son las siglas de Not a Number). Si el numero de puerta no es un número, todocorrecto será false
    if(isNaN(document.getElementById('numero').value)){
    todocorrecto = false;
    }
    //Validaremos también los checkbox de envío. Todos los checkbox tienen una propiedad llamada required. Entonces hacemos el if y decimos que si nuestro checkbox NO está required, estará mal//
    if(!document.getElementById('premium').checked){
    todocorrecto = false;
    }
    if(!document.getElementById('express').checked){
    todocorrecto = false;
    }
    if(!document.getElementById('standard').checked){
    todocorrecto = false;
    } 

    if(document.getElementById('selectPayments').value === ""){
        todocorrecto = false;
        } 
    return todocorrecto;
    
    
    }
});
//esto es para cambiar el valor del span al selector de metodo de pago
document.getElementById('confirmarmetododepago').addEventListener('click', ()=>{
    seleccionarmetododepago();
   
  })
    document.getElementById("card").addEventListener("change", function() {seleccionarmetododepago("tarjeta")});
    document.getElementById("bank").addEventListener("change", function() {seleccionarmetododepago("transferencia")});


    //Funcion que busca que los campos esten validos, si estan vacios o no
    function validarpagos(){
    
        let tarjeta= document.getElementById("card"); 
        let transferencia = document.getElementById("bank"); 
    
         if(tarjeta.checked) {
            let numerotarjeta = document.getElementById("numtarjeta"); 
            let codigoseguridad = document.getElementById("codigoseg"); 
            let vencimientomes = document.getElementById("vtocardmes");
            let vencimientoanio = document.getElementById("vtocardanio");
            
            if(numerotarjeta.value === "" || codigoseguridad.value === "" || vencimientoanio.value === "" || vencimientomes.value === ""){
                document.getElementById("mediodepagodevalidacion").innerHTML;
            }
    
         } else if (transferencia.checked) {
            let transferencia = document.getElementById("cuentatransferencia"); 
            
            if(transferencia.value == ""){
                document.getElementById("mediodepagodevalidacion").innerHTML;
                
            }
         } else {
            document.getElementById("mediodepagodevalidacion").innerHTML
            
         }
    
      }

      //funcion para selecionar metodo de pago y tome id de la seleccion y habilite o deshabilite los inputs
      function seleccionarmetododepago(metododepago) {

        let span = document.getElementById("seleccion");
        
        if(metododepago == "tarjeta"){
            document.getElementById("cuentatransferencia").disabled = true;
            document.getElementById("numtarjeta").disabled = false;
            document.getElementById("codigoseg").disabled = false;
            document.getElementById("vtocardmes").disabled = false;
            document.getElementById("vtocardanio").disabled = false;
            span.innerHTML = "Tarjeta de débito/crédito";
    
        } else if(metododepago == "transferencia"){
            document.getElementById("numtarjeta").disabled = true;
            document.getElementById("codigoseg").disabled = true;
            document.getElementById("vtocardmes").disabled = true;
            document.getElementById("vtocardanio").disabled = true;
            document.getElementById("cuentatransferencia").disabled = false;
            span.innerHTML = "Transferencia bancaria";
        }
    }

  
