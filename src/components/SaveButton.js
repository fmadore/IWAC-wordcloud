import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { SaveManager } from '../utils/saveUtils.js';
import { AppStore } from '../store/AppStore.js';

export class SaveButton {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('SaveButton: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.store = AppStore.getInstance();
        this.translations = getTranslations();
        
        this.init();
    }

    init() {
        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        const button = document.createElement('button');
        button.id = 'saveButton';
        button.className = 'save-button';
        button.setAttribute('aria-label', this.translations.saveAsPNG);

        // Create icon element with updated SVG
        const icon = document.createElement('span');
        icon.className = 'save-icon';
        icon.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 15V3M12 15L8 11M12 15L16 11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M3 15V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;

        // Create text element
        const text = document.createElement('span');
        text.className = 'button-text';
        text.textContent = this.translations.saveAsPNG;

        button.appendChild(icon);
        button.appendChild(text);

        // Add event listener
        button.addEventListener('click', () => this.handleSave());

        buttonContainer.appendChild(button);
        this.container.appendChild(buttonContainer);
    }

    async handleSave() {
        try {
            const svg = document.querySelector("#wordcloud svg");
            if (!svg) {
                throw new Error('Word cloud SVG element not found');
            }
            
            // Disable button while saving
            const button = document.getElementById('saveButton');
            button.disabled = true;
            button.classList.add('saving');
            
            // Store original dimensions
            const originalWidth = svg.getAttribute('width');
            const originalHeight = svg.getAttribute('height');
            const originalViewBox = svg.getAttribute('viewBox');
            
            // Get dimensions from config
            const dimensions = this.config.get('wordcloud.dimensions');
            
            // Set explicit dimensions for export
            svg.setAttribute('width', dimensions.width);
            svg.setAttribute('height', dimensions.height);
            
            // Ensure viewBox is set correctly
            if (!originalViewBox) {
                svg.setAttribute('viewBox', `0 0 ${dimensions.width} ${dimensions.height}`);
            }
            
            // Save the image
            await SaveManager.saveAsPNG(svg);
            
            // Restore original dimensions
            if (originalWidth) svg.setAttribute('width', originalWidth);
            if (originalHeight) svg.setAttribute('height', originalHeight);
            if (originalViewBox) svg.setAttribute('viewBox', originalViewBox);
            
            // Re-enable button after save
            button.disabled = false;
            button.classList.remove('saving');
        } catch (error) {
            console.error('Error saving word cloud:', error);
            // Re-enable button if there's an error
            const button = document.getElementById('saveButton');
            button.disabled = false;
            button.classList.remove('saving');
            throw error;
        }
    }

    getExportConfig() {
        return this.config.getExportConfig();
    }
} 