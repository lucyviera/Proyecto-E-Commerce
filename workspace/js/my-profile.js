
function guardardata() {
    let dataToAdd = {
      "firstname": document.getElementById("firstname").value,
      "secondname": document.getElementById("secondname").value,
      "lastname": document.getElementById("lastname").value,
      "secondlastname": document.getElementById("secondlastname").value,
      "phonenumber": document.getElementById("phonenumber").value,
      "profilephoto": document.getElementById("profilephoto").value,
      
    }
    if (document.getElementById("email").value != localStorage.getItem("email")) {
      localStorage.setItem("email", document.getElementById("email").value);
    }
    //Si hay una imagen cargada la agregamos al objeto
    if (document.getElementById("inputprofilephoto").files.length != 0) {
      parseimage();
      async function parseimage() {
        console.log(await toBase64(imagenagregada));
        let imageparsed = await toBase64(imagenagregada);
        dataToAdd.profilephoto = imageparsed;
        localStorage.setItem("datos", JSON.stringify(dataToAdd));
        document.getElementById("alert-success").classList.add("show");
      }
    } else {
      localStorage.setItem("datos", JSON.stringify(dataToAdd));
      document.getElementById("alert-success").classList.add("show");
    }
  }
//Validación de campos obligatorios(*)
(function () {
    'use strict'
  
    //Obtener todos los formularios a los que queremos aplicar estilos de validación de Bootstrap personalizados
    var forms = document.querySelectorAll('.needs-validation')
  
    //Bucle sobre ellos y evite el envío
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault()
                event.stopPropagation()
              } else {
                event.preventDefault()
                event.stopPropagation()
                guardardata()
                Swal.fire({
                    title: '¿Estas seguro?',
                    text: "Luego puede modificar los datos nuevamente!",
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, deseo guardar.'
                  }).then((result) => {
                    if (result) {
                        Swal.fire({
                            title: 'Guardado exitosamente',
                            timer:2000,
                            position: 'top-center',
                            icon: "success"
                           
                        })
                    }
                  })
              }
              form.classList.add('was-validated')
        }, false)
        
      })
  })()


document.addEventListener("DOMContentLoaded",  () => {
//obtener el e-mail
document.getElementById("email").value = localStorage.getItem("email");
//obtener la data en localStorage
if (localStorage.getItem("datos") != null) {
    let datos = JSON.parse(localStorage.getItem("datos"));
    document.getElementById("firstname").value = datos.firstname;
    document.getElementById("secondname").value = datos.secondname;
    document.getElementById("lastname").value = datos.lastname;
    document.getElementById("secondlastname").value = datos.secondlastname;
    document.getElementById("phonenumber").value = datos.phonenumber;
    if (datos.profilephoto == null || "") {
      document.getElementById("profilephoto").src="img/img_perfil.png";
    }else{
      document.getElementById("profilephoto").src = datos.profilephoto;
    }
  }
//Evento change para cargar y mostrar la imagen
document.getElementById("inputprofilephoto").addEventListener("change", (evento) => {
    // tomamos el primer archivo, el cual vamos a previsualizar
    imagenagregada = evento.target.files[0];
    // Lo convertimos a un objeto de tipo objectURL y a la fuente de la imagen le ponemos el objectURL
    document.getElementById("profilephoto").src = URL.createObjectURL(evento.target.files[0]);
  })
});
