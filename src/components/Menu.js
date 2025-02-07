import { CountrySelector } from './CountrySelector.js';
import { WordCountSlider } from './WordCountSlider.js';
import { SaveButton } from './SaveButton.js';
import { saveAsPNG } from '../utils/saveUtils.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { ErrorManager } from '../utils/ErrorManager.js';

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
        this.errorManager = ErrorManager.getInstance();
        this.onUpdate = onUpdate;
        this.components = {};
        this.init();
    }

    init() {
        return this.errorManager.wrapSync(() => {
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
        }, { component: 'Menu', method: 'init' });
    }

    setInitialState() {
        return this.errorManager.wrapSync(() => {
            const defaultCountry = this.config.get('data.defaultCountry');
            const defaultWordCount = this.config.get('data.defaultWordCount');
            
            if (defaultCountry) {
                this.setCountry(defaultCountry);
            }
            if (defaultWordCount) {
                this.setWordCount(defaultWordCount);
            }
        }, { component: 'Menu', method: 'setInitialState' });
    }

    handleUpdate() {
        if (this.onUpdate) {
            return this.errorManager.wrapSync(() => {
                this.onUpdate(
                    this.getCountry(),
                    this.getWordCount()
                );
            }, { 
                component: 'Menu', 
                method: 'handleUpdate',
                data: {
                    country: this.getCountry(),
                    wordCount: this.getWordCount()
                }
            });
        }
    }

    async handleSave() {
        return this.errorManager.wrapAsync(async () => {
            const svg = document.querySelector("#wordcloud svg");
            if (!svg) {
                throw new Error('Word cloud SVG element not found');
            }
            const exportConfig = this.components.saveButton.getExportConfig();
            await saveAsPNG(svg, exportConfig);
        }, { component: 'Menu', method: 'handleSave' });
    }

    // Public methods to access component values
    getCountry() {
        return this.errorManager.wrapSync(
            () => this.components.countrySelector.getValue(),
            { component: 'Menu', method: 'getCountry' }
        );
    }

    getWordCount() {
        return this.errorManager.wrapSync(
            () => this.components.wordCountSlider.getValue(),
            { component: 'Menu', method: 'getWordCount' }
        );
    }

    // Methods to set component values
    setCountry(value) {
        return this.errorManager.wrapSync(
            () => this.components.countrySelector.setValue(value),
            { component: 'Menu', method: 'setCountry', value }
        );
    }

    setWordCount(value) {
        return this.errorManager.wrapSync(
            () => this.components.wordCountSlider.setValue(value),
            { component: 'Menu', method: 'setWordCount', value }
        );
    }

    // Method to destroy/cleanup the menu
    destroy() {
        return this.errorManager.wrapSync(() => {
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
        }, { component: 'Menu', method: 'destroy' });
    }
} 