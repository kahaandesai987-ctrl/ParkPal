const destinations = {
    mpstme: { name: "MPSTME (NMIMS)", coords: [19.1034, 72.8373] },
    infiniti: { name: "Infiniti Mall", coords: [19.1410, 72.8310] },
    dn_nagar: { name: "DN Nagar Metro", coords: [19.1245, 72.8315] },
    midc: { name: "MIDC Central Rd", coords: [19.1150, 72.8710] },
    juhu: { name: "Juhu Beach", coords: [19.0988, 72.8266] }
};

let map;
let markers = [];
let destMarker = null;

// User & Wallet State
let currentUser = {
    name: "Dheer Sheth",
    initials: "DS",
    role: "visitor", // 'visitor' or 'nmims'
    hasCampusPermit: false,
    vehicle: "car"
};

let walletBalance = 250;
let transactions = [
    { title: "Initial FastTag Auto-Load", amount: +250, time: "Today, 08:00 AM", type: "credit" }
];

let pendingHoldLot = null;
let activeHold = null;
let holdTimerInterval = null;

// Expanded Parking Data (17 locations across Vile Parle, Andheri, Juhu)
const parkingData = [
    { id: 1, name: "Rasraj Nala Road Pay & Park", address: "Between RG Gadkari Marg & VM Rd, Vile Parle W", lat: 19.1020, lng: 72.8380, type: "public", status: "verified", spacesAvailable: 12, totalSpaces: 50, price: "₹40/hr", priceVal: 40, hours: "08:00-23:00", open24: false, covered: false, safety: "4.5/5 (BMC Attendant)", allowed: ["car", "bike"], lastUpdated: "2 mins ago" },
    { id: 2, name: "NMIMS Campus Internal Parking", address: "Bhakti Vedant Swami Marg, Vile Parle W", lat: 19.1040, lng: 72.8365, type: "restricted", status: "verified", spacesAvailable: 8, totalSpaces: 100, price: "Free (Permit)", priceVal: 0, hours: "07:00-22:00", open24: false, covered: true, safety: "5.0/5 (CCTV & Campus Guard)", allowed: ["car", "bike"], lastUpdated: "1 min ago", notice: "Authorised NMIMS Permit required. Switch to Student Profile to unlock." },
    { id: 3, name: "Cooper Hospital Public Lot", address: "Bhaktivedanta Swami Marg, JVPD", lat: 19.1065, lng: 72.8360, type: "public", status: "verified", spacesAvailable: 6, totalSpaces: 80, price: "₹30/hr", priceVal: 30, hours: "24 Hours", open24: true, covered: false, safety: "4.1/5 (24/7 Guarded)", allowed: ["car", "bike"], lastUpdated: "1 min ago" },
    { id: 4, name: "Vile Parle Station East Lot", address: "Monghibai Road, Vile Parle East", lat: 19.1015, lng: 72.8465, type: "public", status: "verified", spacesAvailable: 25, totalSpaces: 150, price: "₹20/hr", priceVal: 20, hours: "06:00-00:00", open24: false, covered: true, safety: "4.0/5 (Railway Police)", allowed: ["bike"], lastUpdated: "5 mins ago" },
    { id: 7, name: "JVPD Scheme Society Visitor", address: "NS Road No. 4, JVPD Scheme", lat: 19.1055, lng: 72.8340, type: "residential", status: "verified", spacesAvailable: 3, totalSpaces: 10, price: "₹30/hr (Guest)", priceVal: 30, hours: "08:00-22:00", open24: false, covered: true, safety: "4.9/5 (Gated Society)", allowed: ["car"], lastUpdated: "4 mins ago", notice: "App hold code must be shown to society watchman." },
    { id: 8, name: "Gulmohar Enclave Society", address: "Gulmohar Road, Vile Parle West", lat: 19.1080, lng: 72.8350, type: "residential", status: "unverified", spacesAvailable: "?", totalSpaces: 15, price: "Visitor Rate", priceVal: 40, hours: "Daytime", open24: false, covered: false, safety: "3.9/5 (Watchman)", allowed: ["car", "bike"], lastUpdated: "Offline", notice: "Unverified live count — check at society gate." },
    
    { id: 5, name: "Andheri MIDC Smart Multilevel", address: "Central Road, MIDC, Andheri East", lat: 19.1150, lng: 72.8710, type: "public", status: "verified", spacesAvailable: 40, totalSpaces: 200, price: "₹50/hr", priceVal: 50, hours: "24 Hours", open24: true, covered: true, safety: "4.8/5 (Boom Barrier & CCTV)", allowed: ["car", "bike"], lastUpdated: "Just now" },
    { id: 14, name: "WEH Metro Station Pay & Park", address: "Western Express Hwy, Andheri East", lat: 19.1155, lng: 72.8550, type: "public", status: "verified", spacesAvailable: 85, totalSpaces: 300, price: "₹30/hr", priceVal: 30, hours: "05:00-23:30", open24: false, covered: true, safety: "4.5/5 (Metro Security)", allowed: ["car", "bike"], lastUpdated: "2 mins ago" },
    
    { id: 11, name: "Infiniti Mall Multi-Level", address: "New Link Road, Andheri West", lat: 19.1415, lng: 72.8310, type: "public", status: "verified", spacesAvailable: 115, totalSpaces: 400, price: "₹60/hr", priceVal: 60, hours: "10:00-23:30", open24: false, covered: true, safety: "4.9/5 (Full Security)", allowed: ["car", "bike"], lastUpdated: "Just now" },
    { id: 12, name: "Crystal Point Mall Basement", address: "New Link Road, Andheri West", lat: 19.1350, lng: 72.8300, type: "public", status: "verified", spacesAvailable: 22, totalSpaces: 100, price: "₹40/hr", priceVal: 40, hours: "09:00-23:00", open24: false, covered: true, safety: "4.6/5 (Guarded)", allowed: ["car", "bike"], lastUpdated: "4 mins ago" },
    { id: 17, name: "Laxmi Industrial Estate Lot", address: "New Link Rd, Andheri West", lat: 19.1375, lng: 72.8325, type: "public", status: "verified", spacesAvailable: 45, totalSpaces: 150, price: "₹40/hr", priceVal: 40, hours: "08:00-21:00", open24: false, covered: false, safety: "4.2/5 (Estate Guard)", allowed: ["car", "bike"], lastUpdated: "8 mins ago" },
    { id: 10, name: "DN Nagar Metro Commuter Lot", address: "JP Road, Andheri West", lat: 19.1245, lng: 72.8315, type: "public", status: "verified", spacesAvailable: 14, totalSpaces: 80, price: "₹25/hr", priceVal: 25, hours: "06:00-23:00", open24: false, covered: true, safety: "4.6/5 (Metro Security)", allowed: ["bike", "car"], lastUpdated: "3 mins ago" },
    { id: 13, name: "DN Nagar Service Road Strip", address: "Near Metro Gate 2, Andheri W", lat: 19.1255, lng: 72.8325, type: "unverified", status: "unverified", spacesAvailable: "?", totalSpaces: "?", price: "Unknown", priceVal: null, hours: "24 Hours", open24: true, covered: false, safety: "2.8/5 (Streetside)", allowed: ["car", "bike"], lastUpdated: "Offline", notice: "Unverified — check before travelling." },
    { id: 6, name: "Lokhandwala Backroad Bays", address: "Lokhandwala Complex, Andheri W", lat: 19.1430, lng: 72.8220, type: "unverified", status: "unverified", spacesAvailable: "?", totalSpaces: "?", price: "Unknown", priceVal: null, hours: "Unknown", open24: true, covered: false, safety: "3.0/5 (Unattended)", allowed: ["car"], lastUpdated: "Offline", notice: "Unverified — check towing rules before parking." },
    
    { id: 9, name: "Juhu Beach BMC Pay & Park", address: "Juhu Tara Road, Juhu", lat: 19.0988, lng: 72.8266, type: "public", status: "verified", spacesAvailable: 120, totalSpaces: 400, price: "₹50/hr", priceVal: 50, hours: "06:00-02:00", open24: true, covered: false, safety: "4.0/5 (BMC Booth)", allowed: ["car", "bike"], lastUpdated: "5 mins ago" },
    { id: 15, name: "Novotel Juhu Private Plaza", address: "Balraj Sahni Rd, Juhu", lat: 19.1050, lng: 72.8250, type: "public", status: "verified", spacesAvailable: 8, totalSpaces: 50, price: "₹120/hr", priceVal: 120, hours: "24 Hours", open24: true, covered: true, safety: "5.0/5 (Hotel Valet)", allowed: ["car"], lastUpdated: "Just now" },
    { id: 16, name: "Juhu Tara Roadside Strip", address: "Juhu Tara Rd", lat: 19.0995, lng: 72.8275, type: "unverified", status: "unverified", spacesAvailable: "?", totalSpaces: "?", price: "Free", priceVal: 0, hours: "24 Hours", open24: true, covered: false, safety: "2.5/5 (Unattended)", allowed: ["car", "bike"], lastUpdated: "Offline", notice: "Unverified — check for No Parking signs." }
];

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
    map = L.map('map', { zoomControl: false }).setView(destinations.mpstme.coords, 15);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri'
    }).addTo(map);

    document.getElementById('destination').addEventListener('change', updateApp);
    document.getElementById('scenario-selector').addEventListener('change', updateApp);
    document.getElementById('vehicle-type').addEventListener('change', updateApp);
    document.getElementById('arrival-time').addEventListener('change', updateApp);
    
    renderTransactions();
    updateApp();
}

