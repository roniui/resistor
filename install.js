document.addEventListener('DOMContentLoaded', () => {
  const btnInstall = document.getElementById('btnInstall');
  let deferredInstallPrompt;

  // Check if the app is running as a PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  // If the app is running as a PWA, hide the install button
  if (isPWA) {
    if (btnInstall) {
      btnInstall.style.display = 'none';
    }
  } else {
    // Listen for 'beforeinstallprompt' to save the install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredInstallPrompt = e;
      console.log('Install prompt saved');
      if (btnInstall) {
        btnInstall.style.display = 'block'; // Ensure the install button is visible
      }
    });

    // Listen for install button click
    btnInstall.addEventListener('click', () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choice) => {
          if (choice.outcome === 'accepted') {
            console.log('User accepted the installation');
            btnInstall.style.display = 'none';
            localStorage.setItem('pwaInstalled', 'true'); // Mark the app as installed
          } else {
            console.log('User dismissed the installation');
          }
        });
      } else {
        alert('App already installed or, not supported by browser');
      }
    });

    // Listen for the 'appinstalled' event
    window.addEventListener('appinstalled', () => {
      console.log('App installed');
      if (btnInstall) {
        btnInstall.style.display = 'none'; // Hide the install button
      }
      localStorage.setItem('pwaInstalled', 'true');
    });
  }
});
