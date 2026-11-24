/* ============================================================
   Footer loader — injects footer.html
   ============================================================ */
(function(){
  'use strict';

  var placeholder = document.getElementById('footer-placeholder');
  if(!placeholder) return;

  fetch('footer.html', {cache:'no-cache'})
    .then(function(r){ if(!r.ok) throw new Error('Footer fetch failed'); return r.text(); })
    .then(function(html){
      placeholder.innerHTML = html;

      placeholder.querySelectorAll('style').forEach(function(s){
        document.head.appendChild(s.cloneNode(true));
        s.remove();
      });

      placeholder.querySelectorAll('script').forEach(function(old){
        var s = document.createElement('script');
        s.textContent = old.textContent;
        document.body.appendChild(s);
        old.remove();
      });
    })
    .catch(function(err){
      console.warn('[footer.js]', err.message);
      placeholder.innerHTML =
        '<div style="background:#0f1b33;color:#94a3b8;padding:20px;text-align:center;' +
        'font-family:Poppins,sans-serif;font-size:12px;">' +
        '© Raj Marketing Mysore · <a href="contact.html" style="color:#fbbf24;">Contact</a></div>';
    });
})();
