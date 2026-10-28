const destinations = {
    mpstme: { name: "MPSTME", coords: [19.1034, 72.8373] },
    infiniti: { name: "Infiniti Mall", coords: [19.1410, 72.8310] },
    dn_nagar: { name: "DN Nagar Metro", coords: [19.1245, 72.8315] },
    juhu: { name: "Juhu Beach", coords: [19.0988, 72.8266] }
};

let map;
let markers = [];
let destMarker = null;

// Expanded Parking Data (17 locations across Andheri, Vile Parle, Juhu)
const parkingData = [
    { id: 1, name: "Rasraj Nala Road Pay & Park", address: "Vile Parle West", lat: 19.1020, lng: 72.8380, type: "public", status: "verified", spacesAvailable: 12, totalSpaces: 50, price: "₹40/hr", priceVal: 40, hours: "08:00-23:00", covered: false, safety: "4.5/5 (Attendant)", allowed: ["car", "bike"], lastUpdated: "2 mins ago" },
    { id: 2, name: "NMIMS Campus Internal Parking", address: "Vl Mehta Road", lat: 19.1040, lng: 72.8365, type: "restricted", status: "verified", spacesAvailable: 5, totalSpaces: 100, price: "Permit only", priceVal: 999, hours: "07:00-22:00", covered: true, safety: "5/5 (CCTV & Guard)", allowed: ["car", "bike"], notice: "Entry restricted to valid ID holders." },
    { id: 3, name: "Cooper Hospital Public Parking", address: "Bhaktivedanta Swami Marg", lat: 19.1065, lng: 72.8360, type: "public", status: "verified", spacesAvailable: 4, totalSpaces: 80, price: "₹30/hr", priceVal: 30, hours: "24 Hours", covered: false, safety: "3.8/5 (Lit, busy)", allowed: ["car", "bike"], lastUpdated: "1 min ago" },
    { id: 4, name: "Vile Parle Station East", address: "Monghibai Road", lat: 19.1015, lng: 72.8465, type: "public", status: "verified", spacesAvailable: 25, totalSpaces: 150, price: "₹20/hr", priceVal: 20, hours: "06:00-00:00", covered: true, safety: "4.0/5 (Railway Police)", allowed: ["bike"], lastUpdated: "10 mins ago" },
    { id: 7, name: "JVPD Scheme Society Visitor", address: "NS Road No. 4", lat: 19.1055, lng: 72.8340, type: "residential", status: "verified", spacesAvailable: 3, totalSpaces: 10, price: "Free (Guest)", priceVal: 0, hours: "08:00-22:00", covered: true, safety: "4.9/5 (Guard)", allowed: ["car"], notice: "Requires resident confirmation." },
    
    { id: 5, name: "Andheri MIDC Smart Parking", address: "Central Road, MIDC", lat: 19.1150, lng: 72.8710, type: "public", status: "verified", spacesAvailable: 40, totalSpaces: 200, price: "₹50/hr", priceVal: 50, hours: "24 Hours", covered: true, safety: "4.8/5 (Smart Sensors)", allowed: ["car", "bike"], lastUpdated: "Just now" },
    { id: 8, name: "WEH Metro Station Parking", address: "Western Express Hwy", lat: 19.1155, lng: 72.8550, type: "public", status: "verified", spacesAvailable: 85, totalSpaces: 300, price: "₹30/hr", priceVal: 30, hours: "05:00-23:30", covered: true, safety: "4.5/5 (Metro Security)", allowed: ["car", "bike"], lastUpdated: "2 mins ago" },
    
    { id: 11, name: "Infiniti Mall Basement", address: "New Link Road, Andheri West", lat: 19.1415, lng: 72.8310, type: "public", status: "verified", spacesAvailable: 115, totalSpaces: 400, price: "₹50/hr", priceVal: 50, hours: "10:00-23:30", covered: true, safety: "4.9/5 (CCTV & Guard)", allowed: ["car", "bike"], lastUpdated: "Just now" },
    { id: 12, name: "Crystal Point Mall Parking", address: "New Link Road", lat: 19.1350, lng: 72.8300, type: "public", status: "verified", spacesAvailable: 22, totalSpaces: 100, price: "₹40/hr", priceVal: 40, hours: "09:00-23:00", covered: true, safety: "4.6/5 (Guarded)", allowed: ["car", "bike"], lastUpdated: "4 mins ago" },
    { id: 17, name: "Laxmi Industrial Estate", address: "Andheri West", lat: 19.1375, lng: 72.8325, type: "public", status: "verified", spacesAvailable: 45, totalSpaces: 150, price: "₹40/hr", priceVal: 40, hours: "08:00-20:00", covered: false, safety: "4.2/5 (Estate Guard)", allowed: ["car", "bike"], lastUpdated: "8 mins ago" },
    { id: 10, name: "DN Nagar Metro Parking", address: "New Link Rd", lat: 19.1245, lng: 72.8315, type: "public", status: "verified", spacesAvailable: 14, totalSpaces: 80, price: "₹40/hr", priceVal: 40, hours: "06:00-23:00", covered: true, safety: "4.6/5 (Metro Security)", allowed: ["bike"], lastUpdated: "8 mins ago" },
    { id: 13, name: "DN Nagar Public Street", address: "Near Metro Gate 2", lat: 19.1250, lng: 72.8320, type: "unverified", status: "unverified", spacesAvailable: "?", totalSpaces: "?", price: "Unknown", priceVal: null, hours: "Unknown", covered: false, safety: "Unknown", allowed: ["car", "bike"], notice: "Data unverified. Park at your own risk." },
    { id: 6, name: "Lokhandwala Backroad Spot", address: "Lokhandwala Complex", lat: 19.1430, lng: 72.8220, type: "unverified", status: "unverified", spacesAvailable: "?", totalSpaces: "?", price: "Unknown", priceVal: null, hours: "Unknown", covered: false, safety: "Unknown", allowed: ["car"], notice: "Street parking, frequently towed area." },
    
    { id: 9, name: "Juhu Beach Pay & Park", address: "Juhu Tara Road", lat: 19.0988, lng: 72.8266, type: "public", status: "verified", spacesAvailable: 120, totalSpaces: 400, price: "₹60/hr", priceVal: 60, hours: "06:00-02:00", covered: false, safety: "3.5/5 (Open Lot)", allowed: ["car", "bike"], lastUpdated: "5 mins ago" },
    { id: 15, name: "Novotel Juhu Valet/Paid", address: "Balraj Sahni Rd, Juhu", lat: 19.1050, lng: 72.8250, type: "public", status: "verified", spacesAvailable: 8, totalSpaces: 50, price: "₹150/hr", priceVal: 150, hours: "24 Hours", covered: true, safety: "5/5 (Hotel Valet)", allowed: ["car"], lastUpdated: "Just now" },
    { id: 16, name: "Juhu Tara Roadside Strip", address: "Juhu Tara Rd", lat: 19.0995, lng: 72.8275, type: "unverified", status: "unverified", spacesAvailable: "?", totalSpaces: "?", price: "Free", priceVal: 0, hours: "24 Hours", covered: false, safety: "2.5/5 (Unattended)", allowed: ["car", "bike"], notice: "Check for 'No Parking' signs before leaving vehicle." }
];

