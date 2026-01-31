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

const AREAL_WEIGHTS = [70, 80, 100, 120, 130, 140, 145, 150, 200, 245, 280,380, 400,450,540,630,800,1000,1250];

// State
let state = {
    selectedResin: null,
    customResinDensity: '',
    selectedFiber: null,
    customFiberDensity: '',
    arealWeight: 145,
    customArealWeight: '',
    isCustomArealWeight: false,
    resinContent: 35.0
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateSelects();
    attachEventListeners();

    // Sync JS state with DOM defaults (in case the HTML has a selected value)
    const awSelect = document.getElementById('arealWeightSelect');
    if (awSelect && awSelect.value) {
        state.arealWeight = parseInt(awSelect.value) || state.arealWeight;
    }

    const slider = document.getElementById('resinContentSlider');
    if (slider && slider.value) {
        state.resinContent = parseFloat(slider.value) || state.resinContent;
        document.getElementById('resinContentValue').textContent = `${state.resinContent.toFixed(1)}%`;
    }

    // Ensure UI functions are safe to call when nothing is selected
    updateResinUI();
    updateFiberUI();

    // Update controls and debug at load
    updateCalculateButton();
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
        if (weight === 145) option.selected = true;
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
            btn.innerHTML = '<svg fill="white" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1[...]'/></svg>';
        } else {
            customInput.style.display = 'none';
            btn.classList.remove('active');
            btn.innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83[...]"/></svg>';
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
    
    if (!state.selectedResin) {
        info.textContent = '';
        customInput.style.display = 'none';
        return;
    }
    
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
    
    if (!state.selectedFiber) {
        info.textContent = '';
        customInput.style.display = 'none';
        return;
    }
    
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
    btn.disabled = !canCalculate();
}

// Update debug info
function updateDebugInfo() {
    const debugInfo = document.getElementById('debugInfo');
    const debugContent = document.getElementById('debugContent');
    
    // Show debug only in development (you can remove this in production)
    const showDebug = false; // Set to false to hide debug info
    
    if (!showDebug) {
        debugInfo.style.display = 'none';
        return;
    }
    
    const resinDensity = getEffectiveResinDensity();
    const fiberDensity = getEffectiveFiberDensity();
    const arealWeight = getEffectiveArealWeight();
    
    let html = ''; 
    
    if (resinDensity !== null) {
        html += `<div class="valid">Resin Density: ${resinDensity}</div>`;
    } else if (state.selectedResin) {
        html += `<div class="invalid">Resin Density: INVALID</div>`;
    }
    
    if (fiberDensity !== null) {
        html += `<div class="valid">Fiber Density: ${fiberDensity}</div>`;
    } else if (state.selectedFiber) {
        html += `<div class="invalid">Fiber Density: INVALID</div>`;
    }
    
    if (arealWeight !== null) {
        html += `<div class="valid">Areal Weight: ${arealWeight}</div>`;
    } else {
        html += `<div class="invalid">Areal Weight: INVALID</div>`;
    }
    
    html += `<div class="${canCalculate() ? 'valid' : 'invalid'}">Can Calculate: ${canCalculate() ? 'YES' : 'NO'}</div>`;
    
    debugContent.innerHTML = html;
    
    if (state.selectedResin || state.selectedFiber) {
        debugInfo.style.display = 'block';
    } else {
        debugInfo.style.display = 'none';
    }
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
    const nominalCuredPlyThicknessMils = nominalCuredPlyThicknessMM * 39.3701;
    
    // Round to 3 decimals
    const round3 = (num) => Math.round(num * 1000) / 1000;
    
    // Display results
    document.getElementById('resultFiberContent').textContent = `${round3(nominalFiberContent).toFixed(3)}%`;
    document.getElementById('resultPrepregWeight').textContent = `${round3(nominalPrepregArealWeight).toFixed(3)} gsm`;
    document.getElementById('resultResinWeight').textContent = `${round3(nominalResinArealWeight).toFixed(3)} gsm`;
    document.getElementById('resultFiberVolume').textContent = `${round3(nominalFiberVolume).toFixed(3)}%`;
    document.getElementById('resultThicknessMM').textContent = `${round3(nominalCuredPlyThicknessMM).toFixed(3)} mm`;
    // note: intentionally NOT writing to resultThicknessMils (element not present)
    document.getElementById('resultDensity').textContent = `${round3(nominalLaminateDensity).toFixed(3)} g/cm³`;
    
    // Show results
    document.getElementById('results').classList.add('visible');
    
    // Scroll to results
    setTimeout(() => {
        document.getElementById('results').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Clear form
function clearForm() {
    state = {
        selectedResin: null,
        customResinDensity: '',
        selectedFiber: null,
        customFiberDensity: '',
        arealWeight: 145,
        customArealWeight: '',
        isCustomArealWeight: false,
        resinContent: 35.0
    };  
    
    document.getElementById('resinSelect').value = '';
    document.getElementById('fiberSelect').value = '';
    document.getElementById('arealWeightSelect').value = '145';
    document.getElementById('customResinDensity').value = '';
    document.getElementById('customFiberDensity').value = '';
    document.getElementById('customArealWeight').value = '';
    document.getElementById('resinContentSlider').value = '35';
    document.getElementById('resinContentValue').textContent = '35.0%';
    
    document.getElementById('resinDensityInfo').textContent = '';
    document.getElementById('fiberDensityInfo').textContent = '';
    document.getElementById('resinCustomInput').style.display = 'none';
    document.getElementById('fiberCustomInput').style.display = 'none';
    document.getElementById('arealWeightCustomInput').style.display = 'none';
    document.getElementById('customWeightBtn').classList.remove('active');
    document.getElementById('customWeightBtn').innerHTML = '<svg fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 [...]"/></svg>';
    
    document.getElementById('results').classList.remove('visible');
    
    updateCalculateButton();
    updateDebugInfo();
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(reg => console.log('Service Worker registered'))
            .catch(err => console.log('Service Worker registration failed'));
    });
}