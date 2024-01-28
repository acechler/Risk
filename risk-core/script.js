let stats = {
    totalAttackerLosses: 0,
    totalDefenderLosses: 0,
    totalSimulations: 0
};


document.getElementById('combatForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const attackers = parseInt(document.getElementById('attackers').value, 10);
    const defenders = parseInt(document.getElementById('defenders').value, 10);

    const result = simulateCombat(attackers, defenders);
    updateStatistics(result);
    displayResult(result);
    displayStatistics();
});

document.getElementById('resetStats').addEventListener('click', function () {
    resetStatistics();
    displayStatistics();
});

function rollDice(numberOfDice) {
    let rolls = [];
    for (let i = 0; i < numberOfDice; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    return rolls.sort((a, b) => b - a);
}

function simulateCombat(attackerArmies, defenderArmies) {
    let attackerDice = Math.min(3, attackerArmies - 1);
    let defenderDice = Math.min(2, defenderArmies);

    let attackerRolls = rollDice(attackerDice);
    let defenderRolls = rollDice(defenderDice);

    let attackerLosses = 0, defenderLosses = 0;
    for (let i = 0; i < Math.min(attackerRolls.length, defenderRolls.length); i++) {
        if (attackerRolls[i] > defenderRolls[i]) {
            defenderLosses++;
        } else {
            attackerLosses++;
        }
    }

    return {
        attackerRolls,
        defenderRolls,
        attackerLosses,
        defenderLosses
    };
}

function updateStatistics(result) {
    stats.totalAttackerLosses += result.attackerLosses;
    stats.totalDefenderLosses += result.defenderLosses;
    stats.totalSimulations++;
}


function displayResult(result) {
    const resultsDiv = document.getElementById('results');
    const attackerDiceDiv = document.getElementById('attackerDice');
    const defenderDiceDiv = document.getElementById('defenderDice');
    const attackerArmiesP = document.getElementById('attackerArmies');
    const defenderArmiesP = document.getElementById('defenderArmies');

    // Display dice rolls visually
    attackerDiceDiv.innerHTML = result.attackerRolls.map(roll => `<div class="dice">${roll}</div>`).join('');
    defenderDiceDiv.innerHTML = result.defenderRolls.map(roll => `<div class="dice">${roll}</div>`).join('');

 
    // Calculate remaining armies
    let remainingAttackerArmies = parseInt(document.getElementById('attackers').value, 10) - result.attackerLosses;
    let remainingDefenderArmies = parseInt(document.getElementById('defenders').value, 10) - result.defenderLosses;
    console.log("Remaining Attacker Armies:", remainingAttackerArmies);
    console.log("Remaining Defender Armies:", remainingDefenderArmies);

    // Update army counts
    attackerArmiesP.textContent = `Remaining Armies: ${remainingAttackerArmies}`;
    defenderArmiesP.textContent = `Remaining Armies: ${remainingDefenderArmies}`;

    //TODO Fix and display the victor of a battle.
    // Check if the battle has concluded and store the conclusion message
    let battleConclusion = '';
    if (remainingAttackerArmies <= 0 || remainingDefenderArmies <= 0) {
        battleConclusion = remainingDefenderArmies <= 0 ? "<p class='battleConclusion'>Attacker wins the battle!</p>" : "<p class='battleConclusion'>Defender wins the battle!</p>";
    }

    resultsDiv.innerHTML = `
        <h3>Combat Results:</h3>
        <p>Attacker Dice Rolls: ${result.attackerRolls.join(', ')}</p>
        <p>Defender Dice Rolls: ${result.defenderRolls.join(', ')}</p>
        <p>Attacker Losses: ${result.attackerLosses}</p>
        <p>Defender Losses: ${result.defenderLosses}</p>
    `;
       // Append the battle conclusion message
       resultsDiv.innerHTML += battleConclusion;
}

function displayStatistics() {
    const statsDiv = document.getElementById('statistics');
    statsDiv.innerHTML = `
        <h3>Simulation Results:</h3>
        <p>Total Simulations: ${stats.totalSimulations}</p>
        <p>Total Attacker Losses: ${stats.totalAttackerLosses}</p>
        <p>Total Defender Losses: ${stats.totalDefenderLosses}</p>
    `;
}

function resetStatistics() {
    stats = { totalAttackerLosses: 0, totalDefenderLosses: 0, totalSimulations: 0 };
}