import { getTranslations } from '../utils/translations.js';

export class CountrySelector {
    constructor(containerId, onChange) {
        this.container = document.getElementById(containerId);
        this.onChange = onChange;
        this.translations = getTranslations();
        this.countries = [
            { value: 'combined', labelKey: 'allCountries' },
            { value: 'bénin', label: 'Bénin' },
            { value: 'burkina_faso', label: 'Burkina Faso' },
            { value: 'togo', label: 'Togo' }
        ];
        
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
        this.countries.forEach(country => {
            const option = document.createElement('option');
            option.value = country.value;
            option.textContent = country.labelKey ? 
                this.translations[country.labelKey] : 
                country.label;
            select.appendChild(option);
        });

        // Add event listener
        select.addEventListener('change', (e) => {
            if (this.onChange) {
                this.onChange(e.target.value);
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
        if (this.onChange) {
            this.onChange(value);
        }
    }
} 