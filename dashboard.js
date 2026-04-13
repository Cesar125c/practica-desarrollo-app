// Global variables
let allCharacters = [];
let filteredCharacters = [];

// ========== AUTHENTICATION ==========
function checkAuth() {
    const loggedUser = localStorage.getItem('loggedUser');
    console.log('Dashboard - User:', loggedUser);
    
    if (!loggedUser) {
        window.location.href = "index.html";
        return false;
    }
    return true;
}

// ========== API FUNCTIONS ==========
async function fetchCharacters() {
    try {
        const response = await fetch("https://rickandmortyapi.com/api/character");
        const data = await response.json();
        
        allCharacters = data.results;
        filteredCharacters = [...allCharacters];
        
        displayCharacters(filteredCharacters);
        updateResultsCount(filteredCharacters.length, allCharacters.length);
        
        console.log(`${data.results.length} characters loaded successfully`);
    } catch (error) {
        console.error("Error loading characters:", error);
        const container = document.querySelector("main");
        container.innerHTML = '<div class="no-results"><i class="fas fa-exclamation-triangle"></i>❌ Error al cargar los personajes</div>';
    }
}

// ========== DISPLAY FUNCTIONS ==========
function displayCharacters(characters) {
    const container = document.querySelector("main");
    container.innerHTML = '';
    
    if (characters.length === 0) {
        container.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <h3>No se encontraron personajes</h3>
                <p>Intenta con otro nombre</p>
            </div>
        `;
        return;
    }
    
    characters.forEach(character => {
        const card = document.createElement('article');
        card.innerHTML = `
            <div class="image-container">
                <img src="${character.image}" alt="${character.name}">
            </div>
            <div>
                <h2>${character.name}</h2>
                <span class="${getStatusClass(character.status)}">${translateStatus(character.status)}</span>
            </div>
        `;
        
        // Make card clickable
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => viewCharacterDetails(character.id));
        
        container.appendChild(card);
    });
}

// ========== UTILITY FUNCTIONS ==========
function viewCharacterDetails(characterId) {
    window.location.href = `character-details.html?id=${characterId}`;
}

function filterCharacters(searchTerm) {
    if (!searchTerm || searchTerm.trim() === '') {
        filteredCharacters = [...allCharacters];
    } else {
        const term = searchTerm.toLowerCase().trim();
        filteredCharacters = allCharacters.filter(character => 
            character.name.toLowerCase().includes(term)
        );
    }
    
    displayCharacters(filteredCharacters);
    updateResultsCount(filteredCharacters.length, allCharacters.length);
}

function updateResultsCount(filtered, total) {
    const counter = document.getElementById('resultsCount');
    if (counter) {
        if (filtered === total) {
            counter.textContent = `Mostrando ${total} personajes`;
        } else {
            counter.textContent = `Mostrando ${filtered} de ${total} personajes`;
        }
    }
}

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

function logout() {
    localStorage.removeItem('loggedUser');
    window.location.href = "index.html";
}

// ========== SEARCH BAR SETUP ==========
function setupSearchBar() {
    const searchInput = document.getElementById('searchInput');
    const clearButton = document.getElementById('clearSearch');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value;
            filterCharacters(term);
            
            if (clearButton) {
                clearButton.style.display = term.length > 0 ? 'flex' : 'none';
            }
        });
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            if (searchInput) {
                searchInput.value = '';
                filterCharacters('');
                clearButton.style.display = 'none';
                searchInput.focus();
            }
        });
    }
}

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    setupSearchBar();
    fetchCharacters();
});