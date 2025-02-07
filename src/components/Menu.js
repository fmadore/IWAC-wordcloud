import { CountrySelector } from './CountrySelector.js';
import { WordCountSlider } from './WordCountSlider.js';
import { SaveButton } from './SaveButton.js';
import { saveAsPNG } from '../utils/saveUtils.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class Menu {
    constructor(containerId, onUpdate) {
        if (!containerId) {
            throw new Error('Menu: containerId is required');
        }

        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Menu: container with id "${containerId}" not found`);
        }

        this.config = ConfigManager.getInstance();
        this.onUpdate = onUpdate;
        this.components = {};
        this.init();
    }

    init() {
        try {
            // Create a wrapper for the controls
            const menuWrapper = document.createElement('div');
            menuWrapper.className = 'menu-wrapper';
            this.container.appendChild(menuWrapper);

            // Store the wrapper reference
            this.menuWrapper = menuWrapper;

            // Initialize components with the wrapper element
            this.components = {
                countrySelector: new CountrySelector(menuWrapper),
                wordCountSlider: new WordCountSlider(menuWrapper),
                saveButton: new SaveButton(menuWrapper)
            };

            // Setup event handlers
            this.components.countrySelector.onChange = () => this.handleUpdate();
            this.components.wordCountSlider.onChange = () => this.handleUpdate();
            this.components.saveButton.onClick = () => this.handleSave();

            // Set initial values
            this.setInitialState();
        } catch (error) {
            console.error('Failed to initialize menu:', error);
            throw error;
        }
    }

    setInitialState() {
        const defaultCountry = this.config.get('data.defaultCountry');
        const defaultWordCount = this.config.get('data.defaultWordCount');
        
        if (defaultCountry) {
            this.setCountry(defaultCountry);
        }
        if (defaultWordCount) {
            this.setWordCount(defaultWordCount);
        }
    }

    handleUpdate() {
        if (this.onUpdate) {
            try {
                this.onUpdate(
                    this.getCountry(),
                    this.getWordCount()
                );
            } catch (error) {
                console.error('Error in menu update handler:', error);
            }
        }
    }

    async handleSave() {
        try {
            const svg = document.querySelector("#wordcloud svg");
            if (!svg) {
                throw new Error('Word cloud SVG element not found');
            }
            const exportConfig = this.components.saveButton.getExportConfig();
            await saveAsPNG(svg, exportConfig);
        } catch (error) {
            console.error('Failed to save word cloud:', error);
        }
    }

    // Public methods to access component values
    getCountry() {
        return this.components.countrySelector.getValue();
    }

    getWordCount() {
        return this.components.wordCountSlider.getValue();
    }

    // Methods to set component values
    setCountry(value) {
        this.components.countrySelector.setValue(value);
    }

    setWordCount(value) {
        this.components.wordCountSlider.setValue(value);
    }

    // Method to destroy/cleanup the menu
    destroy() {
        // Remove event listeners and clean up components
        this.onUpdate = null;
        Object.values(this.components).forEach(component => {
            if (component.destroy) {
                component.destroy();
            }
        });
        this.components = {};
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
} 