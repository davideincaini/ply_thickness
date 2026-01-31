// Material Data
const RESINS = [
    { name: "Custom", density: 0, isCustom: true },
    { name: "8020", density: 1.27 },
    { name: "8020-FR", density: 1.30 },
    { name: "BT250E-1", density: 1.24 },
    { name: "E720", density: 1.28 },
    { name: "E721-FR", density: 1.31 },
    { name: "TC275-1", density: 1.26 },
    { name: "TC350-1", density: 1.29 },
    { name: "Toray Cetex® TC1000 Design", density: 1.30 },
    { name: "Toray Cetex® TC1200", density: 1.32 },
    { name: "ARS140GEN", density: 1.18 }

];

const FIBERS = [
    { name: "Custom", density: 0, isCustom: true },
    { name: "Toray T300 / FT300", density: 1.76 },
    { name: "Toray T700G", density: 1.80 },
    { name: "Toray T700S", density: 1.80 },
    { name: "Toray T800H", density: 1.81 },
    { name: "Toray M40J", density: 1.77 },
    { name: "Toray M55J", density: 1.91 },
    { name: "AS-4D", density: 1.79 },
    { name: "IM-7", density: 1.78 },
    { name: "Glass (E)", density: 2.54 },
    { name: "Glass (S-2)", density: 2.46 },
    { name: "Kevlar 49", density: 1.44 }
];

const AREAL_WEIGHTS = [80, 100, 150, 200, 245, 265, 280, 380, 450, 540, 630, 800, 1000, 1200, 1250];

// State
let state = {
    selectedResin: null,
    customResinDensity: '',
    selectedFiber: null,
    customFiberDensity: '',
    arealWeight: 380,
    customArealWeight: '',
    isCustomArealWeight: false,
    resinContent: 40.0
};

// Calculation History (temporary, non-persistent)
let calculationHistory = [];

// Tab Navigation
let currentTab = 0; // 0 = Ply Thickness, 1 = Resin Content

// Resin Content Calculator State
let resinState = {
    shape: '',
    diameter: '',
    dimensionX: '',
    dimensionY: '',
    totalWeight: '',
    faw: ''
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    attachEventListeners();
    updateDebugInfo();
});

// Populate dropdowns
function populateSelects() {
    const resinSelect = document.getElementById('resinSelect');
    const fiberSelect = document.getElementById('fiberSelect');
    const arealWeightSelect = document.getElementById('arealWeightSelect');

    RESINS.forEach((resin, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = resin.name;
        resinSelect.appendChild(option);
    });

    FIBERS.forEach((fiber, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = fiber.name;
        fiberSelect.appendChild(option);
    });

    AREAL_WEIGHTS.forEach(weight => {
        const option = document.createElement('option');
        option.value = weight;
        option.textContent = `${weight} gsm`;
        if (weight === 380) option.selected = true;
        arealWeightSelect.appendChild(option);
    });
}

