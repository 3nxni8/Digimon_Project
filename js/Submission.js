// Digimon Submission Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const form = document.getElementById('digimonForm');
    const nameInput = document.getElementById('digimonName');
    const levelSelect = document.getElementById('digivolLevel');
    const elementsCheckboxes = document.querySelectorAll('input[name="elements"]');
    const descriptionTextarea = document.getElementById('description');
    const attackInput = document.getElementById('signatureAttack');
    const rarityRadios = document.querySelectorAll('input[name="rarity"]');
    const imageInput = document.getElementById('digimonImage');
    const partnerInput = document.getElementById('partnerTamer');
    const submitBtn = document.querySelector('.submit-btn');
    
    // File upload elements
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInfo = document.getElementById('fileInfo');
    const fileName = document.getElementById('fileName');
    const fileSize = document.getElementById('fileSize');
    const removeFileBtn = document.getElementById('removeFile');
    
    // Success message elements
    const successMessage = document.getElementById('successMessage');
    const submittedName = document.getElementById('submittedName');
    const submitAnotherBtn = document.getElementById('submitAnother');
    
    // Character counter
    const charCount = document.getElementById('charCount');
    const charCounter = document.querySelector('.char-counter');
    
    // Mock existing attacks for uniqueness validation
    const existingAttacks = [
        'Pepper Breath', 'Blue Blaster', 'Nova Blast', 'Spiral Twister',
        'Mega Flame', 'Horn Attack', 'Lightning Paw', 'Howling Blaster'
    ];
    
    // Mock existing Digimon names for uniqueness validation
    const existingDigimonNames = [
        'Agumon', 'Gabumon', 'Patamon', 'Tentomon', 'Biyomon', 'Gomamon',
        'Palmon', 'Veemon', 'Hawkmon', 'Armadillomon', 'Wormmon', 'Guilmon',
        'Renamon', 'Terriermon', 'Lopmon', 'Impmon', 'Shoutmon', 'Dorumon'
    ];
    
    // Validation patterns
    const namePattern = /^[a-zA-Z0-9\s]{3,20}$/;
    
    // Initialize event listeners
    initializeEventListeners();
    
    function initializeEventListeners() {
        // Form submission
        form.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        nameInput.addEventListener('input', validateName);
        levelSelect.addEventListener('change', validateLevel);
        elementsCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', validateElements);
        });
        descriptionTextarea.addEventListener('input', validateDescription);
        attackInput.addEventListener('input', validateAttack);
        rarityRadios.forEach(radio => {
            radio.addEventListener('change', handleRarityChange);
        });
        partnerInput.addEventListener('input', validatePartner);
        
        // File upload handling
        fileUploadArea.addEventListener('click', () => imageInput.click());
        fileUploadArea.addEventListener('dragover', handleDragOver);
        fileUploadArea.addEventListener('drop', handleFileDrop);
        imageInput.addEventListener('change', handleFileSelect);
        removeFileBtn.addEventListener('click', removeFile);
        
        // Success message handling
        submitAnotherBtn.addEventListener('click', resetForm);
        
        // Character counter for description
        descriptionTextarea.addEventListener('input', updateCharCount);
    }
    
    // Form submission handler
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const isValid = await validateForm();
        if (isValid) {
            showSuccessMessage();
        }
    }
    
    // Validation functions
    function validateName() {
        const value = nameInput.value.trim();
        const errorElement = document.getElementById('nameError');
        
        if (!value) {
            showError(errorElement, 'Digimon name is required');
            return false;
        } else if (!namePattern.test(value)) {
            showError(errorElement, 'Name must be 3-20 characters, letters and numbers only');
            return false;
        } else if (existingDigimonNames.map(name => name.toLowerCase()).includes(value.toLowerCase())) {
            showError(errorElement, 'This Digimon name already exists. Please choose a unique name.');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validateLevel() {
        const value = levelSelect.value;
        const errorElement = document.getElementById('levelError');
        
        if (!value) {
            showError(errorElement, 'Please select a Digivolution level');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validateElements() {
        const checkedElements = document.querySelectorAll('input[name="elements"]:checked');
        const errorElement = document.getElementById('elementsError');
        
        if (checkedElements.length === 0) {
            showError(errorElement, 'Please select at least one element');
            return false;
        } else if (checkedElements.length > 2) {
            showError(errorElement, 'Maximum 2 elements allowed');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validateDescription() {
        const value = descriptionTextarea.value.trim();
        const errorElement = document.getElementById('descriptionError');
        
        if (!value) {
            showError(errorElement, 'Description is required');
            return false;
        } else if (value.length < 20) {
            showError(errorElement, 'Description must be at least 20 characters');
            return false;
        } else if (value.length > 500) {
            showError(errorElement, 'Description must not exceed 500 characters');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validateAttack() {
        const value = attackInput.value.trim();
        const errorElement = document.getElementById('attackError');
        
        if (!value) {
            showError(errorElement, 'Signature attack is required');
            return false;
        } else if (value.length < 3 || value.length > 30) {
            showError(errorElement, 'Attack name must be 3-30 characters');
            return false;
        } else if (existingAttacks.map(attack => attack.toLowerCase()).includes(value.toLowerCase())) {
            showError(errorElement, 'This attack name already exists. Please choose a unique name.');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    // Handle rarity change and conditional Origin Story field
    function handleRarityChange() {
        const selectedRarity = document.querySelector('input[name="rarity"]:checked');
        const originStorySection = document.getElementById('originStorySection');
        const originStoryTextarea = document.getElementById('originStory');
        
        if (selectedRarity && selectedRarity.value === 'legendary') {
            // Show Origin Story field for Legendary Digimon
            if (originStorySection) {
                originStorySection.style.display = 'block';
                originStoryTextarea.setAttribute('required', 'true');
                
                // Add event listener for origin story validation
                if (!originStoryTextarea.hasAttribute('data-listener-added')) {
                    originStoryTextarea.addEventListener('input', validateOriginStory);
                    originStoryTextarea.setAttribute('data-listener-added', 'true');
                }
            }
        } else {
            // Hide Origin Story field for non-Legendary Digimon
            if (originStorySection) {
                originStorySection.style.display = 'none';
                originStoryTextarea.removeAttribute('required');
                originStoryTextarea.value = '';
                hideError(document.getElementById('originStoryError'));
            }
        }
        
        validateRarity();
    }
    
    function validateOriginStory() {
        const selectedRarity = document.querySelector('input[name="rarity"]:checked');
        
        // Only validate if Legendary is selected
        if (!selectedRarity || selectedRarity.value !== 'legendary') {
            return true;
        }
        
        const value = document.getElementById('originStory').value.trim();
        const errorElement = document.getElementById('originStoryError');
        
        if (!value) {
            showError(errorElement, 'Origin story is required for Legendary Digimon');
            return false;
        } else if (value.length < 150) {
            showError(errorElement, 'Origin story must be at least 150 characters for Legendary Digimon');
            return false;
        } else if (value.length > 1000) {
            showError(errorElement, 'Origin story must not exceed 1000 characters');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validatePartner() {
        const value = partnerInput.value.trim();
        const errorElement = document.getElementById('partnerError');
        
        // Partner is optional, but if provided, validate format
        if (value && (value.length < 2 || value.length > 25)) {
            showError(errorElement, 'Partner name must be 2-25 characters if provided');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validateRarity() {
        const checkedRarity = document.querySelector('input[name="rarity"]:checked');
        const errorElement = document.getElementById('rarityError');
        
        if (!checkedRarity) {
            showError(errorElement, 'Please select a rarity level');
            return false;
        } else {
            hideError(errorElement);
            return true;
        }
    }
    
    function validateImage() {
        const errorElement = document.getElementById('imageError');
        
        if (!imageInput.files || imageInput.files.length === 0) {
            showError(errorElement, 'Please upload a Digimon image');
            return false;
        }
        
        const file = imageInput.files[0];
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showError(errorElement, 'Please upload a valid image file (JPG, PNG, GIF, or WebP)');
            return false;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            showError(errorElement, 'File size must be less than 5MB');
            return false;
        }
        
        // Validate image dimensions (optional - requires loading the image)
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = function() {
                if (this.width < 100 || this.height < 100) {
                    showError(errorElement, 'Image must be at least 100x100 pixels');
                    resolve(false);
                } else if (this.width > 2000 || this.height > 2000) {
                    showError(errorElement, 'Image must not exceed 2000x2000 pixels');
                    resolve(false);
                } else {
                    hideError(errorElement);
                    resolve(true);
                }
            };
            img.onerror = function() {
                showError(errorElement, 'Invalid image file');
                resolve(false);
            };
            img.src = URL.createObjectURL(file);
        });
    }
    
    // Complete form validation
    async function validateForm() {
        const validations = [
            validateName(),
            validateLevel(),
            validateElements(),
            validateDescription(),
            validateAttack(),
            validateRarity(),
            validatePartner(),
            validateOriginStory() // This handles conditional validation internally
        ];
        
        // Handle async image validation
        const imageValid = await validateImage();
        validations.push(imageValid);
        
        return validations.every(result => result === true);
    }
    
    // Error display functions
    function showError(errorElement, message) {
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }
    
    function hideError(errorElement) {
        if (errorElement) {
            errorElement.style.display = 'none';
            errorElement.textContent = '';
        }
    }
    
    // File upload handlers
    function handleDragOver(e) {
        e.preventDefault();
        fileUploadArea.classList.add('drag-over');
    }
    
    function handleFileDrop(e) {
        e.preventDefault();
        fileUploadArea.classList.remove('drag-over');
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    }
    
    function handleFileSelect(e) {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    }
    
    function handleFile(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
            return;
        }
        
        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            return;
        }
        
        // Display file info
        fileName.textContent = file.name;
        fileSize.textContent = formatFileSize(file.size);
        fileInfo.style.display = 'flex';
        fileUploadArea.style.display = 'none';
        
        // Create file preview
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.createElement('img');
            preview.src = e.target.result;
            preview.style.maxWidth = '100px';
            preview.style.maxHeight = '100px';
            preview.style.objectFit = 'cover';
            preview.style.borderRadius = '8px';
            
            const existingPreview = fileInfo.querySelector('img');
            if (existingPreview) {
                existingPreview.remove();
            }
            fileInfo.appendChild(preview);
        };
        reader.readAsDataURL(file);
    }
    
    function removeFile() {
        imageInput.value = '';
        fileInfo.style.display = 'none';
        fileUploadArea.style.display = 'flex';
        
        const preview = fileInfo.querySelector('img');
        if (preview) {
            preview.remove();
        }
    }
    
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // Character counter
    function updateCharCount() {
        const current = descriptionTextarea.value.length;
        const max = 500;
        charCount.textContent = `${current}/${max}`;
        
        if (current > max * 0.9) {
            charCounter.style.color = '#ff6b6b';
        } else if (current > max * 0.7) {
            charCounter.style.color = '#ffa726';
        } else {
            charCounter.style.color = '#666';
        }
    }
    
    // Success message
    function showSuccessMessage() {
        submittedName.textContent = nameInput.value;
        form.style.display = 'none';
        successMessage.style.display = 'block';
    }
    
    // Reset form
    function resetForm() {
        form.reset();
        removeFile();
        
        // Hide Origin Story section
        const originStorySection = document.getElementById('originStorySection');
        if (originStorySection) {
            originStorySection.style.display = 'none';
        }
        
        // Hide all error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(error => hideError(error));
        
        // Reset character counter
        updateCharCount();
        
        // Show form, hide success message
        successMessage.style.display = 'none';
        form.style.display = 'block';
    }
    
    // Initialize character counter on page load
    updateCharCount();
});