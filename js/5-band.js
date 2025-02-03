function updateColor2(selectId) {
            const select = document.getElementById(selectId);
            const selectedOption = select.options[select.selectedIndex];
            const color = selectedOption.getAttribute('data-color');

            // Update the resistor bands dynamically
            if (selectId === 'band1-2') {
                document.getElementById('band1Resistor-2').style.backgroundColor = color;
            } else if (selectId === 'band2-2') {
                                document.getElementById('band2Resistor-2').style.backgroundColor = color;
            } else if (selectId === 'band3-2') {
                document.getElementById('band3Resistor-2').style.backgroundColor = color;
            } else if (selectId === 'multiplier-2') {
                document.getElementById('band4Resistor-2').style.backgroundColor = color;
            }else if (selectId === 'tolerance-2') {
                document.getElementById('band5Resistor-2').style.backgroundColor = color;
            }
        }


// Calculate the resistance
function calculateResistance2() {
    const band1 = parseInt(document.getElementById('band1-2').value);
    const band2 = parseInt(document.getElementById('band2-2').value);
    const band3 = parseInt(document.getElementById('band3-2').value);
    const multiplier = parseFloat(document.getElementById('multiplier-2').value);
    const tolerance = parseFloat(document.getElementById('tolerance-2').value);

    let resistanceValue = ((band1 * 100) + (band2 * 10) + band3) * multiplier;
    const tolerancePercentage = tolerance / 100;

    // Calculate lower and upper bounds
    const lowerLimit = resistanceValue * (1 - tolerancePercentage);
    const upperLimit = resistanceValue * (1 + tolerancePercentage);

    // Format resistance in Ohms, kOhms
    const ohms = `${resistanceValue.toFixed(2)} Ω ±${tolerance}%`;
    const kiloOhms = resistanceValue >= 1e3 ? `${(resistanceValue / 1e3).toFixed(2)} kΩ ±${tolerance}%` : null;
    
    // Display result
    document.getElementById('result-2').innerHTML =
        `Resistance: ${ohms}<br><br>` +
        (kiloOhms ? `(${kiloOhms}) <br><br>` : "") +
            `Range: [${lowerLimit.toFixed(2)} Ω - ${upperLimit.toFixed(2)} Ω]`;
}

// Initialize the resistor colors and result on page load
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

    // Handle query parameters
    const params = new URLSearchParams(window.location.search);
    const band = params.get("band");

    if (band) {
        const targetElement = document.getElementById(`bands-${band}`);
        if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
        }
    }
};
