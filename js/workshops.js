// Workshops list and map logic

const workshops = [
    {
        nama: "AutoPro Service Center",
        lat: -0.9471,
        lng: 100.4172,
        layanan: "Ganti Oli, Tune Up, Turun Mesin, Sistem Listrik, Diagnostic Scan",
        telepon: "0812-3456-7890",
        jamBuka: "08.00 - 17.00"
    },
    {
        nama: "Bengkel Jaya Motor",
        lat: -0.9420,
        lng: 100.4210,
        layanan: "Ganti Oli, Servis Karburator & Injeksi, Ganti Ban, Perbaikan Rem",
        telepon: "0819-8765-4321",
        jamBuka: "09.00 - 18.00"
    }
];

let map;
let markers = [];

function initWorkshops() {
    map = L.map('ws-map').setView([-0.9471, 100.4172], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    renderWorkshops(workshops);

    const searchInput = document.getElementById("ws-search");
    if (searchInput) {
        searchInput.addEventListener("input", (e) => {
            const query = e.target.value.toLowerCase();
            const filtered = workshops.filter(ws => 
                ws.nama.toLowerCase().includes(query) || 
                ws.layanan.toLowerCase().includes(query)
            );
            renderWorkshops(filtered);
        });
    }

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            L.marker([lat, lng])
                .addTo(map)
                .bindPopup("Lokasi Anda");

            map.setView([lat, lng], 14);
        });
    }
}

function renderWorkshops(data) {
    const list = document.getElementById("ws-list");
    if (!list) return;

    list.innerHTML = "";
    
    // Clear old markers
    markers.forEach(m => map.removeLayer(m));
    markers = [];

    if (data.length === 0) {
        list.innerHTML = `<p class="text-on-surface-variant text-sm p-4 text-center">Bengkel tidak ditemukan.</p>`;
        return;
    }

    data.forEach(ws => {
        const marker = L.marker([ws.lat, ws.lng])
            .addTo(map)
            .bindPopup(`<b>${ws.nama}</b><br><span style="font-size:11px;">${ws.layanan}</span>`);
        markers.push(marker);

        const escapedNama = ws.nama.replace(/'/g, "\\'");

        list.innerHTML += `
            <div class="glass-panel p-4 rounded border border-outline-variant hover:border-primary transition-all flex flex-col gap-2">
                <h3 class="font-bold text-on-surface text-sm uppercase">${ws.nama}</h3>
                <p class="text-xs text-on-surface-variant line-clamp-1">${ws.layanan}</p>
                <div class="flex items-center gap-3 mt-1.5 pt-2 border-t border-outline-variant/50">
                    <a
                        href="https://www.google.com/maps?q=${ws.lat},${ws.lng}"
                        target="_blank"
                        class="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                        <span class="material-symbols-outlined text-sm">directions</span> Maps
                    </a>
                    <button
                        onclick="lihatDetailBengkel('${escapedNama}')"
                        class="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                    >
                        <span class="material-symbols-outlined text-sm">build</span> Detail Layanan
                    </button>
                </div>
            </div>
        `;
    });
}

function lihatDetailBengkel(nama) {
    const ws = workshops.find(item => item.nama === nama);
    if (!ws) return;

    document.getElementById("ws-modal-title").innerHTML = `
        <span class="material-symbols-outlined text-primary">build</span> Detail Layanan
    `;

    document.getElementById("ws-modal-body").innerHTML = `
        <div class="space-y-3">
            <div>
                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Nama Bengkel</p>
                <p class="text-sm font-bold text-on-surface mt-1 uppercase text-primary">${ws.nama}</p>
            </div>
            <div>
                <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Layanan Utama</p>
                <p class="text-sm font-medium text-on-surface mt-1">${ws.layanan}</p>
            </div>
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Jam Operasional</p>
                    <p class="text-sm font-medium text-on-surface mt-1">${ws.jamBuka}</p>
                </div>
                <div>
                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Telepon</p>
                    <p class="text-sm font-medium text-on-surface mt-1">${ws.telepon}</p>
                </div>
            </div>
            <div class="pt-3 border-t border-outline-variant mt-2">
                <a href="https://www.google.com/maps?q=${ws.lat},${ws.lng}" target="_blank"
                   class="w-full bg-primary text-[#000000] font-bold text-center block py-2.5 rounded hover-glow transition-all uppercase text-[11px] tracking-wider">
                    Rute Navigasi Google Maps
                </a>
            </div>
        </div>
    `;

    document.getElementById("ws-modal").classList.remove("hidden");
}

function tutupWsModal() {
    document.getElementById("ws-modal").classList.add("hidden");
}