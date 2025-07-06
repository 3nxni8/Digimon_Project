// Local Storage Management for Digimon Fanbase

class DigimonStorage {
    constructor() {
        this.initializeStorage();
    }

    initializeStorage() {
        // Initialize users array if it doesn't exist
        if (!localStorage.getItem('digimonUsers')) {
            localStorage.setItem('digimonUsers', JSON.stringify([]));
        }
        
        // Initialize submitted Digimon array if it doesn't exist
        if (!localStorage.getItem('submittedDigimon')) {
            localStorage.setItem('submittedDigimon', JSON.stringify([]));
        }
    }

    // User Management
    saveUser(userData) {
        const users = this.getUsers();
        const newUser = {
            id: Date.now().toString(),
            fullName: userData.fullName,
            username: userData.username,
            email: userData.email,
            favoriteDigimon: userData.favoriteDigimon,
            region: userData.region,
            registeredAt: new Date().toISOString(),
            avatar: userData.avatar || null
        };
        
        users.push(newUser);
        localStorage.setItem('digimonUsers', JSON.stringify(users));
        return newUser;
    }

    getUsers() {
        return JSON.parse(localStorage.getItem('digimonUsers')) || [];
    }

    getUserByUsername(username) {
        const users = this.getUsers();
        return users.find(user => user.username.toLowerCase() === username.toLowerCase());
    }

    // Digimon Submission Management
    saveDigimon(digimonData, username) {
        const submittedDigimon = this.getSubmittedDigimon();
        const user = this.getUserByUsername(username);
        
        const newDigimon = {
            id: Date.now().toString(),
            name: digimonData.name,
            level: digimonData.level,
            elements: digimonData.elements,
            description: digimonData.description,
            signatureAttack: digimonData.signatureAttack,
            rarity: digimonData.rarity,
            partnerTamer: digimonData.partnerTamer || '',
            originStory: digimonData.originStory || '',
            image: digimonData.image || null,
            creator: {
                username: username,
                fullName: user ? user.fullName : 'Unknown User'
            },
            submittedAt: new Date().toISOString(),
            approved: true // Auto-approve for demo purposes
        };
        
        submittedDigimon.push(newDigimon);
        localStorage.setItem('submittedDigimon', JSON.stringify(submittedDigimon));
        return newDigimon;
    }

    getSubmittedDigimon() {
        return JSON.parse(localStorage.getItem('submittedDigimon')) || [];
    }

    getApprovedDigimon() {
        return this.getSubmittedDigimon().filter(digimon => digimon.approved);
    }

    // Session Management
    setCurrentUser(username) {
        localStorage.setItem('currentUser', username);
    }

    getCurrentUser() {
        return localStorage.getItem('currentUser');
    }

    logout() {
        localStorage.removeItem('currentUser');
    }

    isUserLoggedIn() {
        return !!this.getCurrentUser();
    }

    // Search and Filter
    searchDigimon(query, filters = {}) {
        let digimon = this.getApprovedDigimon();
        
        // Text search
        if (query) {
            digimon = digimon.filter(d => 
                d.name.toLowerCase().includes(query.toLowerCase()) ||
                d.description.toLowerCase().includes(query.toLowerCase()) ||
                d.signatureAttack.toLowerCase().includes(query.toLowerCase())
            );
        }
        
        // Level filter
        if (filters.level) {
            digimon = digimon.filter(d => d.level === filters.level);
        }
        
        // Rarity filter
        if (filters.rarity) {
            digimon = digimon.filter(d => d.rarity === filters.rarity);
        }
        
        // Element filter
        if (filters.element) {
            digimon = digimon.filter(d => d.elements.includes(filters.element));
        }
        
        return digimon;
    }
}

