let deferredInstallPrompt;
const unsupportedBrowsers = ['Safari', 'Firefox'];

// Function to Show Error Box
function showErrorBox() {
const overlay = document.getElementById('overlay');
    const container = document.getElementById('container');
    overlay.style.display = 'block';
    container.style.display = 'block';  // Show the error box
document.body.classList.add('no-scroll');
    // Hide after 12 seconds
    setTimeout(() => {
    overlay.style.display = 'none';
        container.style.display = 'none';
        document.body.classList.remove('no-scroll');  // Enable scrolling again
    }, 12000);
}

// Close button functionality
document.querySelector('.close-btn').addEventListener('click', () => {
   document.getElementById('overlay').style.display = 'none'; document.getElementById('container').style.display = 'none';
    document.body.classList.remove('no-scroll');
});

// Detect if running as a PWA
const isPWA = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;

if (isPWA) {
    document.getElementById('btnInstall').style.display = 'none';
    document.getElementById('btninstall').style.display = 'none';
}

// Listen for 'beforeinstallprompt' event
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    console.log('beforeinstallprompt event fired');

    // Show install buttons
    document.getElementById('btnInstall').style.display = 'block';
    document.getElementById('btninstall').style.display = 'block';
});

// Install PWA function
function installPWA(button) {
    if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        deferredInstallPrompt.userChoice.then((choice) => {
            if (choice.outcome === 'accepted') {
                console.log('User accepted installation');
                button.style.display = 'none';
                localStorage.setItem('pwaInstalled', 'true');
            } else {
                console.log('User dismissed installation');
                showErrorBox();  // Show error box on cancel
            }
            deferredInstallPrompt = null;
        });
    } else {
        // Handle unsupported browsers or issues
        if (unsupportedBrowsers.some(browser => navigator.userAgent.includes(browser))) {
            console.log('Unsupported browser detected');
        }
        showErrorBox();  // Show error box for any issue
    }
}

// Button Click Events
document.getElementById('btnInstall').addEventListener('click', function() {
    installPWA(this);
});

document.getElementById('btninstall').addEventListener('click', function() {
    installPWA(this);
});

// Listen for 'appinstalled' event
window.addEventListener('appinstalled', () => {
    console.log('App installed');
    document.getElementById('btnInstall').style.display = 'none';
    document.getElementById('btninstall').style.display = 'none';
    localStorage.setItem('pwaInstalled', 'true');
});
