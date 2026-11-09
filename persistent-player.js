(function(){
'use strict';
if(window.__silaniPersistentRouter) return;
window.__silaniPersistentRouter=true;
var audio=document.getElementById('mars');
var button=document.getElementById('musicBtn');
var routerScript=document.currentScript;
if(!audio||!button) return;

// Keep one compact, fixed player at the lower-right corner on every page.
// The label is visually hidden; the icon remains available with an accessible name.
document.body.appendChild(button);
function placeMusicButton(){
 var mobile=window.matchMedia('(max-width: 700px)').matches;
 var styles={
  position:'fixed',top:'auto',right:mobile?'14px':'20px',bottom:mobile?'14px':'20px',left:'auto',
  zIndex:'10000',transform:'none',display:'inline-flex',flexDirection:'row',
  alignItems:'center',justifyContent:'center',boxSizing:'border-box',
  width:'48px',minWidth:'48px',maxWidth:'48px',height:'48px',minHeight:'48px',maxHeight:'48px',
  padding:'0',margin:'0',gap:'0',borderRadius:'50%',border:'1px solid #e2cf9f',
  background:'#f6ecd6',color:'#8e1e29',font:'700 12px/1 system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif',
  whiteSpace:'nowrap',writingMode:'horizontal-tb',boxShadow:'0 4px 14px rgba(0,0,0,.20)',cursor:'pointer'
 };
 Object.keys(styles).forEach(function(k){button.style.setProperty(k.replace(/[A-Z]/g,function(m){return '-'+m.toLowerCase()}),styles[k],'important')});
 button.setAttribute('aria-label','Putar atau jeda Mars Pengawas Pemilu');
 button.setAttribute('title','Putar mars');
 var icon=button.querySelector('.ic');
 if(icon){icon.style.setProperty('width','20px','important');icon.style.setProperty('height','20px','important');icon.style.setProperty('flex','0 0 20px','important');icon.style.setProperty('margin','0','important')}
 var label=button.querySelector('.music-label');
 if(label){label.style.setProperty('position','absolute','important');label.style.setProperty('width','1px','important');label.style.setProperty('height','1px','important');label.style.setProperty('padding','0','important');label.style.setProperty('margin','-1px','important');label.style.setProperty('overflow','hidden','important');label.style.setProperty('clip','rect(0,0,0,0)','important');label.style.setProperty('white-space','nowrap','important');label.style.setProperty('border','0','important')}
 var eq=button.querySelector('.eq');
 if(eq) eq.style.setProperty('display','none','important');
}
placeMusicButton();
window.addEventListener('resize',placeMusicButton);

// The page router must also switch page-specific stylesheets. Without this,
// navigating to game.html can leave the old page CSS active until a refresh.
Array.prototype.forEach.call(document.querySelectorAll('link[rel="stylesheet"]'),function(link){
 link.setAttribute('data-silani-page-stylesheet','1');
});
function syncStylesheets(doc){
 var oldLinks=Array.prototype.slice.call(document.querySelectorAll('link[data-silani-page-stylesheet]'));
 var newLinks=Array.prototype.slice.call(doc.querySelectorAll('link[rel="stylesheet"]'));
 var waits=newLinks.map(function(old){
  return new Promise(function(resolve){
   var link=document.createElement('link');
   Array.prototype.forEach.call(old.attributes,function(attr){link.setAttribute(attr.name,attr.value)});
   link.setAttribute('data-silani-page-stylesheet','1');
   link.onload=resolve; link.onerror=resolve;
   document.head.appendChild(link);
   // Existing local/Google stylesheets may already be cached; load/error will resolve.
  });
 });
 return Promise.all(waits).then(function(){
  oldLinks.forEach(function(link){if(link.parentNode) link.parentNode.removeChild(link)});
 });
}

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
    Array.prototype.forEach.call(old.attributes,function(a){s.setAttribute(a.name,a.value)});
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
  return syncStylesheets(doc).then(function(){return doc;});
 }).then(function(doc){
  if(push) history.pushState({silani:true},'',url);
  document.title=doc.title||'SiLani';
  document.querySelectorAll('head style[data-page-style]').forEach(function(n){n.remove()});
  doc.head.querySelectorAll('style').forEach(function(n){var c=n.cloneNode(true);c.dataset.pageStyle='1';document.head.appendChild(c)});
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
  placeMusicButton();
  window.scrollTo(0,0);
  runScripts(scripts).then(function(){
   updateLinks();
   placeMusicButton();
   if(window.SiLaniAnalytics) window.SiLaniAnalytics.pageView(doc.title,url);
  });
 }).catch(function(err){
  console.warn('Navigasi SiLani menggunakan pemuatan biasa:',err);
  location.href=url;
 });
}
window.addEventListener('popstate',function(){navigate(location.href,false)});
updateLinks();
})();
