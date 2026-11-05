// 1. DATA STATE ARCHITECTURE
const SAMPLE_ITINERARIES = [
    {
        id: 1,
        title: "7 Days of Zen - Kyoto Hidden Gems",
        duration: "7 Days",
        region: "Japan",
        highlights: "Arashiyama Bamboo, Otagi Nenbutsu-ji, Budget Stays Matrix",
        days: [
            {
                day: 1,
                stops: [
                    { name: "Arashiyama Bamboo Grove", details: "Morning walk through historic bamboo trails.", cost: "Free", lat: 35.0156, lng: 135.6715 },
                    { name: "Otagi Nenbutsu-ji Temple", details: "Whimsical temple site featuring 1,200 whimsical stone statues.", cost: "$3.00", lat: 35.0315, lng: 135.6669 }
                ],
                transit: "Transit Node Connection: Take Hankyu Line Bus #28 (15 Mins | 4.5 km)",
                hotels: [
                    { tier: "Economy Budget Stay", name: "Kyoto Backpackers Hostels", price: "$22/night" },
                    { tier: "Mid-Range Budget Stay", name: "Sakura Hotel Gion", price: "$75/night" },
                    { tier: "Luxury Budget Stay", name: "The Ritz-Carlton Kyoto", price: "$450/night" }
                ]
            }
        ]
    }
];

let pendingSubmissions = [
    { id: 101, date: "20/12/2026 12:21", user: "John Doe", title: "Hidden Corners of Paris", region: "France" },
    { id: 102, date: "21/12/2026 09:15", user: "Aalora Balitono", title: "Kerala Backwater Homestays", region: "India" }
];

let isAdminLoggedIn = false;
let webMapInstance = null;

// 2. RUNTIME INITIALIZATION
document.addEventListener("DOMContentLoaded", () => {
    renderExploreCards();
    renderAdminQueue();
});

// 3. ROUTER / PAGE VIEW CONTROLLER FUNCTION
function switchPage(pageId) {
    document.querySelectorAll('.page-view').forEach(view => {
        view.classList.remove('active');
    });
    
    const targetView = document.getElementById(`view-${pageId}`);
    if (targetView) {
        targetView.classList.add('active');
    }
    window.scrollTo(0,0);
}

// 4. RENDERING DRIVERS
function renderExploreCards() {
    const target = document.getElementById("explore-cards-target");
    if (!target) return;
    target.innerHTML = "";

    SAMPLE_ITINERARIES.forEach(iti => {
        target.innerHTML += `
            <div class="itinerary-card">
                <div class="iti-img-holder">🗺️ Preview Snapshot Layout</div>
                <div class="iti-content">
                    <div class="iti-meta">${iti.duration} | ${iti.region}</div>
                    <h3>${iti.title}</h3>
                    <p style="font-size:13px; color:#555; margin: 10px 0;"><strong>Highlights:</strong> ${iti.highlights}</p>
                    <button class="action-btn-accent" onclick="loadItineraryDetails(${iti.id})">View Details</button>
                </div>
            </div>
        `;
    });
}

function loadItineraryDetails(id) {
    const iti = SAMPLE_ITINERARIES.find(i => i.id === id);
    if (!iti) return;

    document.getElementById("detail-title").innerText = iti.title;
    const timeline = document.getElementById("timeline-target");
    timeline.innerHTML = "";

    iti.days.forEach(d => {
        timeline.innerHTML += `<div class="timeline-day-header">Day ${d.day}</div>`;
        
        d.stops.forEach(stop => {
            timeline.innerHTML += `
                <div class="timeline-node">
                    <h4>${stop.name}</h4>
                    <p style="font-size:13px; color:#555; margin-top:4px;">${stop.details}</p>
                    <span style="font-size:11px; font-weight:700; color:#ffd700; background:#000; padding:2px 6px; border-radius:3px; display:inline-block; margin-top:8px;">Entry: ${stop.cost}</span>
                </div>
            `;
        });

        timeline.innerHTML += `<div class="transit-indicator">🚌 ${d.transit}</div>`;

        let hotelRows = d.hotels.map(h => `
            <div class="hotel-row">
                <span><strong>${h.tier}:</strong> ${h.name}</span>
                <strong>${h.price}</strong>
            </div>
        `).join("");

        timeline.innerHTML += `
            <div class="lodging-matrix-box">
                <h4 style="margin-bottom:10px;">🏨 Day ${d.day} Available Budget Stay Matrix</h4>
                ${hotelRows}
            </div>
        `;
    });

    switchPage('detail');

    // Trigger Leaflet Map Render
    setTimeout(() => {
        if (webMapInstance !== null) {
            webMapInstance.remove();
        }

        const firstStop = iti.days[0].stops[0];
        const mapCenterLoc = [firstStop.lat, firstStop.lng];
        webMapInstance = L.map('map').setView(mapCenterLoc, 13);

        L.tileLayer('https://{s}://{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
        }).addTo(webMapInstance);

        let pathLineCoordinates = [];

        iti.days.forEach(day => {
            day.stops.forEach(stop => {
                const stopPoint = [stop.lat, stop.lng];
                pathLineCoordinates.push(stopPoint);

                L.marker(stopPoint)
                    .addTo(webMapInstance)
                    .bindPopup(`<strong>${stop.name}</strong><br>Fee: ${stop.cost}`);
            });
        });

        if (pathLineCoordinates.length > 1) {
            L.polyline(pathLineCoordinates, {
                color: '#000000',
                weight: 4,
                dashArray: '5, 10'
            }).addTo(webMapInstance);
            
            webMapInstance.fitBounds(pathLineCoordinates);
        }
    }, 100); 
}

