const API_URL = "http://localhost:5000/api";

let dataRiwayat = [];

async function muatRiwayat() {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}/servis`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    dataRiwayat = data;

    tampilkanRiwayat(data);
  } catch (error) {
    console.error(error);
  }
}

function tampilkanRiwayat(data) {
  const tbody = document.getElementById("tbody-history");
  const empty = document.getElementById("history-empty");

  tbody.innerHTML = "";

  if (!data.length) {
    empty.classList.remove("hidden");
    return;
  }

  empty.classList.add("hidden");

  data.forEach(item => {

    const harga = Number(item.harga || 0);
    

    tbody.innerHTML += `
      <tr class="border-t border-outline-variant">
        <td class="px-4 py-3">${formatTanggal(item.tanggal_servis)}</td>
        <td class="px-4 py-3">${item.nama_motor}</td>
        <td class="px-4 py-3">${item.plat_nomor}</td>
        <td class="px-4 py-3">${item.jenis_servis}</td>
        <td class="px-4 py-3 font-semibold text-primary">
          Rp ${harga.toLocaleString('id-ID')}
        </td>
        <td class="px-4 py-3">
          ${formatTanggal(item.tanggal_berikutnya)}
        </td>
        <td class="px-4 py-3">
          ${item.status}
        </td>
        <td class="px-4 py-3 text-right">
          <button
            onclick="lihatDetail(${item.id})"
            class="text-primary hover:underline"
          >
            Detail
          </button>
        </td>
      </tr>
    `;
  });
}

function lihatDetail(id) {

  const item = dataRiwayat.find(x => x.id == id);

  if (!item) return;

  document.getElementById("detail-body").innerHTML = `
    <div><b>Motor:</b> ${item.nama_motor}</div>
    <div><b>Plat:</b> ${item.plat_nomor}</div>
    <div><b>Servis:</b> ${item.jenis_servis}</div>
    <div><b>Harga:</b> Rp ${(item.harga || 0).toLocaleString('id-ID')}</div>
    <div><b>Tanggal Servis:</b> ${formatTanggal(item.tanggal_servis)}</div>
    <div><b>Jadwal Berikutnya:</b> ${formatTanggal(item.tanggal_berikutnya)}</div>
    <div><b>Status:</b> ${item.status}</div>
  `;

  document.getElementById("detail-modal").classList.remove("hidden");
}

function tutupDetail() {
  document.getElementById("detail-modal").classList.add("hidden");
}

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  return new Date(tanggal)
    .toLocaleDateString("id-ID");
}

function terapkanFilter() {

  const dari = document.getElementById("filter-dari").value;
  const sampai = document.getElementById("filter-sampai").value;

  let hasil = [...dataRiwayat];

  if (dari) {
    hasil = hasil.filter(
      item => item.tanggal_servis >= dari
    );
  }

  if (sampai) {
    hasil = hasil.filter(
      item => item.tanggal_servis <= sampai
    );
  }

  tampilkanRiwayat(hasil);
}

function resetFilter() {

  document.getElementById("filter-dari").value = "";
  document.getElementById("filter-sampai").value = "";

  tampilkanRiwayat(dataRiwayat);
}