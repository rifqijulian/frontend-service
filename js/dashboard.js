// Dashboard management logic

// Fetch and render the list of services on page load
async function ambilDaftarServis() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const respon = await fetch(`${URL_API}/servis`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await respon.json();
        
        const wadahKartu = document.getElementById('list-servis-motor');
        if (!wadahKartu) return;

        wadahKartu.innerHTML = '';

        if (data.length === 0) {
            wadahKartu.innerHTML = `
                <div class="col-span-full flex flex-col items-center justify-center bg-surface-container-low border border-dashed border-outline-variant rounded p-12 text-center">
                    <div class="w-16 h-16 bg-surface-container-high rounded-full flex items-center justify-center mb-4 border border-outline-variant">
                        <span class="material-symbols-outlined text-3xl text-on-surface-variant">assignment</span>
                    </div>
                    <h4 class="text-lg font-bold text-on-surface mb-2 uppercase">Belum Ada Catatan Servis</h4>
                    <p class="text-on-surface-variant max-w-sm text-sm">
                        Garasi Anda kosong. Tambahkan jadwal perawatan motor Anda pada panel kiri untuk melacak status servis.
                    </p>
                </div>
            `;
            return;
        }

        const hariIniObj = new Date();
        // Set date string YYYY-MM-DD
        const tanggalHariIni = `${hariIniObj.getFullYear()}-${String(hariIniObj.getMonth() + 1).padStart(2, '0')}-${String(hariIniObj.getDate()).padStart(2, '0')}`;

        data.forEach(item => {
            const tglServisObj = new Date(item.tanggal_servis);
            const formatTglServis = `${tglServisObj.getFullYear()}-${String(tglServisObj.getMonth() + 1).padStart(2, '0')}-${String(tglServisObj.getDate()).padStart(2, '0')}`;

            const tglBerikutnyaObj = new Date(item.tanggal_berikutnya);
            const formatTglBerikutnya = `${tglBerikutnyaObj.getFullYear()}-${String(tglBerikutnyaObj.getMonth() + 1).padStart(2, '0')}-${String(tglBerikutnyaObj.getDate()).padStart(2, '0')}`;

            // Check status based on dates
            const statusServis = formatTglBerikutnya < tanggalHariIni ? 'Waktunya Servis!' : 'Kondisi Aman';
            
            if (statusServis === 'Waktunya Servis!') {
                setTimeout(() => tampilkanNotifikasiServis(item.nama_motor, item.plat_nomor), 500);
            }
            
            // Neon indicators and styling based on status
            const statusBorder = statusServis === 'Waktunya Servis!' ? 'border-error/40 hover:border-error' : 'border-outline-variant hover:border-primary';
            const statusGlow = statusServis === 'Waktunya Servis!' ? 'hover:shadow-[0_0_15px_rgba(255,180,171,0.2)]' : 'hover:shadow-[0_0_15px_rgba(85,234,77,0.2)]';
            const accentLine = statusServis === 'Waktunya Servis!' ? 'bg-error' : 'bg-primary';
            
            const badgeBg = statusServis === 'Waktunya Servis!' ? 'bg-error/15 text-error border-error/30' : 'bg-primary/10 text-primary border-primary/20';
            const badgeIcon = statusServis === 'Waktunya Servis!' ? 'error' : 'check_circle';

            wadahKartu.innerHTML += `
                <div class="group bg-surface-container-low p-6 rounded border ${statusBorder} ${statusGlow} transition-all duration-300 relative overflow-hidden flex flex-col justify-between mech-border">
                    <!-- Accent Strip -->
                    <div class="absolute top-0 left-0 w-full h-1 ${accentLine}"></div>
                    
                    <div>
                        <div class="flex justify-between items-start mb-4 mt-2">
                            <h4 class="font-headline-md text-md font-bold text-on-surface pr-2 leading-tight">
                                ${item.nama_motor}
                            </h4>
                            <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded border text-[11px] uppercase tracking-wider font-semibold ${badgeBg} whitespace-nowrap">
                                <span class="material-symbols-outlined text-[12px]">${badgeIcon}</span>
                                ${statusServis}
                            </span>
                        </div>
                        
                        <div class="inline-flex items-center px-3 py-1 bg-surface-container-high border border-outline-variant rounded font-semibold text-on-surface text-sm tracking-wider mb-5 uppercase">
                            <span class="material-symbols-outlined text-sm text-on-surface-variant mr-1.5">directions_car</span>
                            ${item.plat_nomor}
                        </div>
                        
                        <div class="space-y-3 text-sm">
                            <div class="flex items-start gap-2.5">
                                <span class="material-symbols-outlined text-sm text-primary mt-0.5">build</span>
                                <div class="flex-1">
                                    <p class="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">Perbaikan</p>
                                    <p class="font-medium text-on-surface leading-snug">${item.jenis_servis}</p>
                                </div>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-sm text-on-surface-variant">calendar_today</span>
                                <div class="flex-1 flex justify-between items-center border-b border-dashed border-outline-variant pb-1">
                                    <span class="text-on-surface-variant text-[12px]">Servis Terakhir</span>
                                    <span class="font-semibold text-on-surface text-[12px]">${formatTglServis}</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-2.5">
                                <span class="material-symbols-outlined text-sm text-primary">event_upcoming</span>
                                <div class="flex-1 flex justify-between items-center">
                                    <span class="text-on-surface-variant text-[12px]">Jadwal Kembali</span>
                                    <span class="font-bold text-primary text-[12px]">${formatTglBerikutnya}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="flex justify-end gap-2 mt-6 pt-4 border-t border-outline-variant">
                        <button onclick="siapkanEditServis('${item.id}', '${item.nama_motor.replace(/'/g, "\\'")}', '${item.plat_nomor.replace(/'/g, "\\'")}', '${item.jenis_servis.replace(/'/g, "\\'")}', '${formatTglServis}', '${formatTglBerikutnya}')" 
                                class="text-on-surface-variant hover:text-primary hover:bg-surface-container-high px-3 py-1.5 rounded text-sm font-semibold transition-all flex items-center gap-1 border border-transparent hover:border-outline-variant">
                            <span class="material-symbols-outlined text-sm">edit</span> Ubah
                        </button>
                        <button onclick="hapusDataServis('${item.id}')" 
                                class="text-on-surface-variant hover:text-error hover:bg-error-container/10 px-3 py-1.5 rounded text-sm font-semibold transition-all flex items-center gap-1 border border-transparent hover:border-error/20">
                            <span class="material-symbols-outlined text-sm">delete</span> Hapus
                        </button>
                    </div>
                </div>
            `;
        });
    } catch (error) {
        showToast('Gagal memuat daftar servis!', 'error');
    }
}

