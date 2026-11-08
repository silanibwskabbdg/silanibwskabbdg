/* SiLani — Misi Kawal Demokrasi result sharing module.
   Usage: SiLaniShareResult.open({ score: 85, correct: 8, total: 10, code: "SL-2026-0001", shareUrl: location.href })
*/
(function () {
  'use strict';
  const BANDS = [
    { min: 0, max: 49, title: 'PEMULA DEMOKRASI', badge: 'DEMOKRASI EXPLORER', message: 'Perjalanan memahami demokrasi baru dimulai. Terus belajar dan kenali peranmu!' },
    { min: 50, max: 69, title: 'SAHABAT PENGAWASAN', badge: 'CITIZEN WATCHER', message: 'Kamu mulai memahami pentingnya pengawasan. Tingkatkan pengetahuan dan kepedulianmu!' },
    { min: 70, max: 79, title: 'PENGAMAT CERMAT', badge: 'DEMOCRACY OBSERVER', message: 'Pemahamanmu semakin baik. Terus kritis dan cermat mengawal demokrasi!' },
    { min: 80, max: 89, title: 'PENGAWAL DEMOKRASI', badge: 'DEMOCRACY GUARDIAN', message: 'Kamu menunjukkan pemahaman yang kuat. Terus jaga integritas dan partisipasi demokratis!' },
    { min: 90, max: 100, title: 'GARDA DEMOKRASI', badge: 'DEMOCRACY CHAMPION', message: 'Luar biasa! Pengetahuanmu sangat baik. Jadilah inspirasi dalam menjaga demokrasi!' }
  ];
  const $ = (id) => document.getElementById(id);
  let lastResult = null, lastBlob = null;

  function bandFor(score) { return BANDS.find(b => score >= b.min && score <= b.max) || BANDS[0]; }
  function trackShare(method, status) { if (window.SiLaniAnalytics) window.SiLaniAnalytics.track('share', {method, content_type:'misi_kawal_demokrasi_result', share_status:status || 'initiated'}); }
  function safeText(value, fallback) { return String(value == null || value === '' ? fallback : value); }
  function rounded(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (typeof ctx.roundRect === 'function') { ctx.roundRect(x, y, w, h, r); return; }
    const radius = Math.min(r, w / 2, h / 2);
    ctx.moveTo(x + radius, y); ctx.lineTo(x + w - radius, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
    ctx.lineTo(x + w, y + h - radius); ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
    ctx.lineTo(x + radius, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
    ctx.lineTo(x, y + radius); ctx.quadraticCurveTo(x, y, x + radius, y); ctx.closePath();
  }
  function fitText(ctx, text, x, y, maxWidth, size, weight, color) {
    ctx.fillStyle = color; ctx.font = `${weight} ${size}px system-ui, sans-serif`;
    while (ctx.measureText(text).width > maxWidth && size > 18) {
      size -= 1; ctx.font = `${weight} ${size}px system-ui, sans-serif`;
    }
    ctx.fillText(text, x, y);
  }
  function loadImage(src) {
    return new Promise(resolve => {
      if (!src) return resolve(null);
      const img = new Image(); img.onload = () => resolve(img); img.onerror = () => resolve(null); img.src = src;
    });
  }
  function drawCover(ctx, img, x, y, w, h, alpha) {
    if (!img) return;
    const scale = Math.min(w / img.width, h / img.height);
    const dw = img.width * scale, dh = img.height * scale;
    ctx.save(); ctx.globalAlpha = alpha == null ? 1 : alpha;
    ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh); ctx.restore();
  }
  async function buildCard(result) {
    const canvas = document.createElement('canvas'); canvas.width = 1080; canvas.height = 1550;
    const c = canvas.getContext('2d');
    const score = Math.max(0, Math.min(100, Math.round(Number(result.score) || 0)));
    const band = bandFor(score);
    const total = Math.max(1, Number(result.total) || 10);
    const correct = Math.max(0, Math.min(total, Number(result.correct) || 0));
    const [wasra, wasri, logo] = await Promise.all([
      loadImage(result.wasraImage || 'WASRA.png'),
      loadImage(result.wasriImage || 'WASRI.png'),
      loadImage(result.logoImage || 'silani-logo-clean.png')
    ]);

    const bg = c.createLinearGradient(0, 0, 1080, 1550);
    bg.addColorStop(0, '#073B78'); bg.addColorStop(.55, '#0B65A7'); bg.addColorStop(1, '#092B58');
    c.fillStyle = bg; c.fillRect(0, 0, 1080, 1350);
    // Subtle geometric light and patriotic ribbons
    for (let i = 0; i < 14; i++) {
      c.fillStyle = `rgba(255,255,255,${.025 + (i % 3) * .012})`;
      c.beginPath(); c.arc((i * 173) % 1120, (i * 239) % 1400, 80 + (i % 4) * 24, 0, Math.PI * 2); c.fill();
    }
    c.fillStyle = '#D51F32'; c.beginPath(); c.moveTo(0, 0); c.lineTo(310, 0); c.lineTo(0, 210); c.closePath(); c.fill();
    c.fillStyle = '#FFFFFF'; c.beginPath(); c.moveTo(0, 0); c.lineTo(190, 0); c.lineTo(0, 128); c.closePath(); c.fill();

    // Header
    drawCover(c, logo, 62, 46, 220, 88);
    c.textAlign = 'right'; c.fillStyle = '#F8D878'; c.font = '800 25px system-ui'; c.fillText('MISI KAWAL DEMOKRASI', 1015, 82);
    c.fillStyle = '#FFFFFF'; c.font = '800 55px system-ui'; c.textAlign = 'center'; c.fillText('HASIL MISI', 540, 190);
    c.fillStyle = '#FFE06B'; c.font = '900 48px system-ui'; c.fillText('KAWAL DEMOKRASI', 540, 250);

    // Main score panel
    const panel = c.createLinearGradient(130, 300, 950, 800);
    panel.addColorStop(0, '#FFFFFF'); panel.addColorStop(1, '#E9F2FF');
    c.fillStyle = panel; rounded(c, 100, 300, 880, 490, 42); c.fill();
    c.strokeStyle = '#F4CB55'; c.lineWidth = 9; c.stroke();
    c.textAlign = 'center'; c.fillStyle = '#163E6D'; c.font = '800 34px system-ui'; c.fillText('SKOR AKHIR', 540, 375);
    c.fillStyle = '#0B4B8E'; c.font = '900 176px system-ui'; c.fillText(String(score), 475, 555);
    c.fillStyle = '#5C6D80'; c.font = '700 55px system-ui'; c.fillText('/100', 720, 555);
    c.fillStyle = '#D5A528'; c.font = '900 29px system-ui'; c.fillText('★  ★  ★', 540, 610);
    c.fillStyle = '#F3C94D'; rounded(c, 160, 640, 760, 84, 24); c.fill();
    fitText(c, band.title, 540, 696, 700, 40, '900', '#172B45'); c.textAlign = 'center';
    c.fillStyle = '#176343'; rounded(c, 265, 738, 550, 44, 18); c.fill();
    fitText(c, band.badge, 540, 769, 500, 23, '800', '#FFFFFF'); c.textAlign = 'center';

    // Mascots
    drawCover(c, wasra, 12, 805, 250, 300, 1);
    drawCover(c, wasri, 818, 805, 250, 300, 1);

    // Detail strip
    c.fillStyle = '#FFFFFF'; rounded(c, 95, 1120, 890, 170, 28); c.fill();
    c.fillStyle = '#D7E2F0'; c.fillRect(392, 1150, 3, 108); c.fillRect(688, 1150, 3, 108);
    c.textAlign = 'center';
    c.fillStyle = '#64748B'; c.font = '700 23px system-ui'; c.fillText('JAWABAN BENAR', 245, 1175);
    c.fillStyle = '#173D69'; c.font = '900 43px system-ui'; c.fillText(`${correct} dari ${total}`, 245, 1238);
    c.fillStyle = '#64748B'; c.font = '700 23px system-ui'; c.fillText('PERSENTASE', 540, 1175);
    c.fillStyle = '#173D69'; c.font = '900 43px system-ui'; c.fillText(`${score}%`, 540, 1238);
    c.fillStyle = '#64748B'; c.font = '700 23px system-ui'; c.fillText('KODE HASIL', 835, 1175);
    fitText(c, safeText(result.code, 'SL-' + Date.now().toString().slice(-8)), 835, 1238, 260, 28, '900', '#173D69'); c.textAlign = 'center';

    // Call to action
    c.fillStyle = '#FFE06B'; rounded(c, 120, 1320, 840, 92, 24); c.fill();
    c.fillStyle = '#102F57'; c.font = '900 43px system-ui'; c.fillText('TANTANG DIRIMU SEKARANG!', 540, 1380);
    c.fillStyle = '#FFFFFF'; c.font = '700 27px system-ui';
    c.fillText('Uji pengetahuanmu • Tingkatkan literasi demokrasi', 540, 1460);
    c.fillText('Bagikan hasilmu dan ajak teman ikut mencoba SiLani!', 540, 1500);
    const blob = await new Promise(resolve => {
      if (canvas.toBlob) canvas.toBlob(resolve, 'image/png');
      else { try { const raw = atob(canvas.toDataURL('image/png').split(',')[1]); const bytes = new Uint8Array(raw.length); for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i); resolve(new Blob([bytes], {type:'image/png'})); } catch (_) { resolve(null); } }
    });
    return { canvas, blob, band, score, correct, total };
  }

  function messageFor(r) {
    const b = bandFor(r.score);
    const url = r.shareUrl || location.href;
    return `Saya memperoleh skor ${r.score}/100 dengan predikat ${b.title} dalam Misi Kawal Demokrasi di SiLani!\n\nYuk, uji pengetahuanmu tentang demokrasi dan pengawasan pemilu. Ikuti tantangannya dan bagikan hasilmu juga!\n\n${url}\n\n#SiLani #MisiKawalDemokrasi #KawalDemokrasi`;
  }
  function ensureModal() {
    if ($('silani-result-share')) return;
    const style = document.createElement('style');
    style.textContent = `
      #silani-result-share{position:fixed;inset:0;z-index:9999;background:rgba(7,22,42,.78);display:none;align-items:center;justify-content:center;padding:16px;font-family:system-ui,sans-serif}
      #silani-result-share.open{display:flex}#silani-result-share .sr-panel{width:min(100%,560px);max-height:94vh;overflow:auto;background:#fff;border-radius:22px;padding:20px;box-shadow:0 20px 70px #0006}
      #silani-result-share h2{margin:0 0 6px;color:#123a67;font-size:24px}#silani-result-share p{margin:0 0 14px;color:#526276}
      #silani-result-share img{display:block;width:100%;height:auto;border-radius:12px;border:1px solid #dbe5f0}
      #silani-result-share .sr-actions{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}
      #silani-result-share button{border:0;border-radius:12px;padding:13px 12px;font:800 14px system-ui;cursor:pointer;background:#0d4f8e;color:#fff}
      #silani-result-share button.secondary{background:#edf3fa;color:#153e68}#silani-result-share button.close{width:100%;margin-top:9px;background:#f5f6f8;color:#34445a}
      #silani-result-share .sr-status{font-size:13px;margin-top:9px;min-height:18px;color:#176343}
      @media(max-width:420px){#silani-result-share .sr-actions{grid-template-columns:1fr}}
    `;
    document.head.appendChild(style);
    const modal = document.createElement('div');
    modal.id = 'silani-result-share';
    modal.innerHTML = `<div class="sr-panel" role="dialog" aria-modal="true" aria-labelledby="sr-title">
      <h2 id="sr-title">Hasil Misi Kawal Demokrasi</h2><p>Unduh kartu hasil atau bagikan pencapaianmu kepada teman.</p>
      <img id="sr-preview" alt="Kartu hasil Misi Kawal Demokrasi">
      <div class="sr-actions"><button id="sr-download">Unduh gambar PNG</button><button id="sr-share">Bagikan hasil</button><button id="sr-wa" class="secondary">Bagikan via WhatsApp</button><button id="sr-copy" class="secondary">Salin pesan ajakan</button></div>
      <div class="sr-status" id="sr-status" aria-live="polite"></div><button class="close" id="sr-close">Tutup</button>
    </div>`;
    document.body.appendChild(modal);
    $('sr-close').addEventListener('click', close);
    modal.addEventListener('click', e => { if (e.target === modal) close(); });
    $('sr-download').addEventListener('click', download);
    $('sr-share').addEventListener('click', share);
    $('sr-wa').addEventListener('click', whatsapp);
    $('sr-copy').addEventListener('click', copyMessage);
  }
  function status(msg) { const el = $('sr-status'); if (el) el.textContent = msg || ''; }
  function close() { const el = $('silani-result-share'); if (el) el.classList.remove('open'); }
  function download() {
    if (!lastBlob) { status('Kartu belum berhasil dibuat. Coba lagi atau gunakan Bagikan via WhatsApp.'); return; }
    const url = URL.createObjectURL(lastBlob), a = document.createElement('a');
    a.href = url; a.download = `hasil-misi-kawal-demokrasi-${lastResult.code || 'silani'}.png`;
    document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 1500);
    status('Gambar PNG berhasil disiapkan untuk diunduh.'); trackShare('download_png','completed');
  }
  async function share() {
    if (!lastBlob) { status('Kartu belum tersedia. Silakan coba unduh gambar.'); return; }
    const file = new File([lastBlob], 'hasil-misi-kawal-demokrasi.png', { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try { await navigator.share({ title: 'Hasil Misi Kawal Demokrasi', text: messageFor(lastResult), files: [file] }); trackShare('native_share','completed'); }
      catch (e) { if (e.name !== 'AbortError') status('Berbagi tidak tersedia. Silakan unduh PNG atau gunakan WhatsApp.'); }
    } else {
      download(); status('Perangkat tidak mendukung berbagi gambar langsung. PNG diunduh; lanjutkan membagikannya dari galeri.');
    }
  }
  function whatsapp() { if (!lastResult) return; trackShare('whatsapp','initiated'); window.open('https://wa.me/?text=' + encodeURIComponent(messageFor(lastResult)), '_blank', 'noopener'); }
  async function copyMessage() {
    try { await navigator.clipboard.writeText(messageFor(lastResult)); status('Pesan ajakan berhasil disalin.'); trackShare('copy_link','completed'); }
    catch (_) { status(messageFor(lastResult)); }
  }
  async function open(result) {
    try {
      const score = Math.max(0, Math.min(100, Math.round(Number(result && result.score) || 0)));
      lastResult = Object.assign({}, result, { score, shareUrl: location.origin + location.pathname + '?utm_source=silani&utm_medium=share&utm_campaign=misi_kawal_demokrasi' });
      ensureModal(); $('silani-result-share').classList.add('open'); status('Menyiapkan kartu hasil…');
      const built = await buildCard(lastResult);
      lastBlob = built.blob;
      $('sr-preview').src = built.canvas.toDataURL('image/png');
      status(lastBlob ? 'Kartu hasil siap. Pilih cara membagikan.' : 'Pratinjau siap, tetapi perangkat tidak dapat membuat file PNG. Gunakan WhatsApp untuk membagikan tautan dan pesan.');
      return { score: built.score, band: built.band.title, blob: built.blob };
    } catch (err) {
      ensureModal(); $('silani-result-share').classList.add('open');
      status('Kartu gagal dibuat pada perangkat ini. Coba muat ulang halaman, atau bagikan pesan melalui WhatsApp.');
      console.error('SiLani result card error:', err); return null;
    }
  }
  window.SiLaniShareResult = { open, bandFor, bands: BANDS.slice(), messageFor };
})();