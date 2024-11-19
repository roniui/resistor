document.addEventListener('DOMContentLoaded', () => {
  const footer = document.querySelector('.footer');
  const btnInstall = document.getElementById('btnInstall');
  let deferredInstallPrompt;

  // Check if the app is running as a PWA
  const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

  // If the app is installed, hide the install button and update footer text
  if (isPWA || localStorage.getItem('pwaInstalled') === 'true') {
    if (footer) {
      footer.innerHTML = `
        <p>&nbsp;Copyright &nbsp;&copy;&nbsp;2024-2025 &nbsp;&nbsp;&nbsp;Resistor Calculator</p>
      `;
    }
    if (btnInstall) {
      btnInstall.style.display = 'none'; // Hide the install button
    }
  }

  // Listen for 'beforeinstallprompt' to save the install prompt
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('Install prompt saved');
    if (btnInstall) {
      btnInstall.style.display = 'block'; // Show the install button
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
          localStorage.setItem('pwaInstalled', 'true'); // Mark the app as installed in localStorage
        } else {
          console.log('User dismissed the installation');
        }
      });
    } else {
      alert('The installation prompt is not available at the moment.');
    }
  });

  // Listen for the 'appinstalled' event and update localStorage
  window.addEventListener('appinstalled', () => {
    console.log('App installed, hiding the button');
    btnInstall.style.display = 'none';
    localStorage.setItem('pwaInstalled', 'true');
  });
});
