
/* =====================================================================
   OFFBEAT PLACE DATA, PAGE ROUTER & FULLSCREEN GALLERY
   ===================================================================== */

const PLACES_DATA = [
    {
        id: 1,
        folderName: "place1",
        name: "Munnar Mist Trails",
        about: "Hidden tea estate trails high in the Western Ghats. Experience quiet sunrise viewpoints, spice plantations, and misty mountain ridges far from the main tourist crowds.",
        
        itineraryPdfLink: "https://google.com",
        itineraryCaption: "Tap the image above to open the complete 2-Day Munnar PDF itinerary.",
        
        googleMapsListLink: "https://goo.gl",
        mapCaption: "Tap the map photo above to open all pinned viewpoints in Google Maps.",
        
        galleryCount: 4
    },
    {
        id: 2,
        folderName: "place2",
        name: "Jaisalmer Dunes",
        about: "Explore the untouched golden sand ridges beyond Sam Sand Dunes. Camp under clear desert skies with local folk musicians and camel herders.",
        
        itineraryPdfLink: "https://google.com",
        itineraryCaption: "Tap the image above to open the 3-Day Thar Desert PDF guide.",
        
        googleMapsListLink: "https://goo.gl",
        mapCaption: "Tap the map photo above to open the Jaisalmer spots list on Google Maps.",
        
        galleryCount: 3
    }
];

// 1. Universal View Switcher (Switches between Main, Detail, Contribute, Contact, Privacy, Terms)
function switchView(viewId) {
    document.querySelectorAll(".view").forEach(view => {
        view.classList.remove("active");
    });

    const target = document.getElementById(viewId);
    if (target) {
        target.classList.add("active");
    }
    window.scrollTo(0, 0);
}

// 2. Render Explore Grid on Main Page
document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("places-grid");
    if (!grid) return;

    PLACES_DATA.forEach(place => {
        const coverPath = `assets/images/${place.folderName}_cover.png`;
        
        const card = document.createElement("div");
        card.className = "place-card";
        card.onclick = () => openPlaceDetail(place.id);
        card.innerHTML = `
            <img src="${coverPath}" alt="${place.name}">
            <span>${place.name}</span>
        `;
        grid.appendChild(card);
    });
});

// 3. Open Place Detail Page & Populate All Images + Links
function openPlaceDetail(placeId) {
    const place = PLACES_DATA.find(p => p.id === placeId);
    if (!place) return;

    const baseFolder = `assets/images/${place.folderName}`;

    document.getElementById("detail-place-name").innerText = place.name;
    document.getElementById("detail-cover-img").src = `assets/images/${place.folderName}_cover.png`;
    document.getElementById("detail-about-text").innerText = place.about;
    
    document.getElementById("detail-itinerary-img").src = `${baseFolder}/itinery.png`;
    document.getElementById("detail-itinerary-link").href = place.itineraryPdfLink;
    document.getElementById("detail-itinerary-caption").innerText = place.itineraryCaption;
    
    document.getElementById("detail-map-img").src = `${baseFolder}/map.png`;
    document.getElementById("detail-map-link").href = place.googleMapsListLink;
    document.getElementById("detail-map-caption").innerText = place.mapCaption;

    const galleryGrid = document.getElementById("detail-gallery-grid");
    galleryGrid.innerHTML = "";

    for (let i = 1; i <= place.galleryCount; i++) {
        const imgSrc = `${baseFolder}/image${i}.png`;
        const img = document.createElement("img");
        img.src = imgSrc;
        img.alt = `${place.name} Gallery Photo ${i}`;
        img.onclick = () => openLightbox(imgSrc);
        galleryGrid.appendChild(img);
    }

    switchView("detail-view");
}

// 4. Fullscreen Gallery Zoom Handlers
function openLightbox(imageSrc) {
    const lightbox = document.getElementById("lightbox-modal");
    const lightboxImg = document.getElementById("lightbox-img");
    lightboxImg.src = imageSrc;
    lightbox.style.display = "flex";
}

function closeLightbox() {
    document.getElementById("lightbox-modal").style.display = "none";
    document.getElementById("lightbox-img").src = "";
}
