/* ============================================================
   Header loader — injects header.html + detects page context
   Works on: home, products, login, customer/*, dealer/*, admin*
   ============================================================ */
(function(){
  'use strict';

  // ---------- Detect account context from URL ----------
  function detectAccountContext(){
    var p = window.location.pathname.toLowerCase();

    if(p.indexOf('/admin') !== -1 || p.indexOf('admin-') !== -1){
      document.body.setAttribute('data-account','admin');
      return;
    }
    if(p.indexOf('/dealer') !== -1 || p.indexOf('dealer-') !== -1){
      document.body.setAttribute('data-account','dealer');
      return;
    }
    if(p.indexOf('/customer') !== -1 || p.indexOf('customer-') !== -1){
      document.body.setAttribute('data-account','customer');
      return;
    }
    // login pages
    if(p.indexOf('login') !== -1 || p.indexOf('register') !== -1){
      // leave as-is, show all account links
    }
  }

  // ---------- Load header ----------
  var placeholder = document.getElementById('header-placeholder');
  if(!placeholder){
    detectAccountContext();
    return;
  }

  detectAccountContext();

  fetch('header.html', {cache:'no-cache'})
    .then(function(r){ if(!r.ok) throw new Error('Header fetch failed'); return r.text(); })
    .then(function(html){
      placeholder.innerHTML = html;

      // Move <style> to <head>
      placeholder.querySelectorAll('style').forEach(function(s){
        document.head.appendChild(s.cloneNode(true));
        s.remove();
      });

      // Re-execute <script>
      placeholder.querySelectorAll('script').forEach(function(old){
        var s = document.createElement('script');
        s.textContent = old.textContent;
        document.body.appendChild(s);
        old.remove();
      });
    })
    .catch(function(err){
      console.warn('[header.js]', err.message);
      // Fallback mini-header
      placeholder.innerHTML =
        '<div style="background:linear-gradient(135deg,#0f1b33,#1e3a8a);color:#fbbf24;' +
        'padding:14px 20px;text-align:center;font-family:Poppins,sans-serif;' +
        'font-weight:800;font-size:15px;letter-spacing:.3px;">' +
        'Raj Marketing Mysore · <a href="index.html" style="color:#fff;text-decoration:underline;">Home</a></div>';
    });
})();
