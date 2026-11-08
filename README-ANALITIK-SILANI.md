# Analitik SiLani — panduan aktivasi

## Apa yang diukur
- Kunjungan dan tampilan halaman: Beranda, Panduan, FAQ, Game, Misi, RUN, Catur.
- Navigasi ke halaman permainan.
- Mulai dan penyelesaian Misi Kawal Demokrasi, termasuk skor agregat.
- Mulai permainan Wasra & Wasri RUN.
- Klik berbagi hasil: native share, WhatsApp, unduh PNG, dan salin pesan.
- Tautan yang dibagikan menggunakan UTM agar kunjungan rujukan dapat dikenali sebagai trafik dari SiLani.

## Aktivasi wajib
1. Buat properti Google Analytics 4 (GA4) dan Web data stream untuk `silanibwskabbdg.github.io`.
2. Salin Measurement ID yang formatnya `G-XXXXXXXXXX`.
3. Buka `silani-analytics.js` dan ganti `G-XXXXXXXXXX` pada konstanta `MEASUREMENT_ID` dengan ID asli.
4. Commit dan push seluruh isi folder ke GitHub Pages.
5. Buka situs, kunjungi halaman Game, mulai Misi, selesaikan, lalu uji tombol berbagi.
6. Periksa GA4 > Reports > Realtime. Event khusus dapat dilihat di Reports > Engagement > Events atau Explore.

## Batasan privasi dan identitas
Analitik ini tidak meminta nama, nomor telepon, akun media sosial, atau identitas pribadi pengunjung. GA4 dapat menyajikan metrik agregat seperti pengguna aktif, halaman yang dilihat, sumber trafik, perangkat, serta perkiraan lokasi umum sesuai pengaturan Google Analytics.

SiLani tidak dapat mengetahui nama orang yang membuka atau meneruskan tautan, siapa penerima WhatsApp, atau apakah pesan benar-benar dibaca. Klik tombol berbagi hanya mengukur tindakan berbagi yang dimulai/berhasil di perangkat sejauh browser memberi sinyal. Kunjungan dari tautan ber-UTM mengukur trafik rujukan, bukan identitas orang yang membagikannya.

Jika ingin mengukur kontributor sosialisasi secara sukarela, tahap berikutnya dapat memakai kode kampanye/QR berbeda untuk tiap kegiatan atau relawan. Kode tersebut mengidentifikasi kanal/kegiatan, bukan orang secara otomatis. Hindari mengumpulkan identitas pribadi tanpa dasar, pemberitahuan, dan persetujuan yang sesuai.

## Pengujian
Sebelum Measurement ID diisi, skrip sengaja tidak mengirim data ke Google. Setelah ID diisi, lakukan uji Realtime. Data historis sebelum pemasangan tidak dapat dipulihkan.
