document.addEventListener('DOMContentLoaded', () => {
  const btnInstall = document.getElementById('btnInstall');
  let deferredInstallPrompt;
  const unsupportedBrowsers = ['Safari', 'Firefox'];

  // Detect if the app is running as a PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  if (isPWA) {
    // Hide the install button if already running as a PWA
    if (btnInstall) btnInstall.style.display = 'none';
    return;
  }

  // Listen for 'beforeinstallprompt' event
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('beforeinstallprompt event fired');

    // Show the install button if the prompt is available
    if (btnInstall) btnInstall.style.display = 'block';
  });

  // Handle manual install button click
  if (btnInstall) {
    btnInstall.addEventListener('click', () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choice) => {
          if (choice.outcome === 'accepted') {
            console.log('User accepted the installation (button click)');
            btnInstall.style.display = 'none';
            localStorage.setItem('pwaInstalled', 'true');
          } else {
            console.log('User dismissed the installation (button click)');
          }
          deferredInstallPrompt = null; // Clear the deferred prompt
        });
      } else {
        const message = unsupportedBrowsers.some(browser => navigator.userAgent.includes(browser))
          ? 'Currently unavailable. Please try again later.'
          : 'The installation prompt is not available at the moment.';
        alert(message);
      }
    });
  }

  // Listen for the 'appinstalled' event
  window.addEventListener('appinstalled', () => {
    console.log('App installed');
    if (btnInstall) btnInstall.style.display = 'none';
    localStorage.setItem('pwaInstalled', 'true');
  });
});
