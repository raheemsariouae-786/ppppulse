/* PPP PULSE SERVICE WORKER v5.1 — آف لائن بھی چلے */
var CN='ppp-v5.1';
var CORE=['/','/index.html','/manifest.json'];

self.addEventListener('install',function(e){
  e.waitUntil(caches.open(CN).then(function(c){
    return c.addAll(CORE).catch(function(){});
  }).then(function(){return self.skipWaiting();}));
});

self.addEventListener('activate',function(e){
  e.waitUntil(caches.keys().then(function(keys){
    return Promise.all(keys.filter(function(k){return k!==CN;}).map(function(k){return caches.delete(k);}));
  }).then(function(){return self.clients.claim();}));
});

/* آف لائن پیغام */
function offlineHTML(platform,color){
  return '<!DOCTYPE html><html dir="rtl" lang="ur"><head><meta charset="UTF-8"><style>body{margin:0;background:#000;display:flex;align-items:center;justify-content:center;height:300px;flex-direction:column;gap:10px;font-family:sans-serif}.ic{font-size:36px}.t{color:'+color+';font-size:13px}.s{color:#555;font-size:10px}</style></head><body><div class="ic">📵</div><div class="t">آف لائن موڈ</div><div class="s">'+platform+' نیٹ آنے پر load ہوگا</div></body></html>';
}

self.addEventListener('fetch',function(e){
  if(e.request.method!=='GET')return;
  var url=e.request.url;

  /* Twitter */
  if(url.includes('twitter.com')||url.includes('twimg.com')||url.includes('platform.twitter')||url.includes('syndication.twitter')){
    e.respondWith(fetch(e.request).catch(function(){return new Response(offlineHTML('Twitter','#1d9bf0'),{headers:{'Content-Type':'text/html; charset=utf-8'}});}));
    return;
  }
  /* Facebook */
  if(url.includes('facebook.com')||url.includes('fbcdn.net')||url.includes('connect.facebook')){
    e.respondWith(fetch(e.request).catch(function(){return new Response(offlineHTML('Facebook','#1877f2'),{headers:{'Content-Type':'text/html; charset=utf-8'}});}));
    return;
  }
  /* Google Fonts — Cache First */
  if(url.includes('fonts.google')||url.includes('fonts.gstatic')){
    e.respondWith(caches.open(CN).then(function(c){return c.match(e.request).then(function(cd){if(cd)return cd;return fetch(e.request).then(function(r){if(r&&r.status===200)c.put(e.request,r.clone());return r;});});}));
    return;
  }
  /* باقی سب — Stale While Revalidate */
  e.respondWith(caches.open(CN).then(function(c){return c.match(e.request).then(function(cd){var nf=fetch(e.request).then(function(r){if(r&&r.status===200)c.put(e.request,r.clone());return r;}).catch(function(){return cd;});return cd||nf;});}));
});

/* Push Notifications */
self.addEventListener('push',function(e){
  var d=e.data?e.data.json():{title:'PPP Pulse 🌹',body:'نئی اطلاع'};
  e.waitUntil(self.registration.showNotification(d.title||'PPP Pulse 🌹',{body:d.body||'',icon:'/icon-192.png',badge:'/icon-192.png',vibrate:[200,100,200],dir:'rtl',lang:'ur'}));
});