// Display temporary alert banner for motorcycles that require urgent maintenance
function tampilkanNotifikasiServis(namaMotor, platNomor) {
    let container = document.getElementById('wadah-notifikasi');
    if (!container) {
        container = document.createElement('div');
        container.id = 'wadah-notifikasi';
        container.className = 'fixed bottom-5 left-5 z-50 flex flex-col gap-3';
        document.body.appendChild(container);
    }

    // Check if notification is already displayed to avoid duplicates
    const idNotif = `notif-${platNomor.replace(/\s+/g, '-')}`;
    if (document.getElementById(idNotif)) return;

    const notif = document.createElement('div');
    notif.id = idNotif;
    notif.className = 'bg-surface-container-low border-l-4 border-error p-4 rounded border border-outline-variant shadow-2xl w-80 transform -translate-x-full transition-all duration-500 flex items-start gap-3 glass-panel';
    
    notif.innerHTML = `
        <div class="bg-error/15 text-error p-2 rounded shrink-0">
            <span class="material-symbols-outlined text-md animate-pulse">notifications_active</span>
        </div>
        <div class="flex-1">
            <h4 class="font-bold text-on-surface text-sm uppercase tracking-wide">Peringatan Perawatan!</h4>
            <p class="text-[12px] text-on-surface-variant mt-1">
                Motor <strong class="text-on-surface">${namaMotor} (${platNomor})</strong> telah melampaui jadwal perawatan. Segera jadwalkan servis.
            </p>
        </div>
        <button onclick="this.parentElement.remove()" class="text-on-surface-variant hover:text-primary transition-colors">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
    `;
    
    container.appendChild(notif);
    
    setTimeout(() => {
        notif.classList.remove('-translate-x-full');
    }, 100);
    
    // Automatically fade out after 8 seconds
    setTimeout(() => {
        notif.classList.add('-translate-x-full', 'opacity-0');
        setTimeout(() => notif.remove(), 500);
    }, 8000);
}

