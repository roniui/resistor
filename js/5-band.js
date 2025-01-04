function updateColor(selectId) {
            const select = document.getElementById(selectId);
            const selectedOption = select.options[select.selectedIndex];
            const color = selectedOption.getAttribute('data-color');

            // Update the resistor bands dynamically
            if (selectId === 'band1') {
                document.getElementById('band1Resistor').style.backgroundColor = color;
            } else if (selectId === 'band2') {
                                document.getElementById('band2Resistor').style.backgroundColor = color;
            } else if (selectId === 'band3') {
                document.getElementById('band3Resistor').style.backgroundColor = color;
            } else if (selectId === 'multiplier') {
                document.getElementById('band4Resistor').style.backgroundColor = color;
            }else if (selectId === 'tolerance') {
                document.getElementById('band5Resistor').style.backgroundColor = color;
            }
        }


// Calculate the resistance
function calculateResistance() {
    const band1 = parseInt(document.getElementById('band1').value);
    const band2 = parseInt(document.getElementById('band2').value);
    const band3 = parseInt(document.getElementById('band3').value);
    const multiplier = parseFloat(document.getElementById('multiplier').value);
    const tolerance = parseFloat(document.getElementById('tolerance').value);

    let resistanceValue = ((band1 * 100) + (band2 * 10) + band3) * multiplier;
    const tolerancePercentage = tolerance / 100;

    // Calculate lower and upper bounds
    const lowerLimit = resistanceValue * (1 - tolerancePercentage);
    const upperLimit = resistanceValue * (1 + tolerancePercentage);

    // Format resistance in Ohms, kOhms
    const ohms = `${resistanceValue.toFixed(2)} Ω ±${tolerance}%`;
    const kiloOhms = resistanceValue >= 1e3 ? `${(resistanceValue / 1e3).toFixed(2)} kΩ ±${tolerance}%` : null;
    
    // Display result
    document.getElementById('result').innerHTML =
        `Resistance: ${ohms}<br><br>` +
        (kiloOhms ? `(${kiloOhms}) <br><br>` : "") +
            `Range: [${lowerLimit.toFixed(2)} Ω - ${upperLimit.toFixed(2)} Ω]`;
}

// Initialize the resistor colors and result on page load
        window.onload = function() {
            updateColor('band1');
            updateColor('band2');
            updateColor('band3');
            updateColor('multiplier');
            updateColor('tolerance');
                        
                            
            calculateResistance(); // Automatically calculate the resistance on load
        };