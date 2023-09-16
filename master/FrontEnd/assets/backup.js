async function createGalleryHTML() {
    const response = await fetch("http://localhost:5678/api/works");
    const galleryWorks = await response.json();
    console.log(galleryWorks);

    for (let i=0 ; i< galleryWorks.length ;i++){
            const dynamicGallery = document.querySelector(".gallery");

            const project = document.createElement("figure");
            const projectImage = document.createElement("img");
            projectImage.src = galleryWorks[i].imageUrl;

            const projectTagline = document.createElement("figcaption");
            projectTagline.innerText = galleryWorks[i].title;

            dynamicGallery.appendChild(project);
            project.appendChild(projectImage);
            project.appendChild(projectTagline);         
            };
};  
createGalleryHTML();


const filters = document.querySelector(".filter");
async function createFilters() {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log(categories);

    for (let i=0 ; i< categories.length ;i++){
        const button = document.createElement("button");
        button.classList.add("button");
        button.innerText = categories[i].name;
        button.id = "filter" + categories[i].id;
        filters.appendChild(button); 
        button.addEventListener("click",function(){
            console.log("filter" + categories[i].name);
            button.classList.add("button-selected")
        });  
    };
}
createFilters();
const buttons =document.querySelectorAll(".button");
const buttonAll = document.getElementById("filterAll");

buttonAll.addEventListener("click", function () {
    console.log("filterall");
    document.querySelector(".gallery").innerHTML="";
    createGalleryHTML();
});
