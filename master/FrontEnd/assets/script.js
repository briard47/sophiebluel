///site version utilisateur///
///Galerie dynamique///
async function displayGallery(filter) {
    const response = await fetch("http://localhost:5678/api/works");
    const galleryWorks = await response.json();
    const dynamicGallery = document.querySelector(".gallery");
    dynamicGallery.innerHTML="";

    const filteredWorks = galleryWorks.filter(filter);

    for (let i=0 ; i< filteredWorks.length ;i++){
        const project = document.createElement("figure");
        const projectImage = document.createElement("img");
        projectImage.src = filteredWorks[i].imageUrl;

        const projectTagline = document.createElement("figcaption");
        projectTagline.innerText = filteredWorks[i].title;

        dynamicGallery.appendChild(project);
        project.appendChild(projectImage);
        project.appendChild(projectTagline);         
    }; 
}
displayGallery(() => {return true;});

///Création fonction filtres///
const filters = document.querySelector(".filter");
async function createFilters() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log(categories);
 
    function clickFilter(button, filter) {
        const buttons =document.querySelectorAll(".button");
        for (let i = 0; i < buttons.length; i++) buttons[i].classList.remove('button-selected');
        button.classList.add("button-selected");
        displayGallery(filter);
    };
    const buttonAll = document.getElementById("filterAll");
    buttonAll.addEventListener("click", function () {
        console.log("filterall");
        clickFilter(this, () => {return true;});
    });
    const select = document.getElementById("categories");
    for (let i=0 ; i< categories.length ;i++){
        const button = document.createElement("button");
        button.classList.add("button");
        button.innerText = categories[i].name;
        button.id = "filter" + categories[i].id;
        filters.appendChild(button); 

        button.addEventListener("click",function(){
            console.log("filter" + categories[i].name);
           
            const categoryName = categories[i].name;
            clickFilter(this, (work) => {
                return work.category.name === categoryName
            });
        });  
        const option= document.createElement("option");
        option.value = categories[i].id;
        option.label = categories[i].name;
        select.appendChild(option);
    };  
};

createFilters();

///site version admin///
const token = window.localStorage.getItem("AdminToken");
function admin(){
if (token){
    HeadBand();
    logout();
    addModifyIntro();
    modifyProjectModal();
}}
admin();

function HeadBand () { 
        const header = document.querySelector("header");
        header.style.marginTop = "100px";
        const displayHeadband = document.createElement("div");
        header.appendChild(displayHeadband);
        displayHeadband.classList.add("headband");
        const editionIcon = document.createElement("i")
        editionIcon.classList.add("fa-regular", "fa-pen-to-square")
        const editionMode = document.createElement("p");
        editionMode.innerText = "Mode édition";
        const publish =document.createElement("p");
        publish.classList.add("headbandPublish");
        publish.innerText = "publier les changements";
        displayHeadband.appendChild(editionIcon);
        displayHeadband.appendChild(editionMode);
        displayHeadband.appendChild(publish);
}

function logout(){
    const loginLink = document.getElementById("loginLink");
    loginLink.innerText = "logout";
    loginLink.addEventListener("click", function(){
        window.localStorage.removeItem("AdminToken");
    });
};

function addModifyIntro () {
    const introFigure = document.getElementById("introFigure");
    const modifyIntro = document.createElement("div");
    modifyIntro.classList.add("modify")
    const modifyIconIntro = document.createElement("i");
    modifyIconIntro.classList.add("fa-regular", "fa-pen-to-square");
    const modifyTextIntro = document.createElement("p");
    modifyTextIntro.innerText = "modifier";
    introFigure.appendChild(modifyIntro);
    modifyIntro.appendChild(modifyIconIntro);
    modifyIntro.appendChild(modifyTextIntro);
};

