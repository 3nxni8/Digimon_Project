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
                name: 'Koromon',
                level: 'In-Training', 
                elements: ['Normal'],
                description: 'A Lesser Digimon whose body is mostly just a head. It is able to move by hopping, and although it is cute, it has a fierce side.',
                signatureAttack: 'Bubble Blow',
                rarity: 'Common',
                partnerTamer: 'Tai Kamiya',
                image: '../images/Koromon_t.jpg',
                creator: { username: 'admin', fullName: 'Admin User' }
            },
            {
                name: 'Garurumon',
                level: 'Champion',
                elements: ['Ice', 'Beast'],
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
                <img src="${digimon.image || '../images/Koromon_t.jpg'}" 
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
                    ${digimon.description.length > 100 ? digimon.description.substring(0, 100) + '...' : digimon.description}
                </p>
                
                <div class="card-footer">
                    <div class="attack-info">
                        <strong>Signature Attack:</strong> ${digimon.signatureAttack}
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
    
    function showDigimonDetails(digimon) {
        // Create modal for detailed view
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>${digimon.name}</h2>
                    <div class="badge-container">
                        <span class="level-badge">${digimon.level}</span>
                        <span class="rarity-badge rarity-${digimon.rarity.toLowerCase()}">${digimon.rarity}</span>
                    </div>
                </div>
                
                <div class="modal-image">
                    <img src="${digimon.image || '../images/Koromon_t.jpg'}" alt="${digimon.name}">
                </div>
                
                <div class="modal-details">
                    <div>
                        <strong>Elements:</strong> ${digimon.elements.join(', ')}
                    </div>
                    <div>
                        <strong>Signature Attack:</strong> ${digimon.signatureAttack}
                    </div>
                    <div>
                        <strong>Description:</strong><br>
                        ${digimon.description}
                    </div>
                    ${digimon.partnerTamer ? `<div><strong>Partner Tamer:</strong> ${digimon.partnerTamer}</div>` : ''}
                    ${digimon.originStory ? `<div><strong>Origin Story:</strong><br>${digimon.originStory}</div>` : ''}
                    <div class="creator-info">
                        Created by: ${digimon.creator.fullName} (@${digimon.creator.username})
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
    
    // Make generateRandomDigimon globally available for the button onclick
    window.generateRandomDigimon = showRandomDigimon;
});