import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class CountrySelector {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('CountrySelector: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.translations = getTranslations();
        this._onChange = null;
        this.init();
    }

    init() {
        // Create container div
        const selectContainer = document.createElement('div');
        selectContainer.className = 'select-container';

        // Create label
        const label = document.createElement('label');
        label.textContent = this.translations.selectCountry;
        label.htmlFor = 'countrySelector';
        selectContainer.appendChild(label);

        // Create select element
        const select = document.createElement('select');
        select.id = 'countrySelector';
        select.setAttribute('aria-label', 'Select a country');

        // Add options
        this.config.getCountries().forEach(country => {
            const option = document.createElement('option');
            option.value = country.value;
            option.textContent = country.labelKey ? 
                this.translations[country.labelKey] : 
                country.label;
            select.appendChild(option);
        });

        // Set default value
        select.value = this.config.get('data.defaultGroup');

        // Add event listener
        select.addEventListener('change', () => {
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

    setValue(value) {
        const select = document.getElementById('countrySelector');
        select.value = value;
        if (this._onChange) {
            this._onChange();
        }
    }

    set onChange(handler) {
        this._onChange = handler;
    }
} 