function initWorkshops() {

    const map = L.map('ws-map').setView([-0.9471, 100.4172], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    const workshops = [
        {
            nama: "AutoPro Service Center",
            lat: -0.9471,
            lng: 100.4172
        },
        {
            nama: "Bengkel Jaya Motor",
            lat: -0.9420,
            lng: 100.4210
        }
    ];

    const list = document.getElementById("ws-list");

    workshops.forEach(ws => {

        L.marker([ws.lat, ws.lng])
            .addTo(map)
            .bindPopup(`<b>${ws.nama}</b>`);

        list.innerHTML += `
            <div class="glass-panel p-4 rounded">
                <h3 class="font-bold">${ws.nama}</h3>
                <a
                    href="https://www.google.com/maps?q=${ws.lat},${ws.lng}"
                    target="_blank"
                    class="text-green-400"
                >
                    Buka di Google Maps
                </a>
            </div>
        `;
    });

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

function tutupWsModal() {
    document.getElementById("ws-modal").classList.add("hidden");
}