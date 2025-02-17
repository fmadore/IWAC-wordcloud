import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';

export class WordCountSlider {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('WordCountSlider: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.translations = getTranslations();
        this._onChange = null;
        
        this.init();
    }

    init() {
        const sliderContainer = document.createElement('div');
        sliderContainer.className = 'slider-container';

        // Create label and value display
        const labelContainer = document.createElement('div');
        labelContainer.className = 'slider-label';
        
        const label = document.createElement('span');
        label.className = 'slider-text';
        label.textContent = this.translations.numberOfWords;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = this.config.get('data.defaultWordCount');
        
        labelContainer.appendChild(label);
        labelContainer.appendChild(valueDisplay);

        // Create slider input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'slider-input';
        slider.id = 'wordCountSlider';
        slider.min = this.config.get('data.minWords');
        slider.max = this.config.get('data.maxWords');
        slider.value = this.config.get('data.defaultWordCount');
        slider.setAttribute('aria-label', this.translations.numberOfWords);
        slider.setAttribute('aria-valuemin', slider.min);
        slider.setAttribute('aria-valuemax', slider.max);
        slider.setAttribute('aria-valuenow', slider.value);

        // Add event listener
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = value;
            slider.setAttribute('aria-valuenow', value);
            if (this._onChange) {
                this._onChange();
            }
        });

        sliderContainer.appendChild(labelContainer);
        sliderContainer.appendChild(slider);
        this.container.appendChild(sliderContainer);
    }

    getValue() {
        return parseInt(document.getElementById('wordCountSlider').value);
    }

    setValue(value) {
        const slider = document.getElementById('wordCountSlider');
        slider.value = value;
        slider.setAttribute('aria-valuenow', value);
        const event = new Event('input');
        slider.dispatchEvent(event);
    }

    set onChange(handler) {
        this._onChange = handler;
    }
} 