//inicializar array 
let ProductsInfoData = [];
let ProductsComments = [];
let related =[];

//funcion que recibe un array con los datos, y los muestra en pantalla a través el uso del DOM
function showInfoProductsList(ProductsInfoData) {

    let htmlContentToAppend = "";

    htmlContentToAppend += ` 

            <div><br>
                 <h2> ${ProductsInfoData.name} </h2> <hr>
                 <p><b>Precio</b></p>
                 <p small>${ProductsInfoData.currency}${ProductsInfoData.cost}</p>
                 <p><b>Descripción</b></p>
                 <p small>${ProductsInfoData.description}</p>
                 <p><b>Categoria</b></p>
                 <p small>${ProductsInfoData.category}</p>
                 <p><b>Cantidad de vendidos</b></p>
                 <p small> ${ProductsInfoData.soldCount} </p>
                 <p><b>Imagenes ilustrativas</b></p>
                 <div class="row"> 
                 ` + cargarImagenes(ProductsInfoData.images) + `
                 </div>
            </div>`

    document.getElementById("Prod-info-list").innerHTML = htmlContentToAppend;

}

//funcion para cargar todas las imagenes en conjunto
function cargarImagenes(lista) {
    let imagenes = ""
    for (let foto of lista) {
        imagenes += `
                
                
                <div class="card">
                        <img src= ` + foto + ` class="img-thumbnail">
                </div>`

    }
    return imagenes;
}

//funcion para mostrar imagenes relacionadas, imagen + nombre del producto 
function showProductsRelated(productorelacionado) {
    let htmlrelated = "";
  
    for (let i = 0; i < relatedProducts.length; i++) {
      let productorelacionado = relatedProducts[i];
  
      htmlrelated += `
            
      <div onclick="setProdID(${productorelacionado.id})" class="cards col-3 cursor-active card">
                <div class="card">
                 <img src="${productorelacionado.image}" class="card-img-top">
                </div>
             <p class="related-text">${productorelacionado.name}</p>
             </div>
             </div>`
  
      document.getElementById("Prod-relacionado").innerHTML = htmlrelated;
    }
  }

  function setProdID(id) {
    localStorage.setItem("ProdID", id);
    window.location = "product-info.html"
}
//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", () => {
    //Lee localStorage y guarda la variable ProdID 
    let productId = localStorage.getItem("ProdID");
    //Uso la base de la url y le agrego la variable
    getJSONData(PRODUCT_INFO_URL + productId + EXT_TYPE).then(function (resultObj) {
        // si la variable existe
        if (resultObj.status === "ok") {
            ProductsInfoData = resultObj.data;
            showInfoProductsList(ProductsInfoData);
            relatedProducts = resultObj.data.relatedProducts;

            showProductsRelated(related);
        }

        //funcion para mostrar los comentarios, recibe un array con los datos, y los muestra en pantalla a través el uso del DOM
        function showCommentsProductsList() {


            let htmlContentToAppend = "";

            for (let i = 0; i < ProductsComments.length; i++) {


                htmlContentToAppend += `
        
                <li class="list-group-item"><b>
                    <span class="fa fa-user"> ${ProductsComments[i].user}</span></b>&nbsp;
                    <span class="fa fa-calendar"> ${ProductsComments[i].dateTime}</span>
                    <span class= "fa fa-heart ${ProductsComments[i].score >= 1 ? "checked" : ""}"></span>
                    <span class= "fa fa-heart ${ProductsComments[i].score >= 2 ? "checked" : ""}"></span>
                    <span class= "fa fa-heart ${ProductsComments[i].score >= 3 ? "checked" : ""}"></span>
                    <span class= "fa fa-heart ${ProductsComments[i].score >= 4 ? "checked" : ""}"></span>
                    <span class= "fa fa-heart ${ProductsComments[i].score >= 5 ? "checked" : ""}"></span>
                    <br>
                    <span> ${ProductsComments[i].description}</span>
                </li>`
            }
            document.getElementById("Prod-comments-list").innerHTML = htmlContentToAppend;

        }

        //variable nueva de lista para traer lista de comentarios guardada en localStorage
        let lista = localStorage.getItem("listaComentarios" + productId);
        // Si la lista no esta definida, llama al servicio de comentarios y la crea
        if (lista == undefined) {
            //Uso la base de la url y le agrego la variable
            let productCommentInfo = PRODUCT_INFO_COMMENTS_URL + productId + EXT_TYPE;
            //si la variable existe y el status es ok, muestra el listado de comentarios
            getJSONData(productCommentInfo).then(function (resultObj) {
                if (resultObj.status === "ok") {
                    ProductsComments = resultObj.data;
                    showCommentsProductsList();
                }
            })
        }


        //Evento click a un elemento html
        document.getElementById('comentar').addEventListener('click', () => {
            agregarcomentarios();
        })

        //Funcion de puntuacion
        function puntuacion(puntos) {

            let corazones = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= puntos) {

                    corazones += '<i class="fa fa-heart checked" ></i>'; //icono corazon llena
                } else {

                    corazones += '<i class="fa fa-heart-o"></i>'; //icono contorno corazon
                }
                return corazones;
            }
        }
        document.getElementById('calif').addEventListener('change', function () {
            puntuacion(document.getElementById('puntaje').value, "calif");
            showCommentsProductsList();
        });

        //funcion agregar comentarios 
        function agregarcomentarios() {
            let dateTime = new Date();
            let year = dateTime.getFullYear();
            let month = dateTime.getMonth() + 1;
            let day = dateTime.getDate();
            let hour = dateTime.getHours();
            let minute = dateTime.getMinutes();
            let second = dateTime.getSeconds();

            if (month < 10) {
                month = '0' + month;
            }
            if (day < 10) {
                day = '0' + day;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            if (minute < 10) {
                minute = '0' + minute;
            }
            if (second < 10) {
                second = '0' + second;
            }
            //variable para nuevos comentarios, tomo los id del div html para que le de valor y que al pushearlo lo muestre en la lista de comentarios ya creada
            let nuevoscomentarios = {};

            nuevoscomentarios.user = document.getElementById('nombre').value;
            nuevoscomentarios.description = document.getElementById('comments').value;
            nuevoscomentarios.dateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
            nuevoscomentarios.score = document.getElementById('puntaje').value;

            ProductsComments.push(nuevoscomentarios);
            showCommentsProductsList();

            document.getElementById('nombre').value = "";
            document.getElementById('comments').value = "";
            document.getElementById('puntaje').value = "";
        }
    })
});