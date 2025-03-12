// html er 2nd nav tag er all btn ta chara sobgulu btn dynamic vabe aante hbe. tai ei code kora hoise.
function loadCategories() {
    fetch("https://openapi.programming-hero.com/api/phero-tube/categories")
    .then(res => res.json())
    .then(data => displayCategory(data.categories))
}

function displayCategory(data) {
    const categoryContainer = document.getElementById("category-container");
    for(let category of data) {
        const div = document.createElement("div");
        div.innerHTML =`
        <button id="btn-${category.category_id}" onclick="loadCategoryVideos(${category.category_id})" class="btn btn-sm hover:bg-[#FF1F3D] hover:text-white">${category.category}</button>
        `
        categoryContainer.appendChild(div);
    }
}

loadCategories();

function loadVideos(searchText = "") {
    showLoader();
    fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
    .then(response => response.json())
    .then((data) => {
        removeActiveClass();
        document.getElementById("btn-all").classList.add("active");
        displayVideos(data.videos)})
}

const displayVideos = (videos) => {
    const videoContainer = document.getElementById("video-container");

// er dhara jey btn e click korbo shudu sey btn er videogulu asbe.
    videoContainer.innerHTML = "";

// ei code ta kora hoise jodi kono btn e click korle kono video sekane na thake tahole jno eita show kore.
    if(videos.length == 0){
        videoContainer.innerHTML =`
        <div class="col-span-full flex flex-col justify-center items-center text-center py-20">
            <img src="assets/Icon.png" alt="">
            <h2 class="text-2xl font-bold py-5">Oops!! Sorry, There is no <br> content here</h2>
        </div>
        `
        hideLoader();
        return;
    }
// forEach loop use kora hoise abr callback function o niche er betore.
    videos.forEach((video) => {
        const videoCard = document.createElement("div");
        videoCard.innerHTML =`
        <div class="card bg-base-100">
            <figure class="relative">
                <img class="w-full h-[200px] object-cover"
                src="${video.thumbnail}"
                alt="" />
                <span class="absolute bottom-2 right-2 text-white bg-black px-2 text-sm rounded">3hrs 56 min ago</span>
            </figure>
            <div class="flex gap-3 px-0 py-5">
                <div class="profile">
                    <div class="avatar">
                        <div class="ring-primary ring-offset-base-100 w-6 rounded-full ring ring-offset-2">
                          <img src="${video.authors[0].profile_picture}" />
                        </div>
                    </div>
                </div>
                <div class="intro">
                    <p class="text-base font-bold">${video.title}</p>
                    <h2 class="text-sm font-semibold text-gray-400 flex items-center gap-1">${video.authors[0].profile_name}
                    ${video.authors[0].verified == true ?
                         `<img class="w-4 h-4" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="">`
                          : ` `}
                          </h2>
                    <p class="text-sm font-semibold text-gray-400">${video.others.views}</p>
                </div>
            </div>
            <button onclick=loadVideoDetails('${video.video_id}') class="btn btn-block">Show details</button>
        </div>
        `
        videoContainer.appendChild(videoCard);
    });
    hideLoader();
}

const loadCategoryVideos = (id) => {
    showLoader();
    const url =`https://openapi.programming-hero.com/api/phero-tube/category/${id}`
    console.log(url)

    fetch(url)
    .then(res => res.json())
    .then((data) => {
        removeActiveClass();
        const clickedButton = document.getElementById(`btn-${id}`);
        clickedButton.classList.add("active")
        displayVideos(data.category)})
}

function removeActiveClass() {
    const activeButtons = document.getElementsByClassName("active");
    for(let btn of activeButtons){
        btn.classList.remove("active");
    }
}

const loadVideoDetails = (videoId) => {
    console.log(videoId)
    const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`
    fetch(url)
    .then(res => res.json())
    .then(data => displayVideoDetails(data.video))
}

const displayVideoDetails = (video) => {
    document.getElementById("video_details").showModal();
    const detailsContainer = document.getElementById("details-container");

    detailsContainer.innerHTML =`
    <div class="card bg-base-100 image-full shadow-sm">
        <figure>
            <img
            src="${video.thumbnail}"
            alt="" />
        </figure>
        <div class="card-body">
            <h2 class="card-title text-white">${video.title}</h2>
            <h2 class="flex items-center gap-1">${video.authors[0].profile_name}
                    ${video.authors[0].verified == true ?
                         `<img class="w-4 h-4" src="https://img.icons8.com/?size=48&id=98A4yZTt9abw&format=png" alt="">`
                          : ` `}
                          </h2>
            <p>${video.others.views}</p>   
        </div>
    </div>
    `
} 

document.getElementById("search-input").addEventListener("keyup", (e) => {
    const input = e.target.value;
    loadVideos(input);
})

const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
    document.getElementById("video-container").classList.add("hidden");
}

const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
    document.getElementById("video-container").classList.remove("hidden");
}