let deferredInstallPrompt;
const unsupportedBrowsers = ['Safari', 'Firefox'];

// Function to Show Message Box
function showMessage(type) {
    const container = document.getElementById('container');
    const successBox = document.getElementById('success-box');
    const errorBox = document.getElementById('error-box');

    container.style.display = 'block'; // Show message container

    if (type === 'success') {
        successBox.style.display = 'block';
        errorBox.style.display = 'none';
    } else {
        errorBox.style.display = 'block';
        successBox.style.display = 'none';
    }

    // Hide after 3 seconds
    setTimeout(() => {
        container.style.display = 'none';
    }, 3000);
}

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
                showMessage('success');
            } else {
                console.log('User dismissed installation');
                showMessage('error');
            }
            deferredInstallPrompt = null;
        });
    } else {
        if (unsupportedBrowsers.some(browser => navigator.userAgent.includes(browser))) {
            showMessage('error');
        } else {
            showMessage('error');
        }
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
