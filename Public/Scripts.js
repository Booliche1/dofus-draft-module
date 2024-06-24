const classes = [
    'Ecaflip', 'Eniripsa', 'Iop', 'Cra', 'Feca', 'Sacrieur', 'Sadida', 
    'Osamodas', 'Enutrof', 'Sram', 'Xelor', 'Pandawa', 'Roublard', 
    'Zobal', 'Steamer', 'Eliotrope', 'Huppermage', 'Ouginak', 'Forgelance'
];

const teamAPicks = document.getElementById('teamA-picks');
const teamABans = document.getElementById('teamA-bans');
const teamBPicks = document.getElementById('teamB-picks');
const teamBBans = document.getElementById('teamB-bans');

let availableClasses = [...classes];
let draftOrder = [
    { team: 'A', action: 'ban' }, { team: 'B', action: 'ban' },
    { team: 'A', action: 'ban' }, { team: 'B', action: 'ban' },
    { team: 'A', action: 'pick' }, { team: 'B', action: 'pick' },
    { team: 'B', action: 'ban' }, { team: 'A', action: 'ban' },
    { team: 'B', action: 'ban' }, { team: 'A', action: 'ban' },
    { team: 'B', action: 'pick' }, { team: 'A', action: 'pick' },
    { team: 'A', action: 'ban' }, { team: 'B', action: 'ban' },
    { team: 'A', action: 'pick' }, { team: 'B', action: 'pick' }
];

let currentStep = 0;
let draftCompleted = false;
let selectedTeam = '';

document.addEventListener('DOMContentLoaded', () => {
    createClassGrid();
    nextStep();
    document.getElementById('reset-button').addEventListener('click', resetDraft);
});

function getTeamName(team) {
    return document.getElementById(`team${team}-name`).value;
}

function createClassGrid() {
    const classGrid = document.getElementById('class-grid');
    classGrid.innerHTML = '';
    availableClasses.forEach(cls => {
        const img = document.createElement('img');
        img.src = `img/${cls}.png`;
        img.alt = cls;
        img.className = 'class-icon';
        img.onclick = () => confirmSelection(cls);
        classGrid.appendChild(img);
    });
}

function updateClassGrid() {
    const classGrid = document.getElementById('class-grid');
    const images = classGrid.getElementsByTagName('img');
    for (let img of images) {
        if (!availableClasses.includes(img.alt)) {
            img.remove();
        }
    }
}

function nextStep() {
    if (currentStep >= draftOrder.length) {
        draftCompleted = true;
        document.getElementById('selection-area').style.display = 'none';
        generateFinalDraft();  // Appel à generateFinalDraft à la fin de la draft
        return;
    }
    const { team, action } = draftOrder[currentStep];
    const teamName = getTeamName(team);
    const actionText = action.toUpperCase();
    const actionSpan = `<span class="${action === 'ban' ? 'ban-text' : 'pick-text'}">${actionText}</span>`;
    const selectionTitle = document.getElementById('selection-title');
    selectionTitle.innerHTML = `${teamName} choisi une classe à ${actionSpan}`;
    updateClassGrid();
    document.getElementById('selection-area').style.display = 'block';
    toggleSelection(team);
}

function confirmSelection(selectedClass) {
    if (draftCompleted) return;

    const { team, action } = draftOrder[currentStep];
    const element = document.createElement('img');
    element.src = `img/${selectedClass}.png`;
    element.alt = selectedClass;
    element.className = action === 'pick' ? 'pick' : 'ban';

    if (action === 'ban') {
        if (team === 'A') {
            teamABans.appendChild(element);
        } else {
            teamBBans.appendChild(element);
        }
    } else {
        if (team === 'A') {
            teamAPicks.appendChild(element);
        } else {
            teamBPicks.appendChild(element);
        }
    }

    availableClasses = availableClasses.filter(cls => cls !== selectedClass);
    currentStep++;
    document.getElementById('selection-area').style.display = 'none';
    if (currentStep < draftOrder.length) {
        nextStep();
    } else {
        generateFinalDraft();  // Appel à generateFinalDraft à la fin de la draft
    }
}

