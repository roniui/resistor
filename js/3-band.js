  function updateColor1(selectId) {
    const select = document.getElementById(selectId);
    const selectedOption = select.options[select.selectedIndex];
    const color = selectedOption.getAttribute('data-color');  // Use data-color for the color value

    console.log("Selected color for " + selectId + ": " + color);  // Debugging log

    if (selectId === 'band1-1') {
        document.getElementById('band1Resistor-1').style.backgroundColor = color;
    } else if (selectId === 'band2-1') {
        document.getElementById('band2Resistor-1').style.backgroundColor = color;
    } else if (selectId === 'multiplier-1') {
        document.getElementById('band3Resistor-1').style.backgroundColor = color;
    } else if (selectId === 'tolerance-1') {
        document.getElementById('band4Resistor-1').style.backgroundColor = color;
    }
}

        function calculateResistance1() {
            const band1 = parseInt(document.getElementById('band1-1').value);
            const band2 = parseInt(document.getElementById('band2-1').value);
            const multiplier = parseFloat(document.getElementById('multiplier-1').value);
            const tolerance = document.getElementById('tolerance-1').value;

            let resistanceValue = ((band1 * 10) + band2) * multiplier;
            let toleranceValue = tolerance === "gold" ? 0.05 : tolerance === "silver" ? 0.10 : 0.20;

            const lowerLimit = resistanceValue * (1 - toleranceValue);
            const upperLimit = resistanceValue * (1 + toleranceValue);

            let ohms = `${resistanceValue.toFixed(2)} Ω`;
            let kiloohms = `${(resistanceValue / 1000).toFixed(2)} kΩ `;

            document.getElementById('result-1').innerHTML = `
    Resistance: ${ohms} ±${(toleranceValue * 100).toFixed(0)}%<br><br>or, ${kiloohms}±${toleranceValue * 100}%<br><br>
     Range: ${lowerLimit.toFixed(2)} Ω - ${upperLimit.toFixed(2)} Ω
`;
        }

        window.onload = function() {
    updateColor1('band1-1');
    updateColor1('band2-1');
    updateColor1('multiplier-1');
    updateColor1('tolerance-1');
    calculateResistance1(); // For 3-band

    updateColor2('band1-2');
    updateColor2('band2-2');
    updateColor2('band3-2');
    updateColor2('multiplier-2');
    updateColor2('tolerance-2');
    calculateResistance2(); // For 5-band
};
       
    
    
    async function checkStatus() {
        let statusDot = document.getElementById("statusDot");

        try {
            // If offline, assume service worker is serving the page
            if (!navigator.onLine) {
                statusDot.style.backgroundColor = "crimson"; // Offline (served from SW)
                return;
            }

            let response = await fetch(window.location.href, { cache: "no-store" });

            // Check if the response has the Service Worker header
            if (response.headers.get("X-Service-Worker") === "true" || navigator.serviceWorker.controller) {
                statusDot.style.backgroundColor = "orange"; // Served from SW
            } else {
                statusDot.style.backgroundColor = "green"; // Served from network
            }
        } catch (error) {
            statusDot.style.backgroundColor = "crimson"; // Offline fallback
        }
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready.then(() => checkStatus());
        navigator.serviceWorker.addEventListener('controllerchange', checkStatus);
    }

    window.addEventListener('online', checkStatus);
    window.addEventListener('offline', checkStatus);

    checkStatus();
