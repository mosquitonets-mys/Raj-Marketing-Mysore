// Save as /js/admin-guard.js
// Import this in the admin dashboard before loading protected dashboard data.
import { auth } from '../firebase-config.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js';

export function protectAdminPage() {
  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (!user) {
        window.location.replace('/admin/admin-login.html');
        resolve(false);
        return;
      }

      try {
        const token = await user.getIdTokenResult(true);
        if (token.claims.admin === true) {
          resolve(true);
          return;
        }
      } catch (error) {
        console.error('Admin guard verification failed:', error);
      }

      try {
        await signOut(auth);
      } catch (error) {
        console.error('Could not sign out unauthorized user:', error);
      }
      window.location.replace('/admin/admin-login.html');
      resolve(false);
    });
  });
}

// Example in dashboard.html:
// <script type="module">
//   import { protectAdminPage } from '../js/admin-guard.js';
//   const allowed = await protectAdminPage();
//   if (allowed) {
//     // Start dashboard data loading here.
//   }
// </script>