// Event Listeners
function attachEventListeners() {
    // Resin selection
    document.getElementById('resinSelect').addEventListener('change', (e) => {
        if (e.target.value !== '') {
            state.selectedResin = RESINS[parseInt(e.target.value)];
            updateResinUI();
        } else {
            state.selectedResin = null;
            document.getElementById('resinDensityInfo').textContent = '';
            document.getElementById('resinCustomInput').style.display = 'none';
        }
        updateCalculateButton();
        updateDebugInfo();
    });

    // Custom resin density
    document.getElementById('customResinDensity').addEventListener('input', (e) => {
        state.customResinDensity = e.target.value;
        validateCustomResin();
        updateCalculateButton();
        updateDebugInfo();
    });

    // Fiber selection
    document.getElementById('fiberSelect').addEventListener('change', (e) => {
        if (e.target.value !== '') {
            state.selectedFiber = FIBERS[parseInt(e.target.value)];
            updateFiberUI();
        } else {
            state.selectedFiber = null;
            document.getElementById('fiberDensityInfo').textContent = '';
            document.getElementById('fiberCustomInput').style.display = 'none';
        }
        updateCalculateButton();
        updateDebugInfo();
    });

    // Custom fiber density
    document.getElementById('customFiberDensity').addEventListener('input', (e) => {
        state.customFiberDensity = e.target.value;
        validateCustomFiber();
        updateCalculateButton();
        updateDebugInfo();
    });

    // Areal weight selection
    document.getElementById('arealWeightSelect').addEventListener('change', (e) => {
        state.arealWeight = parseInt(e.target.value);
        state.isCustomArealWeight = false;
        document.getElementById('arealWeightCustomInput').style.display = 'none';
        document.getElementById('customWeightBtn').classList.remove('active');
        updateCalculateButton();
        updateDebugInfo();
    });

    // Custom areal weight button
    document.getElementById('customWeightBtn').addEventListener('click', () => {
        state.isCustomArealWeight = !state.isCustomArealWeight;
        const customInput = document.getElementById('arealWeightCustomInput');
        const btn = document.getElementById('customWeightBtn');

        if (state.isCustomArealWeight) {
            customInput.style.display = 'block';
            btn.classList.add('active');
            btn.innerHTML = '<svg fill="white" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/></svg>';
        } else {
            customInput.style.display = 'none';
            btn.classList.remove('active');
            btn.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>';
        }
        updateCalculateButton();
        updateDebugInfo();
    });

    // Custom areal weight input
    document.getElementById('customArealWeight').addEventListener('input', (e) => {
        state.customArealWeight = e.target.value;
        validateCustomArealWeight();
        updateCalculateButton();
        updateDebugInfo();
    });

    // Resin content slider
    const slider = document.getElementById('resinContentSlider');
    slider.addEventListener('input', (e) => {
        state.resinContent = parseFloat(e.target.value);
        document.getElementById('resinContentValue').textContent = `${state.resinContent.toFixed(1)}%`;
        updateCalculateButton();
        updateDebugInfo();
    });

    // Clear button
    document.getElementById('clearBtn').addEventListener('click', clearForm);

    // Calculate button
    document.getElementById('calculateBtn').addEventListener('click', calculate);
}

// Update UI functions
function updateResinUI() {
    const info = document.getElementById('resinDensityInfo');
    const customInput = document.getElementById('resinCustomInput');

    if (state.selectedResin.isCustom) {
        info.textContent = '';
        customInput.style.display = 'block';
    } else {
        info.textContent = `Density: ${state.selectedResin.density.toFixed(2)} g/cm³`;
        customInput.style.display = 'none';
    }
}

function updateFiberUI() {
    const info = document.getElementById('fiberDensityInfo');
    const customInput = document.getElementById('fiberCustomInput');

    if (state.selectedFiber.isCustom) {
        info.textContent = '';
        customInput.style.display = 'block';
    } else {
        info.textContent = `Density: ${state.selectedFiber.density.toFixed(2)} g/cm³`;
        customInput.style.display = 'none';
    }
}