// ---------------- WALLET LOGIC ----------------
function updateWalletUI() {
    document.getElementById('header-wallet-balance').innerText = `₹${walletBalance}`;
    document.getElementById('wallet-modal-balance').innerText = `₹${walletBalance}`;
    document.getElementById('modal-wallet-balance').innerText = `₹${walletBalance}`;
    renderTransactions();
}

function renderTransactions() {
    const container = document.getElementById('wallet-transactions');
    container.innerHTML = transactions.map(t => `
        <div class="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-xs">
            <div>
                <p class="font-bold text-slate-800">${t.title}</p>
                <p class="text-[10px] text-slate-400">${t.time}</p>
            </div>
            <span class="font-extrabold ${t.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}">
                ${t.type === 'credit' ? '+' : '-'}₹${Math.abs(t.amount)}
            </span>
        </div>
    `).join('');
}

function openWalletModal() {
    updateWalletUI();
    document.getElementById('wallet-modal').classList.remove('hidden');
}

function closeWalletModal() {
    document.getElementById('wallet-modal').classList.add('hidden');
}

function addMoney(amount) {
    walletBalance += amount;
    transactions.unshift({
        title: "UPI Instant Top-Up",
        amount: amount,
        time: "Just now",
        type: "credit"
    });
    updateWalletUI();
}

