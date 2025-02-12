import { CountrySelector } from './CountrySelector.js';
import { WordCountSlider } from './WordCountSlider.js';
import { SaveButton } from './SaveButton.js';
import { SaveManager } from '../utils/saveUtils.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { ErrorManager } from '../utils/ErrorManager.js';
import { AppStore } from '../store/AppStore.js';

export class Menu {
    constructor(containerId) {
        if (!containerId) {
            throw new Error('Menu: containerId is required');
        }

        this.container = document.getElementById(containerId);
        if (!this.container) {
            throw new Error(`Menu: container with id "${containerId}" not found`);
        }

        this.config = ConfigManager.getInstance();
        this.store = AppStore.getInstance();
        this.errorManager = ErrorManager.getInstance();
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

            // Subscribe to store updates
            this.unsubscribe = this.store.subscribe(this.handleStateChange.bind(this));

            // Set initial values from store
            this.setInitialState();
        }, { component: 'Menu', method: 'init' });
    }

    setInitialState() {
        return this.errorManager.wrapSync(() => {
            const state = this.store.getState();
            
            if (state.selectedCountry) {
                this.setCountry(state.selectedCountry);
            }
            if (state.wordCount) {
                this.setWordCount(state.wordCount);
            }
        }, { component: 'Menu', method: 'setInitialState' });
    }

    handleStateChange(newState, oldState) {
        if (newState.selectedCountry !== oldState.selectedCountry) {
            this.setCountry(newState.selectedCountry);
        }
        if (newState.wordCount !== oldState.wordCount) {
            this.setWordCount(newState.wordCount);
        }
    }

    handleUpdate() {
        return this.errorManager.wrapSync(() => {
            this.store.updateWordCloud(
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

    async handleSave() {
        return this.errorManager.wrapAsync(async () => {
            const svg = document.querySelector("#wordcloud svg");
            if (!svg) {
                throw new Error('Word cloud SVG element not found');
            }
            await SaveManager.saveAsPNG(svg);
        }, { component: 'Menu', method: 'handleSave' });
    }

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

    destroy() {
        return this.errorManager.wrapSync(() => {
            if (this.unsubscribe) {
                this.unsubscribe();
            }
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