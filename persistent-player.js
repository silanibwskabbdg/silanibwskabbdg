(function(){
'use strict';
if(window.__silaniPersistentRouter) return;
window.__silaniPersistentRouter=true;
var audio=document.getElementById('mars');
var button=document.getElementById('musicBtn');
var routerScript=document.currentScript;
if(!audio||!button) return;
// Pindahkan tombol keluar dari header agar tidak menutupi navigasi.
document.body.appendChild(button);
// Terapkan posisi melalui inline style !important agar aturan header/CSS lama tidak mengalahkannya.
function placeMusicButton(){
 button.style.setProperty('position','fixed','important');
 button.style.setProperty('top','auto','important');
 button.style.setProperty('bottom','24px','important');
 button.style.setProperty('right','24px','important');
 button.style.setProperty('left','auto','important');
 button.style.setProperty('z-index','99999','important');
 button.style.setProperty('transform','none','important');
 button.style.setProperty('box-shadow','0 5px 18px rgba(0,0,0,.22)','important');
 if(window.matchMedia('(max-width: 700px)').matches){
  button.style.setProperty('right','14px','important');
  button.style.setProperty('bottom','14px','important');
  button.style.setProperty('width','48px','important');
  button.style.setProperty('min-width','48px','important');
  button.style.setProperty('height','48px','important');
  button.style.setProperty('min-height','48px','important');
  button.style.setProperty('padding','0','important');
  button.style.setProperty('border-radius','50%','important');
  button.style.setProperty('justify-content','center','important');
 }else{
  ['width','min-width','height','min-height','padding','border-radius','justify-content'].forEach(function(k){button.style.removeProperty(k)});
 }
}
placeMusicButton();
window.addEventListener('resize',placeMusicButton);
var style=document.createElement('style');
style.id='silani-persistent-player-style';
style.textContent='#musicBtn{position:fixed!important;top:auto!important;right:24px!important;bottom:24px!important;left:auto!important;z-index:99999!important;transform:none!important;box-shadow:0 5px 18px rgba(0,0,0,.22)!important}@media(max-width:700px){#musicBtn{right:14px!important;bottom:14px!important;width:48px!important;min-width:48px!important;height:48px!important;min-height:48px!important;padding:0!important;justify-content:center!important;border-radius:50%!important}#musicBtn .music-label,#musicBtn .eq{display:none!important}}';
document.head.appendChild(style);
function updateLinks(){
 document.querySelectorAll('a[href]').forEach(function(a){
  if(a.dataset.silaniRouter==='1') return;
  var u; try{u=new URL(a.href,location.href)}catch(e){return}
  if(u.origin!==location.origin || !/\.html?$/i.test(u.pathname) || a.target || a.hasAttribute('download')) return;
  a.dataset.silaniRouter='1';
  a.addEventListener('click',function(ev){
   if(ev.defaultPrevented || ev.metaKey || ev.ctrlKey || ev.shiftKey || ev.altKey || ev.button!==0) return;
   ev.preventDefault(); navigate(u.href,true);
  });
 });
}
function runScripts(scripts){
 var chain=Promise.resolve();
 scripts.forEach(function(old){
  chain=chain.then(function(){
   return new Promise(function(resolve){
    var s=document.createElement('script');
    Array.from(old.attributes).forEach(function(a){s.setAttribute(a.name,a.value)});
    if(old.src){s.onload=resolve;s.onerror=resolve;s.src=new URL(old.getAttribute('src'),location.href).href;document.body.appendChild(s);}
    else {s.textContent=old.textContent;document.body.appendChild(s);resolve();}
   });
  });
 });
 return chain;
}
function navigate(url,push){
 fetch(url,{credentials:'same-origin'}).then(function(r){
  if(!r.ok) throw new Error('HTTP '+r.status);
  return r.text();
 }).then(function(html){
  var doc=new DOMParser().parseFromString(html,'text/html');
  var nextAudio=doc.getElementById('mars');
  if(!nextAudio) throw new Error('Audio element missing');
  if(push) history.pushState({silani:true},'',url);
  document.title=doc.title||'SiLani';
  // Update page-specific inline styles while keeping shared player control.
  document.querySelectorAll('head style[data-page-style]').forEach(function(n){n.remove()});
  doc.head.querySelectorAll('style').forEach(function(n){
   var c=n.cloneNode(true);c.dataset.pageStyle='1';document.head.appendChild(c);
  });
  // Remove old page content but never detach the live audio/player nodes.
  Array.from(document.body.children).forEach(function(n){
   if(n!==audio && n!==button && n!==routerScript) n.remove();
  });
  var scripts=[];
  Array.from(doc.body.children).forEach(function(n){
   if(n.tagName==='AUDIO' && n.id==='mars') return;
   if(n.tagName==='BUTTON' && n.id==='musicBtn') return;
   if(n.tagName==='SCRIPT'){scripts.push(n);return;}
   document.body.appendChild(n.cloneNode(true));
  });
  runScripts(scripts).then(function(){ updateLinks(); if(window.SiLaniAnalytics) window.SiLaniAnalytics.pageView(doc.title,url); });
  window.scrollTo(0,0);
 }).catch(function(err){
  console.warn('Navigasi SiLani menggunakan pemuatan biasa:',err);
  location.href=url;
 });
}
window.addEventListener('popstate',function(){navigate(location.href,false)});
updateLinks();
})();