// Validation functions
function validateCustomResin() {
    const error = document.getElementById('resinError');
    const value = parseFloat(state.customResinDensity);

    if (state.customResinDensity !== '' && (isNaN(value) || value <= 0)) {
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}

function validateCustomFiber() {
    const error = document.getElementById('fiberError');
    const value = parseFloat(state.customFiberDensity);

    if (state.customFiberDensity !== '' && (isNaN(value) || value <= 0)) {
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}

function validateCustomArealWeight() {
    const error = document.getElementById('arealWeightError');
    const value = parseFloat(state.customArealWeight);

    if (state.customArealWeight !== '' && (isNaN(value) || value <= 0)) {
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}

// Get effective values
function getEffectiveResinDensity() {
    if (!state.selectedResin) return null;
    if (state.selectedResin.isCustom) {
        const value = parseFloat(state.customResinDensity);
        return (value > 0) ? value : null;
    }
    return state.selectedResin.density;
}

function getEffectiveFiberDensity() {
    if (!state.selectedFiber) return null;
    if (state.selectedFiber.isCustom) {
        const value = parseFloat(state.customFiberDensity);
        return (value > 0) ? value : null;
    }
    return state.selectedFiber.density;
}

function getEffectiveArealWeight() {
    if (state.isCustomArealWeight) {
        const value = parseFloat(state.customArealWeight);
        return (value > 0) ? value : null;
    }
    return state.arealWeight;
}

// Check if can calculate
function canCalculate() {
    return getEffectiveResinDensity() !== null &&
        getEffectiveFiberDensity() !== null &&
        getEffectiveArealWeight() !== null;
}

// Update calculate button
function updateCalculateButton() {
    const btn = document.getElementById('calculateBtn');
    const isEnabled = canCalculate();
    btn.disabled = !isEnabled;

    // Add tooltip to help users understand what's missing
    if (!isEnabled) {
        const missing = [];
        if (getEffectiveResinDensity() === null) missing.push('Resin System');
        if (getEffectiveFiberDensity() === null) missing.push('Fiber');
        if (getEffectiveArealWeight() === null) missing.push('Areal Weight');
        btn.title = `Please select: ${missing.join(', ')}`;
    } else {
        btn.title = 'Click to calculate ply thickness';
    }
}

// Update debug info (deprecated - debug UI removed)
function updateDebugInfo() {
    // Debug info UI has been removed for cleaner interface
    // This function is kept for compatibility with existing event listeners
    return;
}

// Calculate
function calculate() {
    if (!canCalculate()) return;

    const resinDensity = getEffectiveResinDensity();
    const fiberDensity = getEffectiveFiberDensity();
    const faw = getEffectiveArealWeight();
    const rc = state.resinContent / 100.0;

    // Calculations
    const nominalFiberContent = (1.0 - rc) * 100.0;
    const nominalPrepregArealWeight = faw / (1.0 - rc);
    const nominalResinArealWeight = nominalPrepregArealWeight - faw;
    const nominalFiberVolume = (faw / fiberDensity) / ((faw / fiberDensity) + (nominalResinArealWeight / resinDensity)) * 100.0;
    const nominalLaminateDensity = (nominalFiberVolume / 100.0 * fiberDensity) + ((100.0 - nominalFiberVolume) / 100.0 * resinDensity);
    const nominalCuredPlyThicknessMM = (nominalPrepregArealWeight / 1000.0) / nominalLaminateDensity;

    // Calculate overlap based on areal weight
    let overlap;
    if (faw <= 280) {
        overlap = 10;
    } else if (faw <= 630) {
        overlap = 20;
    } else {
        overlap = 30;
    }

    // Round to 3 decimals
    const round3 = (num) => Math.round(num * 1000) / 1000;

    // Display results
    document.getElementById('resultFiberContent').textContent = `${round3(nominalFiberContent).toFixed(3)}%`;
    document.getElementById('resultPrepregWeight').textContent = `${round3(nominalPrepregArealWeight).toFixed(3)} gsm`;
    document.getElementById('resultResinWeight').textContent = `${round3(nominalResinArealWeight).toFixed(3)} gsm`;
    document.getElementById('resultFiberVolume').textContent = `${round3(nominalFiberVolume).toFixed(3)}%`;
    document.getElementById('resultThicknessMM').textContent = `${round3(nominalCuredPlyThicknessMM).toFixed(3)} mm`;
    document.getElementById('resultDensity').textContent = `${round3(nominalLaminateDensity).toFixed(3)} g/cm³`;
    document.getElementById('resultOverlap').textContent = `${overlap} mm`;

    // Save to history
    const resinName = state.selectedResin ? state.selectedResin.name : `Custom (${state.customResinDensity})`;
    const fiberName = state.selectedFiber ? state.selectedFiber.name : `Custom (${state.customFiberDensity})`;

    calculationHistory.push({
        resinSystem: resinName,
        fiber: fiberName,
        arealWeight: `${faw} gsm`,
        resinContent: `${state.resinContent.toFixed(1)}%`,
        thickness: `${round3(nominalCuredPlyThicknessMM).toFixed(3)} mm`
    });

    renderHistory();

    // Show results
    document.getElementById('results').classList.add('visible');

    // Scroll to results
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Render calculation history
function renderHistory() {
    const tbody = document.getElementById('historyTableBody');
    const historyCard = document.getElementById('historyCard');

    if (calculationHistory.length === 0) {
        historyCard.style.display = 'none';
        return;
    }

    historyCard.style.display = 'block';
    tbody.innerHTML = '';

    calculationHistory.forEach((record, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${record.resinSystem}</td>
            <td>${record.fiber}</td>
            <td>${record.arealWeight}</td>
            <td>${record.resinContent}</td>
            <td>${record.thickness}</td>
        `;
        tbody.appendChild(row);
    });
}

// Clear form
function clearForm() {
    state = {
        selectedResin: null,
        customResinDensity: '',
        selectedFiber: null,
        customFiberDensity: '',
        arealWeight: 380,
        customArealWeight: '',
        isCustomArealWeight: false,
        resinContent: 40.0
    };

    // Clear calculation history
    calculationHistory = [];
    renderHistory();

    document.getElementById('resinSelect').value = '';
    document.getElementById('fiberSelect').value = '';
    document.getElementById('arealWeightSelect').value = '380';
    document.getElementById('customResinDensity').value = '';
    document.getElementById('customFiberDensity').value = '';
    document.getElementById('customArealWeight').value = '';
    document.getElementById('resinContentSlider').value = '40';
    document.getElementById('resinContentValue').textContent = '40.0%';

    document.getElementById('resinDensityInfo').textContent = '';
    document.getElementById('fiberDensityInfo').textContent = '';
    document.getElementById('resinCustomInput').style.display = 'none';
    document.getElementById('fiberCustomInput').style.display = 'none';
    document.getElementById('arealWeightCustomInput').style.display = 'none';
    document.getElementById('customWeightBtn').classList.remove('active');
    document.getElementById('customWeightBtn').innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z"/></svg>';

    document.getElementById('results').classList.remove('visible');

    updateCalculateButton();
    updateDebugInfo();
}

// ==================== TAB NAVIGATION ====================

function switchTab(tabIndex) {
    currentTab = tabIndex;

    // Update tab visual states
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach((tab, index) => {
        if (index === tabIndex) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });

    // Slide to the selected calculator
    const wrapper = document.getElementById('calculatorsWrapper');
    if (tabIndex === 0) {
        wrapper.classList.remove('slide-left');
    } else {
        wrapper.classList.add('slide-left');
    }
}

// ==================== RESIN CONTENT CALCULATOR ====================

// Initialize Resin Content Calculator event listeners
document.addEventListener('DOMContentLoaded', () => {
    // Shape selection
    const shapeSelect = document.getElementById('shapeSelect');
    shapeSelect?.addEventListener('change', (e) => {
        resinState.shape = e.target.value;
        const circularGroup = document.getElementById('circularInputGroup');
        const rectangularGroup = document.getElementById('rectangularInputGroup');

        if (e.target.value === 'circular') {
            circularGroup.style.display = 'block';
            rectangularGroup.style.display = 'none';
        } else if (e.target.value === 'rectangular') {
            circularGroup.style.display = 'none';
            rectangularGroup.style.display = 'block';
        } else {
            circularGroup.style.display = 'none';
            rectangularGroup.style.display = 'none';
        }

        updateCalculateButtonResin();
    });

    // Input event listeners
    document.getElementById('diameterInput')?.addEventListener('input', (e) => {
        resinState.diameter = e.target.value;
        updateCalculateButtonResin();
    });

    document.getElementById('dimensionXInput')?.addEventListener('input', (e) => {
        resinState.dimensionX = e.target.value;
        updateCalculateButtonResin();
    });

    document.getElementById('dimensionYInput')?.addEventListener('input', (e) => {
        resinState.dimensionY = e.target.value;
        updateCalculateButtonResin();
    });

    document.getElementById('totalWeightInput')?.addEventListener('input', (e) => {
        resinState.totalWeight = e.target.value;
        updateCalculateButtonResin();
    });

    document.getElementById('fawInputResin')?.addEventListener('input', (e) => {
        resinState.faw = e.target.value;
        updateCalculateButtonResin();
    });

    // Calculate button
    document.getElementById('calculateBtnResin')?.addEventListener('click', calculateResinContent);

    // Clear button
    document.getElementById('clearBtnResin')?.addEventListener('click', clearResinForm);
});

function updateCalculateButtonResin() {
    const btn = document.getElementById('calculateBtnResin');
    if (!btn) return;

    const canCalc = canCalculateResin();
    btn.disabled = !canCalc;
}

function canCalculateResin() {
    if (!resinState.shape) return false;
    if (!resinState.totalWeight || parseFloat(resinState.totalWeight) <= 0) return false;
    if (!resinState.faw || parseFloat(resinState.faw) <= 0) return false;

    if (resinState.shape === 'circular') {
        if (!resinState.diameter || parseFloat(resinState.diameter) <= 0) return false;
    } else if (resinState.shape === 'rectangular') {
        if (!resinState.dimensionX || parseFloat(resinState.dimensionX) <= 0) return false;
        if (!resinState.dimensionY || parseFloat(resinState.dimensionY) <= 0) return false;
    }

    return true;
}

function calculateResinContent() {
    if (!canCalculateResin()) return;

    // Get values
    const totalWeight = parseFloat(resinState.totalWeight);
    const faw = parseFloat(resinState.faw);

    // Calculate area based on shape
    let areaCm2;
    let dimensionsText;

    if (resinState.shape === 'circular') {
        const diameterMm = parseFloat(resinState.diameter);
        const radiusCm = (diameterMm / 2) / 10; // mm to cm
        areaCm2 = Math.PI * radiusCm * radiusCm;
        dimensionsText = `Ø ${diameterMm.toFixed(1)} mm`;
    } else if (resinState.shape === 'rectangular') {
        const xMm = parseFloat(resinState.dimensionX);
        const yMm = parseFloat(resinState.dimensionY);
        const xCm = xMm / 10;
        const yCm = yMm / 10;
        areaCm2 = xCm * yCm;
        dimensionsText = `${xMm.toFixed(1)} × ${yMm.toFixed(1)} mm`;
    }

    // Calculate fiber weight
    // FAW is in g/m², so convert area from cm² to m²
    const areaM2 = areaCm2 / 10000;
    const fiberWeight = areaM2 * faw;

    // Calculate resin weight
    const resinWeight = totalWeight - fiberWeight;

    // Calculate resin content percentage
    const resinContentPercent = (resinWeight / totalWeight) * 100;

    // Round to 3 decimals
    const round3 = (num) => Math.round(num * 1000) / 1000;

    // Convert area from cm² to mm² (1 cm² = 100 mm²)
    const areaMm2 = areaCm2 * 100;

    // Display results - only Area (mm²) and Resin Content (%)
    document.getElementById('resultAreaMm2').textContent = `${round3(areaMm2).toFixed(2)} mm²`;
    document.getElementById('resultResinContentPercent').textContent = `${round3(resinContentPercent).toFixed(3)}%`;

    // Show results
    document.getElementById('resultsResin').classList.add('visible');
}


function clearResinForm() {
    resinState = {
        shape: '',
        diameter: '',
        dimensionX: '',
        dimensionY: '',
        totalWeight: '',
        faw: ''
    };

    // Reset form
    document.getElementById('shapeSelect').value = '';
    document.getElementById('diameterInput').value = '';
    document.getElementById('dimensionXInput').value = '';
    document.getElementById('dimensionYInput').value = '';
    document.getElementById('totalWeightInput').value = '';
    document.getElementById('fawInputResin').value = '';

    // Hide dimension inputs
    document.getElementById('circularInputGroup').style.display = 'none';
    document.getElementById('rectangularInputGroup').style.display = 'none';

    // Hide results
    document.getElementById('resultsResin').classList.remove('visible');

}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}
