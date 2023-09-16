const form = document.querySelector(".login_form");
form.addEventListener("submit",function(e){
    e.preventDefault();

    let inputEmail = document.getElementById("email");
    let email = inputEmail.value;
    console.log (email);

    let inputPassword = document.getElementById("password");
    let password = inputPassword.value; 
    console.log(password);

    async function Login(){
        let response =  await fetch("http://localhost:5678/api/users/login", {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "password": password,
            })
        });
        let result = await response.json();
        console.log(result);
        if (result && result.token){
            window.localStorage.setItem("AdminToken", result.token);
            document.location = "index.html";
        }
        else{
            const errorMessage = document.querySelector(".errorMessage");
            errorMessage.innerText = "Email ou mot de passe incorrect";
            form.appendChild(errorMessage);
        }
    }
    Login()
    
});




