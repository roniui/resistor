  function updateColor(selectId) {
            const select = document.getElementById(selectId);
            const selectedOption = select.options[select.selectedIndex];
            const color = selectedOption.getAttribute('data-color');

            // Update the resistor bands dynamically
            if (selectId === 'band1') {
                document.getElementById('band1Resistor').style.backgroundColor = color;
            } else if (selectId === 'band2') {
                document.getElementById('band2Resistor').style.backgroundColor = color;
            } else if (selectId === 'multiplier') {
                document.getElementById('band3Resistor').style.backgroundColor = color;
            } else if (selectId === 'tolerance') {
                document.getElementById('band4Resistor').style.backgroundColor = color;
            }
        }

        function calculateResistance() {
            const band1 = parseInt(document.getElementById('band1').value);
            const band2 = parseInt(document.getElementById('band2').value);
            const multiplier = parseFloat(document.getElementById('multiplier').value);
            const tolerance = document.getElementById('tolerance').value;

            let resistanceValue = ((band1 * 10) + band2) * multiplier;
            let toleranceValue = tolerance === "gold" ? 0.05 : tolerance === "silver" ? 0.10 : 0.20;

            const lowerLimit = resistanceValue * (1 - toleranceValue);
            const upperLimit = resistanceValue * (1 + toleranceValue);

            let ohms = `${resistanceValue.toFixed(2)} Ω`;
            let kiloohms = `${(resistanceValue / 1000).toFixed(2)} kΩ `;

            document.getElementById('result').innerHTML = `
    Resistance: ${ohms} ±${(toleranceValue * 100).toFixed(0)}%<br><br>or, ${kiloohms}±${toleranceValue * 100}%<br><br>
     Range: ${lowerLimit.toFixed(2)} Ω - ${upperLimit.toFixed(2)} Ω
`;
        }

        // Initialize the resistor colors and result on page load
        window.onload = function() {
            updateColor('band1');
            updateColor('band2');
            updateColor('multiplier');
            updateColor('tolerance');
            calculateResistance(); // Automatically calculate the resistance on load
        };