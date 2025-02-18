import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { URLManager } from '../utils/URLManager.js';

export class CountrySelector {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('CountrySelector: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.urlManager = URLManager.getInstance();
        this.translations = getTranslations();
        this._onChange = null;

        // Listen for URL changes
        window.addEventListener('urlchange', (event) => {
            this.setValue(event.detail.country, false);
        });

        this.init();
    }

    init() {
        // Create container div
        const selectContainer = document.createElement('div');
        selectContainer.className = 'select-container';

        // Create select element
        const select = document.createElement('select');
        select.id = 'countrySelector';
        select.className = 'select-input';
        select.setAttribute('aria-label', this.translations.selectCountry);

        // Add options
        this.config.getCountries().forEach(country => {
            const option = document.createElement('option');
            option.value = country.value;
            option.textContent = country.labelKey ? 
                this.translations[country.labelKey] : 
                country.label;
            select.appendChild(option);
        });

        // Get initial value from URL or config
        const initialState = this.urlManager.getInitialState();
        select.value = initialState.country;

        // Add event listener
        select.addEventListener('change', (e) => {
            // Update URL
            this.urlManager.updateURL(e.target.value, null);
            
            if (this._onChange) {
                this._onChange();
            }
        });

        selectContainer.appendChild(select);
        this.container.appendChild(selectContainer);
    }

    getValue() {
        return document.getElementById('countrySelector').value;
    }

    setValue(value, updateURL = true) {
        const select = document.getElementById('countrySelector');
        const oldValue = select.value;
        
        // Only proceed if value has changed
        if (oldValue !== value) {
            select.value = value;
            
            // Update URL if requested
            if (updateURL) {
                this.urlManager.updateURL(value, null);
            }
            
            if (this._onChange) {
                this._onChange();
            }
        }
    }

    set onChange(handler) {
        this._onChange = handler;
    }
} 