
//función que recibe un array con los datos, y los muestra en pantalla a través el uso del DOM
function showProductsList(){
    let htmlContentToAppend = "";

    for(let i = 0; i < currentProductsArray.length; i++){ 
        let product = currentProductsArray[i];
        if (((minCost == undefined) || (minCost != undefined && parseInt(product.cost) >= minCost)) &&
        ((maxCost == undefined) || (maxCost != undefined && parseInt(product.cost) <= maxCost))){
            htmlContentToAppend += `
            <div class="list-group-item list-group-item-action">
                <div class="row">
                    <div class="col-3">
                        <img src="` + product.image + `" alt="product image" class="img-thumbnail">
                    </div>
                    <div class="col">
                        <div class="d-flex w-100 justify-content-between">
                            <div class="mb-1">
                            <h4>`+ product.name + " - " + product.currency + " " + product.cost +`</h4> 
                            <p> `+ product.description +`</p> 
                            </div>
                            <small class="text-muted">` + product.soldCount + ` artículos</small> 
                        </div>

                    </div>
                </div>
            </div>
            `
            document.getElementsByClassName("products")[0].innerHTML = htmlContentToAppend;
        }
    }
}


/* 
EJECUCIÓN:

-Al cargar la página se llama a getJSONData() pasándole por parámetro la dirección para obtener el listado.
-Se verifica el estado del objeto que devuelve, y, si es correcto, se cargan los datos en ProductsArray.
-Por último, se llama a showProductsList() pasándole por parámetro ProductsArray.

*/



//filter 
const ORDER_ASC_BY_COST = "AZ";
const ORDER_DESC_BY_COST = "ZA";
const ORDER_BY_RELEVANCE = "Cant.";
let currentProductsArray = [];
let currentSortCriteria = undefined;
let minCost = undefined;
let maxCost = undefined;

//Metodo donde se pasa el criterio para ordenar 
function sortProducts(criteria, array){
    let result = [];
    //Filtra por el menor costo, usa el "cost" del producto en un metodo sort del array
    if (criteria === ORDER_ASC_BY_COST)
    {
        result = array.sort(function(a, b) {
            if ( a.cost < b.cost ){ return -1; }
            if ( a.cost > b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_DESC_BY_COST){
        result = array.sort(function(a, b) {
            if ( a.cost > b.cost ){ return -1; }
            if ( a.cost < b.cost ){ return 1; }
            return 0;
        });
    }else if (criteria === ORDER_BY_RELEVANCE){
        result = array.sort(function(a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if ( aCount < bCount ){ return -1; }
            if ( aCount > bCount ){ return 1; }
            return 0;
        });
    }

    return result;
}
//Metodo que filtra los productos por precio y relevancia, se le pasa el criterio para ordenar
function sortAndShowProducts(sortCriteria){
    currentSortCriteria = sortCriteria;
    currentProductsArray = sortProducts(currentSortCriteria, currentProductsArray);


    //Muestro los productos
    showProductsList();
}

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.

document.addEventListener("DOMContentLoaded", ()=> {
    //Lee localStorage y guarda la variable catID 
    let catID = localStorage.getItem('catID')
    // si la variable existe
    if (catID){
        //Uso la base de la url y le agrego la variable
        getJSONData(PRODUCTS_URL + catID + ".json").then(function(resultObj){
            if (resultObj.status === "ok"){
                currentProductsArray = resultObj.data.products
                showProductsList();
            }
        });

    }
    //Evento click a un elemento html
    document.getElementById("sortAsc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_ASC_BY_COST);
    });

    document.getElementById("sortDesc").addEventListener("click", function(){
        sortAndShowProducts(ORDER_DESC_BY_COST);
    });

    document.getElementById("sortByCount").addEventListener("click", function(){
        sortAndShowProducts(ORDER_BY_RELEVANCE);
    });
    //Agrega un evento click a un elemento que limpia los filtros
    document.getElementById("clearRangeFilter").addEventListener("click", function(){
        document.getElementById("rangeFilterCountMin").value = "";
        document.getElementById("rangeFilterCountMax").value = "";

        minCost = undefined;
        maxCost = undefined;

        showProductsList();
    });

    document.getElementById("rangeFilterCount").addEventListener("click", function(){
        //Obtengo el mínimo y máximo de los intervalos para filtrar por costo
        //de productos
        minCost = document.getElementById("rangeFilterCountMin").value;
        maxCost = document.getElementById("rangeFilterCountMax").value;
        //Esta realizando si el minimo no esta vacio y si es un valor mayor a 0 
        if ((minCost != undefined) && (minCost != "") && (parseInt(minCost)) >= 0){
            minCost = parseInt(minCost);
        }
        else{
            minCost = undefined;
        }
        //Esta realizando si el maximo no esta vacio y si es un valor mayor a 0 
        if ((maxCost != undefined) && (maxCost != "") && (parseInt(maxCost)) >= 0){
            maxCost = parseInt(maxCost);
        }
        else{
            maxCost = undefined;
        }

        showProductsList();
    });
});
