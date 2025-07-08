document.addEventListener('DOMContentLoaded', function() {
    // Initialize storage
    const digimonStorage = new DigimonStorage();
    
    let allDigimon = [];
    let filteredDigimon = [];
    
    // DOM Elements
    const levelFilter = document.getElementById('levelFilter');
    const rarityFilter = document.getElementById('rarityFilter');
    const elementFilter = document.getElementById('elementFilter');
    const searchFilter = document.getElementById('searchFilter');
    const randomBtn = document.querySelector('.random-btn');
    const galleryContainer = document.querySelector('.gallery-container');
    
    // Evolution Chain Data
    const evolutionChains = {
        // Agumon evolution line
        'agumon': {
            fresh: { name: 'Botamon', image: '../images/botamon.png', level: 'Fresh' },
            inTraining: { name: 'Koromon', image: '../images/Koromon.png', level: 'In-Training' },
            rookie: { name: 'Agumon', image: '../images/Agumon.png', level: 'Rookie' },
            champion: { name: 'Greymon', image: '../images/greymon.png', level: 'Champion' },
            ultimate: { name: 'MetalGreymon', image: '../images/metalgreymon.png', level: 'Ultimate' },
            mega: { name: 'WarGreymon', image: '../images/wargreymon.png', level: 'Mega' }
        },
        // Koromon evolution line (same as Agumon since Koromon evolves to Agumon)
        'koromon': {
            fresh: { name: 'Botamon', image: '../images/botamon.png', level: 'Fresh' },
            inTraining: { name: 'Koromon', image: '../images/koromon.png', level: 'In-Training' },
            rookie: { name: 'Agumon', image: '../images/agumon2.jpeg', level: 'Rookie' },
            champion: { name: 'Greymon', image: '../images/greymon.png', level: 'Champion' },
            ultimate: { name: 'MetalGreymon', image: '../images/metalgreymon.png', level: 'Ultimate' },
            mega: { name: 'WarGreymon', image: '../images/wargreymon.png', level: 'Mega' }
        },
        // Garurumon evolution line
        'garurumon': {
            fresh: { name: 'Punimon', image: '../images/punimon.png', level: 'Fresh' },
            inTraining: { name: 'Tsunomon', image: '../images/tsunomon.png', level: 'In-Training' },
            rookie: { name: 'Gabumon', image: '../images/gabumon.png', level: 'Rookie' },
            champion: { name: 'Garurumon', image: '../images/Garurumon_b.webp', level: 'Champion' },
            ultimate: { name: 'WereGarurumon', image: '../images/weregarurumon.png', level: 'Ultimate' },
            mega: { name: 'MetalGarurumon', image: '../images/metalgarurumon.png', level: 'Mega' }
        }
    };

    // Function to get evolution chain for a Digimon
    function getEvolutionChain(digimonName, digimonLevel) {
        const name = digimonName.toLowerCase();
        
        // Check if we have a predefined chain
        if (evolutionChains[name]) {
            return evolutionChains[name];
        }
        
        // Generate a random/simulated chain based on level
        return generateRandomEvolutionChain(digimonName, digimonLevel);
    }

    // Function to generate random evolution chain for user-submitted Digimon
    function generateRandomEvolutionChain(digimonName, digimonLevel) {
        const levels = ['Fresh', 'In-Training', 'Rookie', 'Champion', 'Ultimate', 'Mega'];
        const currentLevelIndex = levels.indexOf(digimonLevel);
        
        const chain = {
            fresh: { name: 'Unknown Fresh', image: '../images/Koromon_t.jpg', level: 'Fresh' },
            inTraining: { name: 'Unknown In-Training', image: '../images/Koromon_t.jpg', level: 'In-Training' },
            rookie: { name: 'Unknown Rookie', image: '../images/Koromon_t.jpg', level: 'Rookie' },
            champion: { name: 'Unknown Champion', image: '../images/Koromon_t.jpg', level: 'Champion' },
            ultimate: { name: 'Unknown Ultimate', image: '../images/Koromon_t.jpg', level: 'Ultimate' },
            mega: { name: 'Unknown Mega', image: '../images/Koromon_t.jpg', level: 'Mega' }
        };
        
        // Set the current Digimon at its level
        const levelKey = digimonLevel.toLowerCase().replace('-', '');
        if (chain[levelKey]) {
            chain[levelKey] = { name: digimonName, image: '../images/Koromon_t.jpg', level: digimonLevel };
        }
        
        return chain;
    }

    // Function to show evolution tree modal
    function showEvolutionTree(digimonId, digimonName, digimonLevel) {
        const evolutionChain = getEvolutionChain(digimonName, digimonLevel);
        
        // Create modal for evolution tree
        const modal = document.createElement('div');
        modal.className = 'modal evolution-modal';
        
        modal.innerHTML = `
            <div class="modal-content evolution-modal-content">
                <div class="modal-header">
                    <h2>${digimonName} Evolution Tree</h2>
                    <p class="evolution-subtitle">Complete Evolution Lineage</p>
                </div>
                
                <div class="evolution-tree">
                    <div class="evolution-stage">
                        <div class="evolution-card">
                            <img src="${evolutionChain.fresh.image}" alt="${evolutionChain.fresh.name}">
                            <h4>${evolutionChain.fresh.name}</h4>
                            <span class="evolution-level">${evolutionChain.fresh.level}</span>
                        </div>
                        <div class="evolution-arrow">▼</div>
                    </div>
                    
                    <div class="evolution-stage">
                        <div class="evolution-card">
                            <img src="${evolutionChain.inTraining.image}" alt="${evolutionChain.inTraining.name}">
                            <h4>${evolutionChain.inTraining.name}</h4>
                            <span class="evolution-level">${evolutionChain.inTraining.level}</span>
                        </div>
                        <div class="evolution-arrow">▼</div>
                    </div>
                    
                    <div class="evolution-stage">
                        <div class="evolution-card">
                            <img src="${evolutionChain.rookie.image}" alt="${evolutionChain.rookie.name}">
                            <h4>${evolutionChain.rookie.name}</h4>
                            <span class="evolution-level">${evolutionChain.rookie.level}</span>
                        </div>
                        <div class="evolution-arrow">▼</div>
                    </div>
                    
                    <div class="evolution-stage">
                        <div class="evolution-card">
                            <img src="${evolutionChain.champion.image}" alt="${evolutionChain.champion.name}">
                            <h4>${evolutionChain.champion.name}</h4>
                            <span class="evolution-level">${evolutionChain.champion.level}</span>
                        </div>
                        <div class="evolution-arrow">▼</div>
                    </div>
                    
                    <div class="evolution-stage">
                        <div class="evolution-card">
                            <img src="${evolutionChain.ultimate.image}" alt="${evolutionChain.ultimate.name}">
                            <h4>${evolutionChain.ultimate.name}</h4>
                            <span class="evolution-level">${evolutionChain.ultimate.level}</span>
                        </div>
                        <div class="evolution-arrow">▼</div>
                    </div>
                    
                    <div class="evolution-stage">
                        <div class="evolution-card">
                            <img src="${evolutionChain.mega.image}" alt="${evolutionChain.mega.name}">
                            <h4>${evolutionChain.mega.name}</h4>
                            <span class="evolution-level">${evolutionChain.mega.level}</span>
                        </div>
                    </div>
                </div>
                
                <button class="close-modal">×</button>
            </div>
        `;
        
        // Add close functionality
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('close-modal')) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    // Make showEvolutionTree globally available
    window.showEvolutionTree = showEvolutionTree;

    // Initialize gallery
    initializeGallery();
    
    function initializeGallery() {
        loadDigimon();
        setupEventListeners();
        displayDigimon();
    }
    
    function loadDigimon() {
        // Get submitted Digimon from storage
        allDigimon = digimonStorage.getApprovedDigimon();
        filteredDigimon = [...allDigimon];
        
        // Add some default Digimon if none exist
        if (allDigimon.length === 0) {
            addDefaultDigimon();
            allDigimon = digimonStorage.getApprovedDigimon();
            filteredDigimon = [...allDigimon];
        }
    }
    
    function addDefaultDigimon() {
        const defaultDigimon = [
            {
                id: 'agumon',
                name: 'Agumon',
                level: 'Rookie',
                elements: ['Fire'],
                description: 'A small Dinosaur Digimon. It has grown up and become able to walk on two legs, and has an appearance like a small dinosaur.',
                signatureAttack: 'Pepper Breath',
                rarity: 'Common',
                partnerTamer: 'Tai Kamiya',
                image: '../images/agumon2.jpeg',
                creator: { username: 'admin', fullName: 'Admin User' }
            },
            {
                id: 'koromon',
                name: 'Koromon',
                level: 'In-Training', 
                elements: ['Light'],  // Changed from 'Normal' to 'Light'
                description: 'A Lesser Digimon whose body is mostly just a head. It is able to move by hopping, and although it is cute, it has a fierce side.',
                signatureAttack: 'Bubble Blow',
                rarity: 'Common',
                partnerTamer: 'Tai Kamiya',
                image: '../images/Koromon_t.jpg',
                creator: { username: 'admin', fullName: 'Admin User' }
            },
            {
                id: 'garurumon',
                name: 'Garurumon',
                level: 'Champion',
                elements: ['Ice'],  // Changed from ['Ice', 'Beast'] to just ['Ice']
                description: 'A Beast Digimon whose whole body is covered in blue, white, and silver-colored fur.',
                signatureAttack: 'Howling Blaster',
                rarity: 'Rare',
                partnerTamer: 'Matt Ishida',
                image: '../images/Garurumon_b.webp',
                creator: { username: 'admin', fullName: 'Admin User' }
            }
        ];
        
        defaultDigimon.forEach(digimon => {
            digimonStorage.saveDigimon(digimon, 'admin');
        });
    }
    
    function setupEventListeners() {
        levelFilter.addEventListener('change', applyFilters);
        rarityFilter.addEventListener('change', applyFilters);
        elementFilter.addEventListener('change', applyFilters);
        searchFilter.addEventListener('input', applyFilters);
        randomBtn.addEventListener('click', showRandomDigimon);
    }
    
    function applyFilters() {
        const filters = {
            level: levelFilter.value,
            rarity: rarityFilter.value,
            element: elementFilter.value
        };
        
        const searchQuery = searchFilter.value.trim();
        
        filteredDigimon = digimonStorage.searchDigimon(searchQuery, filters);
        displayDigimon();
    }
    
    function displayDigimon() {
    // Remove existing gallery grid if it exists
    const existingGrid = document.querySelector('.digimon-grid');
    if (existingGrid) {
        existingGrid.remove();
    }
    

        
        // Create gallery grid
        const galleryGrid = document.createElement('div');
        galleryGrid.className = 'digimon-grid';
        
        if (filteredDigimon.length === 0) {
            galleryGrid.innerHTML = `
                <div class="empty-state">
                    <h3>No Digimon found</h3>
                    <p>Try adjusting your filters or <a href="submit.html">submit a new Digimon</a>!</p>
                </div>
            `;
        } else {
            filteredDigimon.forEach(digimon => {
                const card = createDigimonCard(digimon);
                galleryGrid.appendChild(card);
            });
        }
        
        galleryContainer.appendChild(galleryGrid);
    }
    
    function createDigimonCard(digimon) {
        const card = document.createElement('div');
        card.className = 'digimon-card';
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${digimon.image && digimon.image.trim() !== '' ? digimon.image : '../images/Koromon_t.jpg'}" 
                     alt="${digimon.name}">
            </div>
            <div class="card-content">
                <div class="card-header">
                    <h3>${digimon.name}</h3>
                    <div class="card-meta">
                        <span class="level-badge">${digimon.level}</span>
                        <span class="rarity-badge rarity-${digimon.rarity.toLowerCase()}">${digimon.rarity}</span>
                    </div>
                </div>
                
                <div class="elements">
                    ${digimon.elements.map(element => 
                        `<span class="element-tag">${element}</span>`
                    ).join('')}
                </div>
                
                <p class="description">
                    ${digimon.description.length > 200 ? digimon.description.substring(0, 200) + '...' : digimon.description}
                </p>
                
                <div class="card-footer">
                    <div class="attack-info">
                        <strong>Signature Attack:</strong> ${digimon.signatureAttack}
                    </div>
                    <div class="card-actions">
                        <button class="evolution-tree-btn" onclick="event.stopPropagation(); showEvolutionTree('${digimon.id}', '${digimon.name}', '${digimon.level}')">
                            View Evolution Tree
                        </button>
                    </div>
                    <div class="creator-info">
                        Created by: ${digimon.creator.fullName} (@${digimon.creator.username})
                    </div>
                </div>
            </div>
        `;
        
        // Add click event for detailed view
        card.addEventListener('click', () => showDigimonDetails(digimon));
        
        return card;
    }
    
    function showRandomDigimon() {
        if (allDigimon.length === 0) return;
        
        const randomDigimon = allDigimon[Math.floor(Math.random() * allDigimon.length)];
        showDigimonDetails(randomDigimon);
    }
    
   
    // Make generateRandomDigimon globally available for the button onclick
    window.generateRandomDigimon = showRandomDigimon;
});