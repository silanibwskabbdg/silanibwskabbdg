# Perbaikan posisi tombol Putar Mars

Paket ini memindahkan tombol Putar Mars dari area navigasi/header ke kanan bawah layar. Posisi diterapkan langsung melalui inline style `!important` oleh `persistent-player.js`, sehingga aturan CSS header lama tidak lagi menimpa posisi tombol. Pada layar kecil tombol menjadi ikon bulat 48 x 48 px.

## Pemasangan
1. Ekstrak ZIP.
2. Unggah seluruh isi folder `silanibwskabbdg-main` ke root repository GitHub Pages, timpa file lama.
3. Commit perubahan.
4. Setelah deployment selesai, buka website dan lakukan hard refresh (`Ctrl + Shift + R`).

Versi query script dinaikkan ke `20261109-player-bottom-v2` untuk menghindari cache JavaScript lama.
