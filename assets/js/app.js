/* =====================================================================
   OFFBEAT PLACE DATA, AUTOMATIC FOLDER PATHS & FULLSCREEN GALLERY
   ===================================================================== */

const PLACES_DATA = [
    {
        id: 1,
        folderName: "place1", // Reads assets/images/place1_cover.png & assets/images/place1/
        name: "Munnar Mist Trails",
        about: "Hidden tea estate trails high in the Western Ghats. Experience quiet sunrise viewpoints, spice plantations, and misty mountain ridges far from the main tourist crowds.",
        
        itineraryPdfLink: "https://google.com",
        itineraryCaption: "Tap the image above to open the complete 2-Day Munnar PDF itinerary.",
        
        googleMapsListLink: "https://goo.gl",
        mapCaption: "Tap the map photo above to open all pinned viewpoints in Google Maps.",
        
        galleryCount: 4 // Loads image1.png through image4.png inside assets/images/place1/
    },
    {
        id: 2,
        folderName: "place2", // Reads assets/images/place2_cover.png & assets/images/place2/
        name: "Jaisalmer Dunes",
        about: "Explore the untouched golden sand ridges beyond Sam Sand Dunes. Camp under clear desert skies with local folk musicians and camel herders.",
        
        itineraryPdfLink: "https://google.com",
        itineraryCaption: "Tap the image above to open the 3-Day Thar Desert PDF guide.",
        
        googleMapsListLink: "https://goo.gl",
        mapCaption: "Tap the map photo above to open the Jaisalmer spots list on Google Maps.",
        
        galleryCount: 3 // Loads image1.png through image3.png inside assets/images/place2/
    }
    // -----------------------------------------------------------------
    // TO ADD A NEW PLACE: Copy from '{' to '},' above, paste right here,
    // update id (3, 4...), folderName ("place3"), links, and galleryCount.
    // -----------------------------------------------------------------
];

// 1. Render Explore Grid on Main Page
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

// 2. Open Place Detail Page & Populate All Images + Links
function openPlaceDetail(placeId) {
    const place = PLACES_DATA.find(p => p.id === placeId);
    if (!place) return;

    const baseFolder = `assets/images/${place.folderName}`;

    // Title, Cover Image, and About Text
    document.getElementById("detail-place-name").innerText = place.name;
    document.getElementById("detail-cover-img").src = `assets/images/${place.folderName}_cover.png`;
    document.getElementById("detail-about-text").innerText = place.about;
    
    // Itinerary Image (itinery.png) & Google Drive PDF Link
    document.getElementById("detail-itinerary-img").src = `${baseFolder}/itinery.png`;
    document.getElementById("detail-itinerary-link").href = place.itineraryPdfLink;
    document.getElementById("detail-itinerary-caption").innerText = place.itineraryCaption;
    
    // Map Photo (map.png) & Google Maps List Link
    document.getElementById("detail-map-img").src = `${baseFolder}/map.png`;
    document.getElementById("detail-map-link").href = place.googleMapsListLink;
    document.getElementById("detail-map-caption").innerText = place.mapCaption;

    // Gallery Loop (Loads image1.png, image2.png ... up to galleryCount)
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

    // Switch Views
    document.getElementById("main-view").classList.remove("active");
    document.getElementById("detail-view").classList.add("active");
    window.scrollTo(0, 0);
}

// 3. Return to Main Page
function goBack() {
    document.getElementById("detail-view").classList.remove("active");
    document.getElementById("main-view").classList.add("active");
    window.scrollTo(0, 0);
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

// 5. Customizable Contact, Privacy & Terms Content
const SITE_POLICIES = {
    contact: {
        title: "Contact Us",
        html: `
            <p>Have questions about an itinerary, want to report an outdated route, or ready to share your own offbeat travel guide?</p>
            <p><strong>Founder & Curator:</strong><br>Muhammad Shamil OH<br>Student, Mar Athanasius College of Engineering</p>
            <p><strong>Official Email:</strong><br><a href="mailto:offbeattravels33@gmail.com" style="color:#D98A2B; font-weight:700;">offbeattravels33@gmail.com</a></p>
            <p>We review all community itinerary submissions within 48 hours and publish verified routes with full credit to the contributor.</p>
        `
    },
    privacy: {
        title: "Privacy Policy",
        html: `
            <p><strong>Last Updated:</strong> November 2026</p>
            <p><strong>1. Zero Data Tracking:</strong> Offbeat is a free, static travel guide platform. We do not collect personal accounts, store cookies, or sell visitor browsing data.</p>
            <p><strong>2. Community Contributions:</strong> When you email us place details or photos at <em>offbeattravels33@gmail.com</em>, your email address is used strictly to verify the route and credit your contribution if requested.</p>
            <p><strong>3. Third-Party Links:</strong> Tapping itinerary PDFs or map images redirects you to Google Drive and Google Maps, which operate under Google's standard privacy policies.</p>
        `
    },
    terms: {
        title: "Terms & Policy",
        html: `
            <p><strong>1. Personal Travel Use:</strong> All itineraries, route maps, and travel notes published on Offbeat are free for personal, non-commercial trip planning.</p>
            <p><strong>2. Travel Safety Disclaimer:</strong> Weather conditions, local entry fees, and public transit schedules can change without notice. Travelers are responsible for verifying local safety and permits before visiting remote or offbeat locations.</p>
            <p><strong>3. Content Ownership:</strong> Photos and route guides contributed by community members remain credited to their respective creators. To request edits or removal of any listing, contact <em>offbeattravels33@gmail.com</em>.</p>
        `
    }
};

function openInfoModal(type) {
    const modal = document.getElementById("info-modal");
    const title = document.getElementById("modal-title");
    const body = document.getElementById("modal-body");

    const policy = SITE_POLICIES[type];
    if (!policy) return;

    title.innerText = policy.title;
    body.innerHTML = policy.html;
    modal.style.display = "flex";
}

function closeInfoModal() {
    document.getElementById("info-modal").style.display = "none";
}