function addCustomMoney() {
    const input = document.getElementById('custom-topup');
    const val = parseInt(input.value);
    if (val && val > 0) {
        addMoney(val);
        input.value = '';
    }
}

// ---------------- LOGIN / PERSONA LOGIC ----------------
function openLoginModal() {
    document.getElementById('login-modal').classList.remove('hidden');
}

function closeLoginModal() {
    document.getElementById('login-modal').classList.add('hidden');
}

function switchUser(persona) {
    if (persona === 'dheer') {
        currentUser = { name: "Dheer Sheth", initials: "DS", role: "visitor", hasCampusPermit: false };
    } else if (persona === 'ayush') {
        currentUser = { name: "Ayush Krishnan", initials: "AK", role: "nmims", hasCampusPermit: true };
    }
    applyUserSwitch();
}

function handleCustomLogin(e) {
    e.preventDefault();
    const name = document.getElementById('login-name').value.trim();
    const role = document.getElementById('login-role').value;
    const parts = name.split(' ');
    const initials = (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
    
    currentUser = {
        name: name,
        initials: initials,
        role: role,
        hasCampusPermit: role === 'nmims'
    };
    applyUserSwitch();
}

function applyUserSwitch() {
    document.getElementById('header-username').innerText = currentUser.name;
    document.getElementById('user-avatar').innerText = currentUser.initials;
    document.getElementById('wallet-card-holder').innerText = `HOLDER: ${currentUser.name.toUpperCase()}`;
    
    const badge = document.getElementById('user-permit-badge');
    if (currentUser.hasCampusPermit) {
        badge.innerText = "✓ NMIMS Campus Permit";
        badge.className = "text-[10px] bg-emerald-100 text-emerald-800 border border-emerald-300 px-2 py-0.5 rounded-full font-bold";
    } else {
        badge.innerText = "Public / Visitor Account";
        badge.className = "text-[10px] bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full font-semibold";
    }
    
    closeLoginModal();
    updateApp();
}

// ---------------- HOLD SPOT LOGIC ----------------
function computeLeaveTime() {
    const arrInput = document.getElementById('arrival-time').value || "09:00";
    let [hrs, mins] = arrInput.split(':').map(Number);
    let totalMins = hrs * 60 + mins - 25; // 25 mins commute buffer
    if (totalMins < 0) totalMins += 24 * 60;
    let lHrs = Math.floor(totalMins / 60);
    let lMins = totalMins % 60;
    let ampm = lHrs >= 12 ? 'PM' : 'AM';
    let dispHrs = lHrs % 12 || 12;
    return `${String(dispHrs).padStart(2, '0')}:${String(lMins).padStart(2, '0')} ${ampm}`;
}

function openHoldModal(lotId) {
    const lot = parkingData.find(p => p.id === lotId);
    if (!lot) return;
    pendingHoldLot = lot;

    const fee = lot.priceVal !== null && lot.priceVal < 500 ? lot.priceVal : 0;
    const holdFee = 10;
    const total = fee + holdFee;
    pendingHoldLot.computedTotal = total;

    document.getElementById('modal-lot-name').innerText = lot.name;
    document.getElementById('modal-lot-address').innerText = lot.address;
    document.getElementById('modal-leave-time').innerText = computeLeaveTime();
    document.getElementById('modal-parking-fee').innerText = `₹${fee}`;
    document.getElementById('modal-hold-fee').innerText = `₹${holdFee}`;
    document.getElementById('modal-total-cost').innerText = `₹${total}`;
    document.getElementById('modal-wallet-balance').innerText = `₹${walletBalance}`;

    const warn = document.getElementById('modal-insufficient-warning');
    const btn = document.getElementById('confirm-hold-btn');
    if (walletBalance < total) {
        warn.classList.remove('hidden');
        btn.disabled = true;
        btn.className = "flex-1 py-2.5 bg-slate-300 text-slate-500 font-bold rounded-xl text-xs cursor-not-allowed";
    } else {
        warn.classList.add('hidden');
        btn.disabled = false;
        btn.className = "flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg text-xs";
    }

    document.getElementById('hold-modal').classList.remove('hidden');
}

function closeHoldModal() {
    document.getElementById('hold-modal').classList.add('hidden');
}

function confirmHoldPayment() {
    if (!pendingHoldLot) return;
    const cost = pendingHoldLot.computedTotal;
    if (walletBalance < cost) return;

    // Deduct from wallet
    walletBalance -= cost;
    transactions.unshift({
        title: `Spot Hold: ${pendingHoldLot.name}`,
        amount: cost,
        time: "Just now",
        type: "debit"
    });

    // Reduce available spaces by 1
    if (typeof pendingHoldLot.spacesAvailable === 'number' && pendingHoldLot.spacesAvailable > 0) {
        pendingHoldLot.spacesAvailable -= 1;
    }

    updateWalletUI();
    closeHoldModal();
    startActiveHoldBanner(pendingHoldLot);
    updateApp();
}

function startActiveHoldBanner(lot) {
    activeHold = lot;
    document.getElementById('banner-lot-name').innerText = lot.name;
    document.getElementById('banner-leave-time').innerText = computeLeaveTime();
    document.getElementById('active-hold-banner').classList.remove('hidden');

    if (holdTimerInterval) clearInterval(holdTimerInterval);
    let remainingSecs = 15 * 60;
    holdTimerInterval = setInterval(() => {
        remainingSecs--;
        if (remainingSecs <= 0) {
            cancelActiveHold();
            return;
        }
        const m = String(Math.floor(remainingSecs / 60)).padStart(2, '0');
        const s = String(remainingSecs % 60).padStart(2, '0');
        document.getElementById('banner-countdown').innerText = `${m}:${s}`;
    }, 1000);
}

function cancelActiveHold() {
    if (holdTimerInterval) clearInterval(holdTimerInterval);
    document.getElementById('active-hold-banner').classList.add('hidden');
    activeHold = null;
}

// ---------------- MAIN RECOMMENDATION & MAP ENGINE ----------------
function updateApp() {
    const destKey = document.getElementById('destination').value;
    const scenario = document.getElementById('scenario-selector').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    
    const target = destinations[destKey];
    
    if (destMarker) map.removeLayer(destMarker);
    markers.forEach(m => map.removeLayer(m));
    markers = [];
    
    const dIcon = L.divIcon({
        className: 'custom-icon',
        html: `<div class="bg-slate-900 text-emerald-400 px-2.5 py-1.5 rounded-lg border-2 border-emerald-400 shadow-xl font-black text-[11px] text-center whitespace-nowrap transform -translate-y-4">🎯 ${target.name.toUpperCase()}</div>`,
        iconSize: [130, 34]
    });
    destMarker = L.marker(target.coords, {icon: dIcon, zIndexOffset: 1000}).addTo(map);
    
    // Clone & enrich data with distance and recommendation reason
    let processedData = parkingData.map(p => {
        let dist = getDistance(target.coords[0], target.coords[1], p.lat, p.lng);
        let walkMins = Math.max(1, Math.round((dist * 1000) / 80));
        let legAccessible = (p.type !== 'restricted') || currentUser.hasCampusPermit;
        
        let reason = "Verified lot with open bays & quick walk";
        if (p.type === 'restricted' && currentUser.hasCampusPermit) reason = "Unlocked via your NMIMS Campus Permit";
        else if (p.type === 'restricted' && !currentUser.hasCampusPermit) reason = "Restricted: Requires NMIMS Permit";
        else if (p.status === 'unverified') reason = "Unverified live feed — check on arrival";
        else if (p.covered) reason = "Covered facility with verified security";

        return {
            ...p,
            distanceKm: dist,
            walkMins: walkMins,
            legAccessible: legAccessible,
            reason: reason
        };
    });
    
    // Filter by vehicle type
    processedData = processedData.filter(p => p.allowed.includes(vehicleType));
    
    // Apply Scenario Filtering & Ranking Rules
    if (scenario === 'view_all') {
        // Show ALL 17 spaces irrespective of availability or status
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        document.getElementById('results-title').innerText = "All Parking Facilities";
        document.getElementById('results-subtitle').innerText = "Showing every lot regardless of status";
    } 
    else if (scenario === 'college_rush') {
        processedData.sort((a, b) => {
            if (a.legAccessible !== b.legAccessible) return a.legAccessible ? -1 : 1;
            return a.distanceKm - b.distanceKm;
        });
        processedData = processedData.slice(0, 6);
        document.getElementById('results-title').innerText = "Morning Rush Matches";
        document.getElementById('results-subtitle').innerText = "Prioritising fast walk time to lecture";
    }
    else if (scenario === 'late_arrival') {
        processedData = processedData.filter(p => p.open24 && p.status === 'verified');
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        document.getElementById('results-title').innerText = "24/7 Confirmed Safe Lots";
        document.getElementById('results-subtitle').innerText = "Open late with verified security";
    }
    else if (scenario === 'rainy') {
        processedData = processedData.filter(p => p.covered === true && p.status === 'verified');
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        document.getElementById('results-title').innerText = "Covered Rain-Safe Lots";
        document.getElementById('results-subtitle').innerText = "Protected from rain + shortest walk";
    }
    else if (scenario === 'budget') {
        processedData = processedData.filter(p => p.priceVal !== null && p.legAccessible);
        processedData.sort((a, b) => (a.priceVal - b.priceVal) || (a.distanceKm - b.distanceKm));
        processedData = processedData.slice(0, 6);
        document.getElementById('results-title').innerText = "Budget-Friendly Options";
        document.getElementById('results-subtitle').innerText = "Ranked by lowest hourly fee";
    }
    else if (scenario === 'restricted') {
        // Specifically highlight Campus Restricted vs Public Alternatives
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        processedData = processedData.slice(0, 5);
        document.getElementById('results-title').innerText = "Permit vs Public Options";
        document.getElementById('results-subtitle').innerText = currentUser.hasCampusPermit ? "Permit Active: Campus Unlocked" : "Visitor Mode: Public Ranked First";
    }
    else if (scenario === 'no_data') {
        processedData = processedData.filter(p => p.status === 'unverified');
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        document.getElementById('results-title').innerText = "Unverified / Offline Lots";
        document.getElementById('results-subtitle').innerText = "Live feed unavailable — navigate to check";
    }
    else if (scenario === 'full') {
        processedData = processedData.filter(p => p.status === 'verified' && p.legAccessible);
        processedData.sort((a, b) => a.distanceKm - b.distanceKm);
        processedData = processedData.slice(0, 5);
        if (processedData.length > 0) {
            processedData[0] = { ...processedData[0], spacesAvailable: 0, reason: "LOT FULL — Redirecting to next best option below" };
            if (processedData[1]) processedData[1].reason = "★ Top Recommended Alternative (Open bays)";
        }
        document.getElementById('results-title').innerText = "Overflow Alternatives";
        document.getElementById('results-subtitle').innerText = "Closest lot is full — rerouting";
    }
    else {
        // Default Smart Match: Legally accessible & verified first, then distance
        processedData.sort((a, b) => {
            const aScore = (a.legAccessible ? 0 : 100) + (a.status === 'verified' ? 0 : 50) + (a.spacesAvailable === 0 ? 80 : 0) + a.distanceKm;
            const bScore = (b.legAccessible ? 0 : 100) + (b.status === 'verified' ? 0 : 50) + (b.spacesAvailable === 0 ? 80 : 0) + b.distanceKm;
            return aScore - bScore;
        });
        processedData = processedData.slice(0, 6);
        document.getElementById('results-title').innerText = "Best Smart Matches";
        document.getElementById('results-subtitle').innerText = "Ranked by legality, availability & walk";
    }

    document.getElementById('results-count').innerText = processedData.length;
    map.setView(target.coords, scenario === 'view_all' ? 13 : 15);

    // Update Insights Panel
    let occ = 82; let cong = "Mod";
    if (destKey === 'infiniti' || scenario === 'college_rush') { occ = 94; cong = "High"; }
    else if (destKey === 'juhu') { occ = 89; cong = "High"; }
    else if (scenario === 'late_arrival') { occ = 42; cong = "Low"; }
    else if (scenario === 'full') { occ = 98; cong = "Severe"; }
    
    document.getElementById('insight-occupancy').innerText = `${occ}%`;
    document.getElementById('insight-congestion').innerText = cong;
    const bar = document.getElementById('occupancy-bar');
    bar.style.width = `${occ}%`;
    bar.className = occ > 90 ? "bg-red-500 h-1.5 rounded-full transition-all duration-700" : (occ > 70 ? "bg-orange-500 h-1.5 rounded-full transition-all duration-700" : "bg-emerald-500 h-1.5 rounded-full transition-all duration-700");

    const container = document.getElementById('recommendations-container');
    container.innerHTML = '';

    processedData.forEach((p, idx) => {
        let bgClass = 'bg-emerald-500 border-emerald-200 text-white'; 
        let labelClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
        let labelText = 'Verified Open';
        
        if (p.spacesAvailable === 0) {
            bgClass = 'bg-red-500 border-red-200 text-white'; labelClass = 'bg-red-100 text-red-700 border-red-300'; labelText = 'LOT FULL';
        } else if (p.type === 'restricted') {
            bgClass = 'bg-orange-500 border-orange-200 text-white'; labelClass = 'bg-orange-100 text-orange-800 border-orange-300'; labelText = currentUser.hasCampusPermit ? 'Permit Valid' : 'Permit Only';
        } else if (p.type === 'residential') {
            bgClass = 'bg-purple-600 border-purple-200 text-white'; labelClass = 'bg-purple-100 text-purple-800 border-purple-300'; labelText = 'Society Visitor';
        } else if (p.status === 'unverified') {
            bgClass = 'bg-slate-500 border-slate-300 text-white'; labelClass = 'bg-slate-200 text-slate-700 border-slate-300'; labelText = 'Unverified';
        }
        
        const icon = L.divIcon({
            className: 'custom-icon',
            html: `<div class="${bgClass} w-8 h-8 flex items-center justify-center rounded-full border-2 shadow-lg font-extrabold text-xs ring-2 ring-white/60 transition transform hover:scale-110">P</div>`,
            iconSize: [32, 32]
        });
        const marker = L.marker([p.lat, p.lng], {icon: icon}).addTo(map);
        
        const gmapsLink = `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}`;
        marker.bindPopup(`
            <div class="font-sans min-w-[170px]">
                <span class="text-[9px] ${labelClass} px-1.5 py-0.5 rounded font-bold uppercase">${labelText}</span>
                <strong class="text-sm block mt-1 text-slate-800">${p.name}</strong>
                <p class="text-[11px] text-slate-500 mb-2">${p.address}</p>
                <div class="text-xs font-bold text-emerald-700 mb-2">${p.price} • ${p.walkMins} min walk</div>
                <div class="flex space-x-1.5">
                    <button onclick="openHoldModal(${p.id})" class="flex-1 text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded font-bold">Hold Spot</button>
                    <a href="${gmapsLink}" target="_blank" class="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 px-2.5 py-1.5 rounded font-bold no-underline">Route ↗</a>
                </div>
            </div>
        `);
        markers.push(marker);

        const spotsText = p.spacesAvailable === 0 ? '0 bays (Full)' : (p.spacesAvailable === '?' ? 'Live count N/A' : `${p.spacesAvailable} / ${p.totalSpaces} bays`);
        const spotsColor = p.spacesAvailable === 0 ? 'text-red-600' : (p.status === 'unverified' ? 'text-slate-600' : 'text-emerald-600');
        const walkDisplay = p.walkMins < 45 ? `${p.walkMins} min walk (${p.distanceKm.toFixed(1)} km)` : `${p.distanceKm.toFixed(1)} km drive`;
        
        const canHold = p.spacesAvailable !== 0 && p.status === 'verified' && p.legAccessible;

        let cardHtml = `
            <div class="bg-white border ${idx === 0 && canHold ? 'border-2 border-emerald-500' : 'border-slate-200'} rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer" onclick="map.setView([${p.lat}, ${p.lng}], 16)">
                <div class="flex justify-between items-start mb-1">
                    <div class="flex items-center space-x-1.5">
                        ${idx === 0 && canHold ? `<span class="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-black uppercase">Top Pick</span>` : ''}
                        <h4 class="font-extrabold text-sm text-slate-800 leading-tight">${p.name}</h4>
                    </div>
                    <span class="text-[9px] ${labelClass} px-2 py-0.5 rounded border font-bold uppercase tracking-wider ml-2 shrink-0">${labelText}</span>
                </div>
                <div class="text-[11px] text-slate-500 mb-2">${p.address}</div>
                
                <div class="mb-2.5 text-[11px] bg-emerald-50/70 border border-emerald-200/70 px-2.5 py-1 rounded text-emerald-900 font-medium">
                    💡 <strong>Why:</strong> ${p.reason}
                </div>

                ${p.notice ? `<div class="mb-2.5 text-[11px] bg-orange-50 border-l-2 border-orange-400 p-2 text-orange-800 rounded-r"><strong>Note:</strong> ${p.notice}</div>` : ''}

                <div class="grid grid-cols-2 gap-y-2 gap-x-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px]">
                    <div>
                        <span class="block text-slate-400 text-[10px] uppercase font-bold">Availability</span>
                        <span class="font-extrabold ${spotsColor}">${spotsText}</span>
                    </div>
                    <div>
                        <span class="block text-slate-400 text-[10px] uppercase font-bold">To ${target.name}</span>
                        <span class="font-bold text-slate-700">${walkDisplay}</span>
                    </div>
                    <div>
                        <span class="block text-slate-400 text-[10px] uppercase font-bold">Charges & Hours</span>
                        <span class="font-bold text-slate-700">${p.price} • ${p.hours}</span>
                    </div>
                    <div>
                        <span class="block text-slate-400 text-[10px] uppercase font-bold">Safety Score</span>
                        <span class="font-bold text-blue-700 truncate block">${p.safety}</span>
                    </div>
                </div>
                
                <div class="flex space-x-2">
                    <button onclick="event.stopPropagation(); ${canHold ? `openHoldModal(${p.id})` : ''}" class="${canHold ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow' : 'bg-slate-100 text-slate-400 cursor-not-allowed'} flex-1 text-xs font-bold py-2 rounded-lg transition text-center">
                        ${canHold ? 'Hold Spot (15m)' : (p.type === 'restricted' && !currentUser.hasCampusPermit ? 'Permit Required' : 'Hold Unavailable')}
                    </button>
                    <a href="${gmapsLink}" target="_blank" onclick="event.stopPropagation();" class="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 px-3 py-2 flex items-center justify-center rounded-lg transition text-xs font-bold">
                        Directions ↗
                    </a>
                </div>
            </div>
        `;
        container.innerHTML += cardHtml;
    });
}

window.onload = initMap;
