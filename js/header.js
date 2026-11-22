/* Loads header.html into #header-placeholder */
(function(){
  'use strict';
  var placeholder = document.getElementById('header-placeholder');
  if(!placeholder) return;

  fetch('header.html', {cache:'no-cache'})
    .then(function(r){ if(!r.ok) throw new Error('Header fetch failed'); return r.text(); })
    .then(function(html){
      placeholder.innerHTML = html;
      // Re-inject the header's <style> and <script> into document head/body
      var styles = placeholder.querySelectorAll('style');
      styles.forEach(function(s){ document.head.appendChild(s.cloneNode(true)); s.remove(); });
      var scripts = placeholder.querySelectorAll('script');
      scripts.forEach(function(old){
        var s = document.createElement('script');
        s.textContent = old.textContent;
        document.body.appendChild(s);
        old.remove();
      });
    })
    .catch(function(err){
      console.warn('[header.js]', err.message);
      placeholder.innerHTML = '<div style="background:#0f1b33;color:#fbbf24;padding:12px;text-align:center;font-family:Poppins,sans-serif;">Raj Marketing Mysore · <a href="index.html" style="color:#fbbf24;">Home</a></div>';
    });
})();
