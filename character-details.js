// Global variables
let currentCharacter = null;

// ========== AUTHENTICATION ==========
function checkAuth() {
    const loggedUser = localStorage.getItem('loggedUser');
    console.log('Details - User:', loggedUser);
    
    if (!loggedUser) {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

// ========== URL HELPERS ==========
function getCharacterIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// ========== API FUNCTIONS ==========
async function fetchCharacterDetails(id) {
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
        
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        
        const character = await response.json();
        currentCharacter = character;
        displayCharacterDetails(character);
        
    } catch (error) {
        console.error('Error loading character:', error);
        showError('No se pudo cargar la información del personaje');
    }
}

// ========== DISPLAY FUNCTIONS ==========
function displayCharacterDetails(character) {
    const container = document.getElementById('detailsContainer');
    
    const html = `
        <div class="details-content">
            <div class="details-image">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div class="details-info">
                <h1>${character.name}</h1>
                
                <div class="info-group">
                    <span class="info-label">Estado:</span>
                    <span class="info-value ${getStatusClass(character.status)}">
                        ${translateStatus(character.status)}
                    </span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Especie:</span>
                    <span class="info-value">${character.species}</span>
                </div>
                
                ${character.type ? `
                <div class="info-group">
                    <span class="info-label">Tipo:</span>
                    <span class="info-value">${character.type}</span>
                </div>
                ` : ''}
                
                <div class="info-group">
                    <span class="info-label">Género:</span>
                    <span class="info-value">${translateGender(character.gender)}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Origen:</span>
                    <span class="info-value">${character.origin.name}</span>
                </div>
                
                <div class="info-group">
                    <span class="info-label">Ubicación:</span>
                    <span class="info-value">${character.location.name}</span>
                </div>
                
                <div class="episodes-section">
                    <h3><i class="fas fa-tv"></i> Episodios (${character.episode.length})</h3>
                    <div class="episodes-list">
                        ${character.episode.map(ep => `
                            <div class="episode-item">
                                Episodio ${getEpisodeNumber(ep)}
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML = html;
}

// ========== UTILITY FUNCTIONS ==========
function getStatusClass(status) {
    switch(status.toLowerCase()) {
        case 'alive': return 'status-alive';
        case 'dead': return 'status-dead';
        default: return 'status-unknown';
    }
}

function translateStatus(status) {
    // Spanish translations for user interface
    switch(status.toLowerCase()) {
        case 'alive': return 'Vivo';
        case 'dead': return 'Muerto';
        default: return 'Desconocido';
    }
}

function translateGender(gender) {
    // Spanish translations for user interface
    switch(gender.toLowerCase()) {
        case 'male': return 'Masculino';
        case 'female': return 'Femenino';
        case 'genderless': return 'Sin género';
        default: return 'Desconocido';
    }
}

function getEpisodeNumber(episodeUrl) {
    const parts = episodeUrl.split('/');
    return parts[parts.length - 1];
}

function showError(message) {
    const container = document.getElementById('detailsContainer');
    container.innerHTML = `
        <div class="loading">
            <i class="fas fa-exclamation-triangle" style="color: #f44336;"></i>
            <p style="color: #f44336;">${message}</p>
            <button onclick="goBackToList()" class="nav-btn back-btn" style="margin-top: 20px;">
                Volver al listado
            </button>
        </div>
    `;
}

function goBackToList() {
    window.location.href = 'dashboard.html';
}

function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = 'index.html';
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    const characterId = getCharacterIdFromURL();
    
    if (!characterId) {
        showError('No se especificó ningún personaje');
        return;
    }
    
    fetchCharacterDetails(characterId);
});