function renderAdminQueue() {
    const tbody = document.getElementById("queue-table-body");
    if (!tbody) return;
    tbody.innerHTML = "";

    if (pendingSubmissions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#777;">No pending submissions.</td></tr>`;
        return;
    }

    pendingSubmissions.forEach(sub => {
        tbody.innerHTML += `
            <tr id="row-${sub.id}">
                <td>${sub.date}</td>
                <td><strong>${sub.user}</strong></td>
                <td>${sub.title}</td>
                <td>${sub.region}</td>
                <td>
                    <button class="action-row-btn approve" onclick="handleQueue(${sub.id}, 'approve')">Approve</button>
                    <button class="action-row-btn reject" onclick="handleQueue(${sub.id}, 'reject')">Reject</button>
                </td>
            </tr>
        `;
    });
}

function handleQueue(id, action) {
    if (action === 'approve') {
        const sub = pendingSubmissions.find(s => s.id === id);
        if (sub) {
            SAMPLE_ITINERARIES.push({
                id: SAMPLE_ITINERARIES.length + 1,
                title: sub.title,
                duration: "Custom Days",
                region: sub.region,
                highlights: "User Contributed Path",
                days: []
            });
            renderExploreCards();
            alert(`"${sub.title}" successfully approved and deployed live!`);
        }
    }
    pendingSubmissions = pendingSubmissions.filter(s => s.id !== id);
    renderAdminQueue();
}

// 5. BACKEND PIPELINE LOGIN BRIDGE
function openLoginModal() {
    document.getElementById("login-modal").style.display = "flex";
}

function closeLoginModal() {
    document.getElementById("login-modal").style.display = "none";
    document.getElementById("login-error-msg").innerText = "";
}

function attemptLogin() {
    const emailInput = document.getElementById("login-email").value;
    const passInput = document.getElementById("login-password").value;
    const errorMsg = document.getElementById("login-error-msg");

    // Connect directly to our backend Express endpoint API
    fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput, password: passInput })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            isAdminLoggedIn = true;
            document.getElementById("nav-admin-link").style.display = "inline-block";
            document.getElementById("admin-badge").style.display = "inline-block";
            document.getElementById("login-trigger-btn").style.display = "none";
            closeLoginModal();
            switchPage('admin-portal');
        } else {
            errorMsg.innerText = data.message;
        }
    })
    .catch(err => {
        errorMsg.innerText = "Backend Connection Server Error.";
    });
}

// 6. TOOL INTERACTIONS INTERFACE LOOPS
function openContributionAlert() {
    alert("Contribution section active. Log in to the Admin Portal to manage submissions.");
}

function removeStop(nodeId, deductionsValue) {
    const targetElement = document.getElementById(nodeId);
    if(targetElement) targetElement.remove();
    
    const activePrice = 450 - deductionsValue;
    document.getElementById("custom-price-tag").innerText = `$${activePrice}`;
    document.getElementById("variance-tag").innerText = `-$${deductionsValue}`;
}

function resetComparison() {
    document.getElementById("custom-price-tag").innerText = "$450";
    document.getElementById("variance-tag").innerText = "$0";
    switchPage('compare');
}
