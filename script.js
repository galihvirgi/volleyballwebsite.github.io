/**
 * @file Mengelola data pemain voli menggunakan Local Storage.
 * @description File ini berisi kode untuk menambah, mengedit, menghapus, menampilkan, dan mengurutkan data pemain bola voli.
 */

/**
 * Element input untuk nama pemain.
 * @type {HTMLInputElement} 
 */
const inputNama = document.getElementById("nama");

/**
 * Element input untuk tanggal lahir pemain.
 * @type {HTMLInputElement} 
 */
const inputDate = document.getElementById("date");

/**
 * Element input untuk posisi pemain.
 * @type {HTMLInputElement}  
 */
const inputPosisi = document.getElementById("posisi");

/**
 * Element input untuk tinggi badan pemain.
 * @type {HTMLInputElement} 
 */
const inputTB = document.getElementById("tinggi-badan");

/**
 * Element input untuk berat badan pemain.
 * @type {HTMLInputElement}
 */
const inputBB = document.getElementById("berat-badan");

/**
 * Tombol untuk menambah pemain.
 * @type {HTMLButtonElement} 
 */
const btnTambah = document.getElementById("btn-tambah");

/**
 * Tombol untuk membatalkan aksi.
 * @type {HTMLButtonElement} 
 */
const btnCancel = document.getElementById("btn-cancel")

/**
 * Elemen pembungkus tabel untuk menampilkan daftar pemain.
 * @type {HTMLElement} 
 */
const elTableList = document.getElementById("table-wrapper");

/**
 * Elemen input untuk pencarian pemain.
 * @type {HTMLInputElement}
 */
const searchInput = document.getElementById("search")

/**
 * Array untuk menyimpan daftar data pemain dari localStorage.
 * @type {Array<Object>} 
 */
let listPemain = JSON.parse(localStorage.getItem('listPemain')) || [];

/**
 * Variabel untuk menyimpan ID yang sedang diedit. -1 menunjukkan tidak ada item yang sedang diedit.
 * @type {number} 
 */
let editingId = -1;

/**
 * Variabel untuk menghasilkan ID baru untuk item pemain baru.
 * @type {number} 
 */
let idData = listPemain.length > 0 ? Math.max(...listPemain.map(pemain => pemain.id)) +1 : 1;


/**
 * @function
 * Menyimpan data pemain ke Local Storage.
 */
const simpanKeLocalStorage = () => {
    localStorage.setItem('listPemain', JSON.stringify(listPemain));
};

/**
 * @function
 * Menampilkan data pemain dalam tabel.
 */
const tampilkan = () => {
    elTableList.innerHTML = "";
    const searchValue = searchInput.value.toLowerCase();
    listPemain.filter(pemain => pemain.nama.toLowerCase().includes(searchValue)).forEach((pemain) => {
        elTableList.innerHTML += `
        <table class="body">
            <tbody>
                <tr>
                    <td>${pemain.nama}</td>
                    <td>${pemain.date}</td>
                    <td>${pemain.posisi}</td>
                    <td>${pemain.tinggiBadan}cm</td>
                    <td>${pemain.beratBadan}kg</td>
                    <td>    
                        <i class="fa-solid fa-pen-to-square" onClick="editItem(${pemain.id})"></i>
                        <i class="fa-solid fa-trash" onclick="hapusPemain(${pemain.id})"></i>
                    </td>
                </tr>
            </tbody>
        </table>
        `;
    });
};


/**
 * Menangani klik tombol "Tambah" untuk menambah atau memperbarui data pemain.
 * @param {event} event - Event yang dipicu saat tombol diklik
 */
btnTambah.addEventListener('click', (event) => {
    event.preventDefault();

    if (inputNama.value.trim() === '' || inputDate.value.trim() === '' || inputPosisi.value.trim() === '' || inputTB.value.trim() === '' || inputBB.value.trim() === '' || inputPosisi.value.trim() === 'Posisi') {
        alert("Semua data harus diisi");
        return;
    }
    
    const newPlayer = {
        id: editingId === -1 ? idData++ : editingId,
        nama: inputNama.value,
        date: inputDate.value,
        posisi: inputPosisi.value,
        tinggiBadan: inputTB.value,
        beratBadan: inputBB.value
    };

    if(editingId === -1){
        listPemain.unshift(newPlayer)
    }else{
        const index = listPemain.findIndex(pemain => pemain.id === editingId)
        if(index !== -1){
            listPemain[index] = newPlayer
        }
        editingId = -1;
        btnTambah.innerHTML = 'Tambah'
    }

    simpanKeLocalStorage();
    tampilkan();
    clearForm();
    
});


/**
 * Menangani klik tombol "Batal" untuk mengosongkan form input.
 * @param {event} event - Event yang dipicu saat tombol diklik.
 */
btnCancel.addEventListener('click', (event) => {
    event.preventDefault();
    clearForm();
    editingId = -1;
    btnTambah.innerHTML = 'Tambah'
})

/**
 * @function
 * Mengosongkan form input.
 */
const clearForm = () => {
    inputNama.value = "";
    inputDate.value = "";
    inputPosisi.value = "";
    inputTB.value = "";
    inputBB.value = "";
}

/**
 * @function
 * Mengosongkan search input.
 */
const clearSearchInput = () => {
    searchInput.value = "";
}

/**
 * @function
 * Mengisi Form dengan data pemain yang akan diedit.
 * @param {number} id - ID pemain yang akan diedit.
 */
const editItem = (id) => {
    const pemain = listPemain.find(pemain => pemain.id === id);
    if(!pemain) return;

    inputNama.value = pemain.nama;
    inputDate.value = pemain.date;
    inputPosisi.value = pemain.posisi;
    inputTB.value = pemain.tinggiBadan;
    inputBB.value = pemain.beratBadan;
    editingId = id
    btnTambah.innerHTML = 'Perbarui'
}

/**
 * @function
 * Menghapus pemain dari daftar berdasarkan ID.
 * @param {number} id - ID pemain yang akan dihapus.
 */
const hapusPemain = (id) => {
    listPemain = listPemain.filter(pemain => pemain.id !== id);
    clearSearchInput();
    simpanKeLocalStorage();
    tampilkan();
};

/**
 * @function
 * Mengurutkan daftar pemain berdasarkan nama.
 * @param {string} order - Urutan pengurutan, 'az' untuk A-Z, 'za' untuk Z-A.
 */
const sort = (order) => {
    if(order === 'a-z'){
        listPemain.sort((a, b) => a.nama.localeCompare(b.nama))
    } else if (order === 'z-a'){
        listPemain.sort((a, b) => b.nama.localeCompare(a.nama))
    }
    console.log("berhasil")
    tampilkan();
}

//Menampilkan data saat pencarian input berubah
searchInput.addEventListener('input', tampilkan)

//Menampilkan data saat halaman dimuat
window.onload = tampilkan;