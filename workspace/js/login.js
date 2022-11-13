document.addEventListener('DOMContentLoaded',()=>{

    document.getElementById('Inicio').addEventListener('click',() =>{
        login()
    })
})

function login (){
    let email=document.getElementById('Email').value;
    let psw=document.getElementById('psw').value;
 
    if (email==="" || psw===""){
        document.getElementById('Email').classList.add('error');
        document.getElementById('psw').classList.add('error');
        alert("Por favor ingrese, nombre de usuario y contraseña");
    } else {
        localStorage.setItem('email', email);
        location.href="index.html";
    }
}

function logout(){
    //borrar el localStorage de usuario, para desloguear el usuario
    localStorage.setItem('email', "");
    //borrar datos de los campos de perfil al desloguear el usuario -Entrega 7
    localStorage.removeItem('datos', "")
  
}
logout()




