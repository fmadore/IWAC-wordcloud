import { CountrySelector } from './CountrySelector.js';
import { WordCountSlider } from './WordCountSlider.js';
import { SaveButton } from './SaveButton.js';
import { saveAsPNG } from '../utils/saveUtils.js';
import { config } from '../config/settings.js';

export class Menu {
    constructor(containerId, onUpdate, options = {}) {
        if (!containerId) {
            throw new Error('Menu: containerId is required');
        }

        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Menu: container with id "${containerId}" not found`);
        }

        this.options = {
            initialCountry: 'combined',
            initialWordCount: config.data.defaultWordCount,
            ...options
        };

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
        if (this.options.initialCountry) {
            this.setCountry(this.options.initialCountry);
        }
        if (this.options.initialWordCount) {
            this.setWordCount(this.options.initialWordCount);
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

    handleSave() {
        try {
            const svg = document.querySelector("#wordcloud svg");
            if (!svg) {
                throw new Error('Word cloud SVG element not found');
            }
            saveAsPNG(svg);
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
        // Remove event listeners and clean up components if needed
        this.onUpdate = null;
        this.components = {};
        if (this.container) {
            this.container.innerHTML = '';
        }
    }
} 