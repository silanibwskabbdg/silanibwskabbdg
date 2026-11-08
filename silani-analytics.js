/* SiLani privacy-conscious analytics (Google Analytics 4).
   Masukkan Measurement ID GA4 milik pengelola situs pada konstanta di bawah.
   Contoh format: G-XXXXXXXXXX. Jangan masukkan data pribadi pengunjung.
*/
(function(){
  'use strict';
  if (window.SiLaniAnalytics) return;
  var MEASUREMENT_ID = 'G-XXXXXXXXXX'; // WAJIB DIGANTI dengan Measurement ID GA4 SiLani
  var enabled = /^G-[A-Z0-9]+$/.test(MEASUREMENT_ID) && MEASUREMENT_ID !== 'G-XXXXXXXXXX';
  var queue = [];
  function send(name, params){
    if (!enabled) { queue.push({event:name,params:params||{}}); return; }
    if (typeof window.gtag === 'function') window.gtag('event', name, params || {});
  }
  window.SiLaniAnalytics = {
    enabled: enabled,
    track: send,
    pageView: function(title, url){ send('page_view', {page_title:title||document.title, page_location:url||location.href}); },
    pendingEvents: function(){ return queue.slice(); }
  };
  if (!enabled) { console.info('[SiLani Analytics] Belum aktif. Isi Measurement ID GA4 di silani-analytics.js.'); return; }
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
  var tag = document.createElement('script'); tag.async = true;
  tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(MEASUREMENT_ID);
  document.head.appendChild(tag);
  window.gtag('js', new Date());
  window.gtag('config', MEASUREMENT_ID, {send_page_view:true});
  // Klasifikasi aktivitas permainan; tidak mengumpulkan nama, nomor telepon, atau identitas.
  document.addEventListener('click', function(ev){
    var a = ev.target && ev.target.closest ? ev.target.closest('a[href]') : null;
    if (a && /game\.html|misi-kawal-demokrasi\.html|run\.html|catur\.html/.test(a.getAttribute('href')||'')) {
      send('game_navigation', {destination:(a.getAttribute('href')||'').split('?')[0]});
    }
  }, true);
})();
