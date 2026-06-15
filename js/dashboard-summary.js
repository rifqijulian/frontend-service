// Logic to calculate and render statistics, upcoming list and overdue warnings on the Dashboard

function updateDashboardSummary(data) {
    if (!data) return;

    // 1. Calculate statistics
    // Count unique vehicles based on plat_nomor
    const uniquePlats = new Set(data.map(item => item.plat_nomor.trim().toUpperCase()));
    const totalVehicles = uniquePlats.size;

    const hariIniObj = new Date();
    // Set date string YYYY-MM-DD
    const tanggalHariIni = `${hariIniObj.getFullYear()}-${String(hariIniObj.getMonth() + 1).padStart(2, '0')}-${String(hariIniObj.getDate()).padStart(2, '0')}`;

    let statAmanCount = 0;
    let statSegeraCount = 0;
    let statTerlambatCount = 0;

    const upcomingSchedules = [];
    const overdueNotifications = [];

    data.forEach(item => {
        const tglBerikutnyaObj = new Date(item.tanggal_berikutnya);
        const formatTglBerikutnya = `${tglBerikutnyaObj.getFullYear()}-${String(tglBerikutnyaObj.getMonth() + 1).padStart(2, '0')}-${String(tglBerikutnyaObj.getDate()).padStart(2, '0')}`;

        // Difference in days between next service date and today
        const diffTime = tglBerikutnyaObj.getTime() - hariIniObj.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (formatTglBerikutnya < tanggalHariIni) {
            // Overdue
            statTerlambatCount++;
            overdueNotifications.push(item);
        } else if (diffDays <= 7) {
            // Soon (within 7 days)
            statSegeraCount++;
            upcomingSchedules.push(item);
        } else {
            // Safe
            statAmanCount++;
            upcomingSchedules.push(item);
        }
    });

    // 2. Render statistics counters
    const totalVehiclesEl = document.getElementById('stat-total-kendaraan');
    if (totalVehiclesEl) totalVehiclesEl.textContent = totalVehicles;

    const statAmanEl = document.getElementById('stat-aman');
    if (statAmanEl) statAmanEl.textContent = statAmanCount;

    const statSegeraEl = document.getElementById('stat-segera');
    if (statSegeraEl) statSegeraEl.textContent = statSegeraCount;

    const statTerlambatEl = document.getElementById('stat-terlambat');
    if (statTerlambatEl) statTerlambatEl.textContent = statTerlambatCount;

    // 3. Render upcoming schedules (Jadwal Servis Berikutnya)
    const listJadwalEl = document.getElementById('list-jadwal-berikutnya');
    if (listJadwalEl) {
        listJadwalEl.innerHTML = '';
        if (upcomingSchedules.length === 0) {
            listJadwalEl.innerHTML = '<p class="text-on-surface-variant text-xs">Tidak ada jadwal servis mendatang.</p>';
        } else {
            // Sort by next date ascending (soonest first)
            upcomingSchedules.sort((a, b) => new Date(a.tanggal_berikutnya) - new Date(b.tanggal_berikutnya));
            
            upcomingSchedules.slice(0, 5).forEach(item => {
                const tglBerikutnyaObj = new Date(item.tanggal_berikutnya);
                const formatTglBerikutnya = `${tglBerikutnyaObj.getFullYear()}-${String(tglBerikutnyaObj.getMonth() + 1).padStart(2, '0')}-${String(tglBerikutnyaObj.getDate()).padStart(2, '0')}`;
                
                listJadwalEl.innerHTML += `
                    <div class="flex justify-between items-center border-b border-dashed border-outline-variant pb-2 last:border-0 last:pb-0">
                        <div>
                            <p class="font-semibold text-on-surface text-xs leading-snug">${item.nama_motor}</p>
                            <p class="text-[9px] text-on-surface-variant uppercase tracking-wider">${item.plat_nomor} • ${item.jenis_servis}</p>
                        </div>
                        <span class="text-xs font-bold text-primary whitespace-nowrap">${formatTglBerikutnya}</span>
                    </div>
                `;
            });
        }
    }

    // 4. Render overdue warnings (Notifikasi Servis)
    const listNotifikasiEl = document.getElementById('list-notifikasi-servis');
    if (listNotifikasiEl) {
        listNotifikasiEl.innerHTML = '';
        if (overdueNotifications.length === 0) {
            listNotifikasiEl.innerHTML = '<p class="text-on-surface-variant text-xs">Tidak ada notifikasi aktif.</p>';
        } else {
            overdueNotifications.forEach(item => {
                const tglBerikutnyaObj = new Date(item.tanggal_berikutnya);
                const formatTglBerikutnya = `${tglBerikutnyaObj.getFullYear()}-${String(tglBerikutnyaObj.getMonth() + 1).padStart(2, '0')}-${String(tglBerikutnyaObj.getDate()).padStart(2, '0')}`;

                listNotifikasiEl.innerHTML += `
                    <div class="flex items-start gap-2 bg-error/10 border border-error/20 p-2.5 rounded text-error leading-tight">
                        <span class="material-symbols-outlined text-[16px] mt-0.5 animate-pulse">warning</span>
                        <div>
                            <p class="font-bold text-xs uppercase">${item.nama_motor}</p>
                            <p class="text-[10px] mt-0.5 opacity-90">Jadwal servis terlewat sejak ${formatTglBerikutnya}</p>
                        </div>
                    </div>
                `;
            });
        }
    }
}
