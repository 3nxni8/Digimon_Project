document.addEventListener('DOMContentLoaded', function() {
    let allDigimon = [];
    let filteredDigimon = [];
    
    // DOM Elements
    const levelFilter = document.getElementById('levelFilter');
    const rarityFilter = document.getElementById('rarityFilter');
    const elementFilter = document.getElementById('elementFilter');
    const searchFilter = document.getElementById('searchFilter');
    const randomBtn = document.querySelector('.random-btn');
    const galleryContainer = document.querySelector('.gallery-Container');
    
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
                image: './images/agumon2.jpeg', // Fixed path
                creator: { username: 'admin', fullName: 'Admin User' }
            },
            {
                name: 'Gabumon',
                level: 'Rookie', 
                elements: ['Ice'],
                description: 'A Reptile Digimon whose name and design are derived from the gaburu gaburuto onomatopoeia for biting.',
                signatureAttack: 'Blue Blaster',
                rarity: 'Common',
                partnerTamer: 'Matt Ishida',
                image: './images/gabumon.jpg', // Fixed path and filename
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
        galleryGrid.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            padding: 20px 0;
        `;
        
        if (filteredDigimon.length === 0) {
            galleryGrid.innerHTML = `
                <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
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
        card.style.cssText = `
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            cursor: pointer;
        `;
        
        card.innerHTML = `
            <div class="card-image" style="height: 200px; overflow: hidden;">
                <img src="${digimon.image || './images/Koromon_t.jpg'}" 
                     alt="${digimon.name}" 
                     style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="card-content" style="padding: 20px;">
                <div class="card-header" style="margin-bottom: 15px;">
                    <h3 style="color: #1560BD; margin-bottom: 5px;">${digimon.name}</h3>
                    <div class="card-meta" style="display: flex; gap: 10px; flex-wrap: wrap;">
                        <span class="level-badge" style="background: #6495ED; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${digimon.level}</span>
                        <span class="rarity-badge" style="background: ${getRarityColor(digimon.rarity)}; color: white; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${digimon.rarity}</span>
                    </div>
                </div>
                
                <div class="elements" style="margin-bottom: 10px;">
                    ${digimon.elements.map(element => 
                        `<span class="element-tag" style="background: #f0f9ff; color: #1560BD; padding: 2px 6px; border-radius: 8px; font-size: 11px; margin-right: 5px;">${element}</span>`
                    ).join('')}
                </div>
                
                <p class="description" style="color: #666; font-size: 14px; line-height: 1.4; margin-bottom: 15px;">
                    ${digimon.description.length > 100 ? digimon.description.substring(0, 100) + '...' : digimon.description}
                </p>
                
                <div class="card-footer" style="border-top: 1px solid #eee; padding-top: 10px;">
                    <div class="attack-info" style="margin-bottom: 8px;">
                        <strong style="color: #FF6B35;">Signature Attack:</strong> ${digimon.signatureAttack}
                    </div>
                    <div class="creator-info" style="font-size: 12px; color: #999;">
                        Created by: ${digimon.creator.fullName} (@${digimon.creator.username})
                    </div>
                </div>
            </div>
        `;
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        });
        
        // Add click event for detailed view
        card.addEventListener('click', () => showDigimonDetails(digimon));
        
        return card;
    }
    
    function getRarityColor(rarity) {
        switch(rarity.toLowerCase()) {
            case 'common': return '#7f8c8d';
            case 'rare': return '#3498db';
            case 'legendary': return '#9b59b6';
            default: return '#95a5a6';
        }
    }
    
    function showRandomDigimon() {
        if (allDigimon.length === 0) return;
        
        const randomDigimon = allDigimon[Math.floor(Math.random() * allDigimon.length)];
        showDigimonDetails(randomDigimon);
    }
    
    function showDigimonDetails(digimon) {
        // Create modal for detailed view
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;
        
        modal.innerHTML = `
            <div class="modal-content" style="background: white; border-radius: 20px; padding: 30px; max-width: 600px; width: 90%; max-height: 80%; overflow-y: auto; position: relative;">
                <div class="modal-header" style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #1560BD; margin-bottom: 10px;">${digimon.name}</h2>
                    <div style="display: flex; gap: 10px; justify-content: center; flex-wrap: wrap;">
                        <span style="background: #6495ED; color: white; padding: 5px 12px; border-radius: 15px;">${digimon.level}</span>
                        <span style="background: ${getRarityColor(digimon.rarity)}; color: white; padding: 5px 12px; border-radius: 15px;">${digimon.rarity}</span>
                    </div>
                </div>
                
                <div class="modal-image" style="text-align: center; margin-bottom: 20px;">
                    <img src="${digimon.image || './images/Koromon_t.jpg'}" alt="${digimon.name}" 
                         style="max-width: 100%; height: auto; border-radius: 10px;">
                </div>
                
                <div class="modal-details">
                    <div style="margin-bottom: 15px;">
                        <strong>Elements:</strong> ${digimon.elements.join(', ')}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Signature Attack:</strong> ${digimon.signatureAttack}
                    </div>
                    <div style="margin-bottom: 15px;">
                        <strong>Description:</strong><br>
                        ${digimon.description}
                    </div>
                    ${digimon.partnerTamer ? `<div style="margin-bottom: 15px;"><strong>Partner Tamer:</strong> ${digimon.partnerTamer}</div>` : ''}
                    ${digimon.originStory ? `<div style="margin-bottom: 15px;"><strong>Origin Story:</strong><br>${digimon.originStory}</div>` : ''}
                    <div style="border-top: 1px solid #eee; padding-top: 15px; color: #666;">
                        Created by: ${digimon.creator.fullName} (@${digimon.creator.username})
                    </div>
                </div>
                
                <button class="close-modal" style="position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 24px; cursor: pointer;">×</button>
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