// Save or Update a service schedule record
async function simpanDataServis(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');
    const id = document.getElementById('servis-id').value;
    const nama_motor = document.getElementById('motor-nama').value;
    const plat_nomor = document.getElementById('motor-plat').value;
    const jenis_servis = document.getElementById('motor-jenis').value;
    const tanggal_servis = document.getElementById('motor-tgl-servis').value;
    const tanggal_berikutnya = document.getElementById('motor-tgl-berikutnya').value;
    const status = document.getElementById('motor-status').value || 'Aman';

    const metodeKirim = id ? 'PUT' : 'POST';
    const alamatUrgensi = id ? `${URL_API}/servis/${id}` : `${URL_API}/servis`;

    try {
        const respon = await fetch(alamatUrgensi, {
            method: metodeKirim,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ nama_motor, plat_nomor, jenis_servis, tanggal_servis, tanggal_berikutnya, status })
        });
        const data = await respon.json();
        
        if (respon.ok) {
            showToast(data.pesan || 'Catatan servis disimpan!', 'success');
            resetFormServis();
            ambilDaftarServis();
        } else {
            showToast(data.pesan, 'error');
        }
    } catch (error) {
        showToast('Gagal menyimpan catatan servis!', 'error');
    }
}

// Populate the inputs to prepare for editing
function siapkanEditServis(id, nama, plat, jenis, tglServis, tglBerikutnya) {
    document.getElementById('servis-id').value = id;
    document.getElementById('motor-nama').value = nama;
    document.getElementById('motor-plat').value = plat;
    document.getElementById('motor-jenis').value = jenis;
    document.getElementById('motor-tgl-servis').value = tglServis;
    document.getElementById('motor-tgl-berikutnya').value = tglBerikutnya;

    const formTitle = document.getElementById('form-title');
    formTitle.innerHTML = 'Perbarui Data Servis';
    formTitle.classList.add('text-primary');
    
    const btnSubmit = document.getElementById('btn-submit-servis');
    btnSubmit.innerHTML = 'Simpan Perubahan <span class="material-symbols-outlined">done</span>';
    btnSubmit.classList.remove('bg-primary');
    btnSubmit.classList.add('bg-primary-container', 'text-on-primary-container');
    
    document.getElementById('btn-batal-edit').classList.remove('hidden');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Reset form to add mode
function resetFormServis() {
    document.getElementById('form-servis').reset();
    document.getElementById('servis-id').value = '';
    
    const formTitle = document.getElementById('form-title');
    formTitle.innerHTML = 'Catat Servis Baru';
    formTitle.classList.remove('text-primary');
    
    const btnSubmit = document.getElementById('btn-submit-servis');
    btnSubmit.innerHTML = 'Simpan Data <span class="material-symbols-outlined">save</span>';
    btnSubmit.classList.add('bg-primary');
    btnSubmit.classList.remove('bg-primary-container', 'text-on-primary-container');
    
    document.getElementById('btn-batal-edit').classList.add('hidden');
}

// Delete a service log entry
async function hapusDataServis(id) {
    if (!confirm('Apakah Anda yakin ingin menghapus catatan servis ini?')) return;
    const token = localStorage.getItem('token');
    try {
        const respon = await fetch(`${URL_API}/servis/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await respon.json();
        
        if (respon.ok) {
            showToast(data.pesan || 'Catatan servis dihapus!', 'success');
            ambilDaftarServis();
        } else {
            showToast(data.pesan, 'error');
        }
    } catch (error) {
        showToast('Gagal menghapus data servis!', 'error');
    }
}