// Calculate distance in KM using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2-lat1) * Math.PI / 180;
    const dLon = (lon2-lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
}

function initMap() {
    map = L.map('map', { zoomControl: false }).setView(destinations.mpstme.coords, 14);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    
    // Esri World Street Map (Free, highly detailed)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri'
    }).addTo(map);

    document.getElementById('destination').addEventListener('change', updateApp);
    document.getElementById('scenario-selector').addEventListener('change', updateApp);
    document.getElementById('vehicle-type').addEventListener('change', updateApp);
    
    updateApp();
}

function openHoldModal(name, lat, lng) {
    document.getElementById('modal-lot-name').innerText = name;
    const gmapsLink = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    document.getElementById('modal-nav-btn').href = gmapsLink;
    document.getElementById('hold-modal').classList.remove('hidden');
}

function updateApp() {
    const destKey = document.getElementById('destination').value;
    const scenario = document.getElementById('scenario-selector').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    
    const target = destinations[destKey];
    
    // Manage Markers
    if (destMarker) map.removeLayer(destMarker);
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    // Add Destination Marker
    const dIcon = L.divIcon({
        className: 'custom-icon',
        html: `<div class="bg-slate-900 text-emerald-400 p-2 rounded-lg border-2 border-emerald-400 shadow-xl font-black text-xs text-center w-28 transform -translate-y-4">🎯 ${target.name.toUpperCase()}</div>`,
        iconSize: [112, 36]
    });
    destMarker = L.marker(target.coords, {icon: dIcon, zIndexOffset: 1000}).addTo(map);
    
    // Process Data
    let processedData = parkingData.map(p => {
        let dist = getDistance(target.coords[0], target.coords[1], p.lat, p.lng);
        return {
            ...p,
            distanceKm: dist,
            walkMins: Math.max(1, Math.round((dist * 1000) / 80)) // 80 meters per minute walk speed
        };
    });
    
    // 1. Filter by vehicle
    processedData = processedData.filter(p => p.allowed.includes(vehicleType));
    
    // 2. Filter & Sort by Scenario
    if (scenario === 'view_all') {
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        document.getElementById('results-title').innerText = "All Parking Spaces";
        document.getElementById('results-subtitle').innerText = "Sorted by distance";
    } 
    else if (scenario === 'rainy') {
        processedData = processedData.filter(p => p.covered === true);
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        processedData = processedData.slice(0, 5); // Top 5
        document.getElementById('results-title').innerText = "Covered Spaces Only";
        document.getElementById('results-subtitle').innerText = "Nearest to destination";
    }
    else if (scenario === 'budget') {
        processedData = processedData.filter(p => p.priceVal !== null);
        // Sort primarily by price, then by distance
        processedData.sort((a, b) => {
            if (a.priceVal !== b.priceVal) return a.priceVal - b.priceVal;
            return a.distanceKm - b.distanceKm;
        });
        processedData = processedData.slice(0, 5);
        document.getElementById('results-title').innerText = "Budget Matches";
        document.getElementById('results-subtitle').innerText = "Sorted by lowest price";
    }
    else if (scenario === 'no_data') {
        processedData = processedData.filter(p => p.status === 'unverified');
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        document.getElementById('results-title').innerText = "Unverified Locations";
        document.getElementById('results-subtitle').innerText = "Caution advised";
    }
    else if (scenario === 'full') {
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        processedData = processedData.slice(0, 4);
        if (processedData.length > 0) {
            // Artificially make the closest one full for the demo
            processedData[0].spacesAvailable = 0;
        }
        document.getElementById('results-title').innerText = "Alternative Matches";
        document.getElementById('results-subtitle').innerText = "Primary location is full";
    }
    else {
        // 'nearest' (Default)
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        processedData = processedData.slice(0, 5); // Top 5 closest
        document.getElementById('results-title').innerText = "Smart Matches";
        document.getElementById('results-subtitle').innerText = "Nearest to destination";
    }

    // Set Map View (Zoom out if view_all)
    map.setView(target.coords, scenario === 'view_all' ? 13 : 15);

    // Update Insights Panel mock data based on destination
    let occ = 85; let cong = "Mod";
    if(destKey === 'infiniti') { occ = 95; cong = "High"; }
    else if(destKey === 'juhu') { occ = 90; cong = "High"; }
    else if(destKey === 'dn_nagar') { occ = 75; cong = "Low"; }
    
    if(scenario === 'full') occ = 98;
    
    document.getElementById('insight-occupancy').innerText = `${occ}%`;
    document.getElementById('insight-congestion').innerText = cong;
    const bar = document.getElementById('occupancy-bar');
    bar.style.width = `${occ}%`;
    if(occ > 90) bar.className = "bg-red-500 h-1.5 rounded-full transition-all duration-1000";
    else if(occ > 70) bar.className = "bg-orange-500 h-1.5 rounded-full transition-all duration-1000";
    else bar.className = "bg-emerald-500 h-1.5 rounded-full transition-all duration-1000";

    // Render Cards & Markers
    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';

    if (processedData.length === 0) {
        container.innerHTML = `<div class="text-center p-6 bg-white rounded-xl border border-slate-200"><p class="text-slate-500 font-medium">No suitable parking found matching these criteria.</p></div>`;
        return;
    }

    processedData.forEach(p => {
        let bgClass = 'bg-emerald-500 border-emerald-200 text-white'; 
        let labelClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
        let labelText = 'Available';
        
        if (p.spacesAvailable === 0) {
            bgClass = 'bg-red-500 border-red-200 text-white'; labelClass = 'bg-red-100 text-red-700 border-red-200'; labelText = 'FULL';
        } else if (p.type === 'restricted') {
            bgClass = 'bg-orange-500 border-orange-200 text-white'; labelClass = 'bg-orange-100 text-orange-700 border-orange-200'; labelText = 'Permit Only';
        } else if (p.type === 'residential') {
            bgClass = 'bg-purple-600 border-purple-200 text-white'; labelClass = 'bg-purple-100 text-purple-700 border-purple-200'; labelText = 'Society';
        } else if (p.status === 'unverified') {
            bgClass = 'bg-slate-600 border-slate-400 text-white'; labelClass = 'bg-slate-200 text-slate-700 border-slate-300'; labelText = 'Unverified';
        }
        
        const icon = L.divIcon({ className: 'custom-icon', html: `<div class="${bgClass} w-8 h-8 flex items-center justify-center rounded-full border-2 shadow-lg font-bold text-[11px] ring-2 ring-white/50 transition transform hover:scale-110">P</div>`, iconSize: [32, 32] });
        const marker = L.marker([p.lat, p.lng], {icon: icon}).addTo(map);
        
        const gmapsLink = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
        marker.bindPopup(`
            <div class="font-sans min-w-[150px]">
                <strong class="text-sm block mb-1 text-slate-800">${p.name}</strong>
                <p class="text-xs text-slate-500 mb-3">${p.address}</p>
                <button onclick="openHoldModal('${p.name}', ${p.lat}, ${p.lng})" class="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-2 rounded-md font-bold transition">Hold Spot</button>
            </div>
        `);
        markers.push(marker);

        const spotsText = p.spacesAvailable === 0 ? '0 spots' : (p.spacesAvailable + (p.spacesAvailable === '?' ? ' spaces' : ' spots'));
        const spotsColor = p.spacesAvailable === 0 ? 'text-red-600' : (p.status === 'unverified' ? 'text-slate-600' : 'text-emerald-600');
        const walkDisplay = p.walkMins < 60 ? `${p.walkMins} min walk` : `${(p.distanceKm).toFixed(1)} km away`;
        
        let cardHtml = `
            <div class="bg-white border ${p.spacesAvailable === 0 ? 'border-red-300' : 'border-slate-200'} rounded-xl p-4 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all cursor-pointer group" onclick="map.setView([${p.lat}, ${p.lng}], 16)">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-[15px] text-slate-800 leading-tight group-hover:text-emerald-700 transition">${p.name}</h4>
                    <span class="text-[10px] ${labelClass} px-2 py-0.5 rounded border font-bold uppercase tracking-wider ml-2 shrink-0">${labelText}</span>
                </div>
                <div class="text-[11px] text-slate-500 mb-3 flex items-center">
                    <svg class="w-3 h-3 mr-1 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                    ${p.address}
                </div>
                
                ${p.notice ? `<div class="mb-3 text-[11px] bg-orange-50 border-l-2 border-orange-400 p-2 text-orange-800 rounded-r"><span class="font-bold">Notice:</span> ${p.notice}</div>` : ''}

                <div class="grid grid-cols-2 gap-y-3 gap-x-2 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                    <div class="text-[11px]">
                        <span class="block text-slate-400 font-medium uppercase tracking-wider">Availability</span>
                        <span class="font-bold text-sm ${spotsColor}">${spotsText}</span>
                    </div>
                    <div class="text-[11px]">
                        <span class="block text-slate-400 font-medium uppercase tracking-wider">Distance</span>
                        <span class="font-bold text-sm text-slate-700">${walkDisplay}</span>
                    </div>
                    <div class="text-[11px]">
                        <span class="block text-slate-400 font-medium uppercase tracking-wider">Est. Price</span>
                        <span class="font-bold text-slate-700">${p.price}</span>
                    </div>
                    <div class="text-[11px]">
                        <span class="block text-slate-400 font-medium uppercase tracking-wider">Safety Rating</span>
                        <span class="font-bold text-blue-700 truncate block pr-1" title="${p.safety}">${p.safety}</span>
                    </div>
                </div>
                
                <div class="flex space-x-2">
                    <button onclick="event.stopPropagation(); openHoldModal('${p.name}', ${p.lat}, ${p.lng})" class="${p.spacesAvailable === 0 ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'} flex-1 text-xs font-bold py-2 rounded-lg transition text-center">
                        Hold Spot (15m)
                    </button>
                    <a href="${gmapsLink}" target="_blank" onclick="event.stopPropagation();" class="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 flex items-center justify-center rounded-lg transition tooltip" title="Navigate">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                    </a>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

window.onload = initMap;