///Affichage Fenêtre Modale et Fonction///
function modifyProjectModal(){
    const projectTitleDiv =document.getElementById("titleAndModal");
    const modifyProject = document.createElement("button");
    modifyProject.classList.add("modifyButton");
    const modifyIconProject = document.createElement("i");
    modifyIconProject.classList.add("fa-regular", "fa-pen-to-square");
    const modifyTextProject = document.createElement("p");
    modifyTextProject.innerText = "modifier";
    projectTitleDiv.appendChild(modifyProject);
    modifyProject.appendChild(modifyIconProject);
    modifyProject.appendChild(modifyTextProject);
    filters.classList.add("collapse")
    displayModalGallery();
    const modalWrapper = document.querySelector(".modalWrapper");
    modifyProject.addEventListener("click", function(){
        modalWrapper.classList.remove("modalHidden");
        modalAdd.classList.add("modalHidden");
        modalEdit.classList.remove("modalHidden");
    })
    ///fermeture modale///
    const modal = document.querySelector(".modal");
    const modalEdit = document.querySelector(".modalEdit");
    const modalAdd = document.querySelector(".modalAdd");
    const addButton = document.querySelector(".modalAddPicture");
    const modalBack = document.querySelector(".fa-arrow-left")
    const xMarks = document.querySelectorAll(".fa-xmark");

    modal.addEventListener("click",function(e){
        e.stopPropagation()
    });
    modalWrapper.addEventListener("click", function (){
        modalWrapper.classList.add("modalHidden");
        displayGallery(() => {return true;});
    }) ;
    xMarks.forEach((xMark)=>xMark.addEventListener("click", function(){
        modalWrapper.classList.add("modalHidden");
        displayGallery(() => {return true;});
    }));
    addButton.addEventListener("click", function(){
        modalEdit.classList.add("modalHidden");
        modalAdd.classList.remove("modalHidden");
    })
    modalBack.addEventListener("click", function(){
        modalAdd.classList.add("modalHidden");
        modalEdit.classList.remove("modalHidden");
    })

    ///Ajout photo///
    const label= document.querySelector(".label");
    document.getElementById('modalAddPicture').addEventListener("change", function(event){
   
            label.innerHTML="";
            const previewImage =document.createElement("img")
            label.appendChild(previewImage);
            if (event.target.files.length > 0) {
                previewImage.src = URL.createObjectURL(
                  event.target.files[0],
                );}
        })
        
    
    const submit = document.getElementById("addWorkForm");

    submit.addEventListener("submit",async function(e){
        async function upload(formData) {
            e.preventDefault();
            try {
                const response = await fetch("http://localhost:5678/api/works", {
                    method: "POST",
                    body: formData,
                    headers:{  Authorization: 'Bearer '+ token },
                });
                const result = await response.json();
                console.log("Success:", result);
            } catch (error) {
                console.error("Error:", error);
                const errorMessage = document.querySelector(".errorMessage");
                errorMessage.innerText = "Un ou plusieurs éléments manquent";
            }
        }       
        const formData = new FormData();
        const fileField = document.getElementById("modalAddPicture");
        const titleField= document.getElementById("name");
        const categoryField = document.getElementById("categories");
        formData.append("image", fileField.files[0]);
        formData.append("title", titleField.value);
        formData.append("category",categoryField.options[categoryField.selectedIndex].value );
        
        await upload(formData);
        document.getElementById("addWorkForm").reset();
        label.innerHTML="<i class='fa-regular fa-image'></i>";
        label.innerHTML+="<p class='labelButton'>+ Ajouter une photo</p>"
        label.innerHTML+="<p> jpg, png : 4mo max</p>";
        modalAdd.classList.add("modalHidden");
        modalEdit.classList.remove("modalHidden");
        displayModalGallery();
    })
}
///Modale:Galerie dynamique///
async function displayModalGallery (){
const response1 = await fetch("http://localhost:5678/api/works");
const galleryModalWorks = await response1.json();
const ModalGallery = document.querySelector(".galleryModal")
ModalGallery.innerHTML="";

    for (let i=0 ; i< galleryModalWorks.length ;i++){
        const projectModal = document.createElement("figure");
        const projectModalImage = document.createElement("img");
        const modalTrashcan = document.createElement("i");
        modalTrashcan.classList.add("fa-solid", "fa-trash-can");
        projectModalImage.src = galleryModalWorks[i].imageUrl;

        const projectModalTagline = document.createElement("figcaption");
        projectModalTagline.innerText = "éditer";

        ModalGallery.appendChild(projectModal);
        projectModal.appendChild(projectModalImage);
        projectModal.appendChild(modalTrashcan);
        projectModal.appendChild(projectModalTagline);

    ///Suppression///
        const galleryWorksId = galleryModalWorks[i].id
        modalTrashcan.addEventListener("click", async function(){
        const response = await fetch("http://localhost:5678/api/works/" + galleryWorksId,{
            method: "DELETE",
            headers:{  Authorization: 'Bearer '+ token },
        } );
        displayModalGallery();
        })

        const deleteAll = document.querySelector(".modalDeleteAll")
        deleteAll.addEventListener("click", function(){
        galleryModalWorks.forEach(async() => {
            const response = await fetch("http://localhost:5678/api/works/" + galleryWorksId,{
                method: "DELETE",
                headers:{  Authorization: 'Bearer '+ token },
            } );
            displayModalGallery();
        })
    })
}; 


}



