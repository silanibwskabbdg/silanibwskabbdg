# Perbaikan tombol Putar Mars SiLani – versi compact

Tombol pemutar mars dipindahkan ke kanan bawah dan dipaksa tampil horizontal dengan ukuran ringkas (124 × 40 px desktop, 116 × 40 px mobile). Tombol tetap fixed sehingga selalu terlihat saat halaman digulir. Label “Putar mars” tetap tampil.

Perubahan utama berada di `persistent-player.js`; seluruh halaman yang memuat skrip tersebut juga menggunakan query versi baru untuk menghindari cache browser.

Cara pemasangan: ekstrak ZIP, unggah seluruh isi folder `silanibwskabbdg-main` ke root repository GitHub Pages, lalu commit. Setelah deployment, lakukan hard refresh (`Ctrl + Shift + R`).