function generateFinalDraft() {
    const teamAName = getTeamName('A');
    const teamBName = getTeamName('B');

    document.getElementById('result-teamA-name').textContent = teamAName;
    document.getElementById('result-teamB-name').textContent = teamBName;

    const teamAPicksElements = teamAPicks.getElementsByTagName('img');
    const teamBPicksElements = teamBPicks.getElementsByTagName('img');

    const teamAResultPicks = document.getElementById('teamA-result-picks');
    const teamBResultPicks = document.getElementById('teamB-result-picks');

    teamAResultPicks.innerHTML = '';
    teamBResultPicks.innerHTML = '';

    for (let img of teamAPicksElements) {
        const resultImg = document.createElement('img');
        resultImg.src = `classes/${img.alt}.png`;
        resultImg.alt = img.alt;
        resultImg.className = 'final-pick';
        teamAResultPicks.appendChild(resultImg);
    }

    for (let img of teamBPicksElements) {
        const resultImg = document.createElement('img');
        resultImg.src = `classes/${img.alt}.png`;
        resultImg.alt = img.alt;
        resultImg.className = 'final-pick';
        teamBResultPicks.appendChild(resultImg);
    }

    document.getElementById('results-section').style.display = 'block';
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
}

function updateMapImage() {
    const mapInput = document.getElementById('map-input').value.trim();
    const mapImage = document.getElementById('map-image');
    if (mapInput) {
        mapImage.src = `maps/${mapInput}.png`;
        mapImage.alt = `Carte ${mapInput}`;
        mapImage.style.display = 'block';
    } else {
        mapImage.style.display = 'none';
    }
}

function resetDraft() {
    availableClasses = [...classes];
    currentStep = 0;
    draftCompleted = false;
    selectedTeam = '';

    teamAPicks.innerHTML = '';
    teamABans.innerHTML = '';
    teamBPicks.innerHTML = '';
    teamBBans.innerHTML = '';

    createClassGrid();
    nextStep();
    document.getElementById('map-input').value = '';
    const mapImage = document.getElementById('map-image');
    mapImage.style.display = 'none';

    document.getElementById('results-section').style.display = 'none';
    enableTeamSelection();
}

function adjustInputWidth(input) {
    input.style.width = `${input.value.length + 1}ch`;
}

function selectTeam(team) {
    selectedTeam = team;
    document.getElementById('select-teamA').disabled = team === 'A';
    document.getElementById('select-teamB').disabled = team === 'B';
    toggleSelection(draftOrder[currentStep].team);
}

function toggleSelection(team) {
    const classGrid = document.getElementById('class-grid');
    const images = classGrid.getElementsByTagName('img');
    for (let img of images) {
        img.onclick = (selectedTeam === team) ? () => confirmSelection(img.alt) : null;
        img.style.opacity = (selectedTeam === team) ? 1 : 0.5;
        img.style.cursor = (selectedTeam === team) ? 'pointer' : 'not-allowed';
    }
}

function getRandomClass() {
    const randomIndex = Math.floor(Math.random() * availableClasses.length);
    return availableClasses[randomIndex];
}

function generateRandomDraft() {
    resetDraft();

    const randomClasses = [...classes];
    const actions = draftOrder.map(step => step.action);
    const teams = draftOrder.map(step => step.team);

    actions.forEach((action, index) => {
        const randomIndex = Math.floor(Math.random() * randomClasses.length);
        const randomClass = randomClasses[randomIndex];
        randomClasses.splice(randomIndex, 1); // Remove the selected class from the array

        const element = document.createElement('img');
        element.src = `img/${randomClass}.png`;
        element.alt = randomClass;
        element.className = action === 'pick' ? 'pick' : 'ban';

        if (action === 'ban') {
            if (teams[index] === 'A') {
                teamABans.appendChild(element);
            } else {
                teamBBans.appendChild(element);
            }
        } else {
            if (teams[index] === 'A') {
                teamAPicks.appendChild(element);
            } else {
                teamBPicks.appendChild(element);
            }
        }
    });

    // Sélectionner une carte aléatoire
    const randomMapIndex = Math.floor(Math.random() * 50) + 1;
    const randomMap = `A${randomMapIndex}`;
    document.getElementById('map-input').value = randomMap;
    updateMapImage();

    generateFinalDraft();  // Afficher les résultats de la draft
}

function enableTeamSelection() {
    document.getElementById('select-teamA').disabled = false;
    document.getElementById('select-teamB').disabled = false;
}
