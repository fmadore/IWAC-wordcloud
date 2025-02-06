import { getTranslations } from '../utils/translations.js';
import { config } from '../config/settings.js';

export class WordCountSlider {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.translations = getTranslations();
        this.config = {
            min: 10,
            max: 150,
            default: config.data.defaultWordCount
        };
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
        label.textContent = this.translations.numberOfWords;
        
        const valueDisplay = document.createElement('span');
        valueDisplay.className = 'slider-value';
        valueDisplay.textContent = this.config.default;
        
        labelContainer.appendChild(label);
        labelContainer.appendChild(document.createTextNode(': '));
        labelContainer.appendChild(valueDisplay);

        // Create slider
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.id = 'wordCountSlider';
        slider.min = this.config.min;
        slider.max = this.config.max;
        slider.value = this.config.default;

        // Add event listener
        slider.addEventListener('input', (e) => {
            valueDisplay.textContent = e.target.value;
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
        const event = new Event('input');
        slider.dispatchEvent(event);
    }

    set onChange(handler) {
        this._onChange = handler;
    }
} 