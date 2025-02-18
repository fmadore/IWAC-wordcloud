import { getTranslations } from '../utils/translations.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { URLManager } from '../utils/URLManager.js';

export class WordCountSlider {
    constructor(container) {
        this.container = container instanceof HTMLElement ? container : document.getElementById(container);
        if (!this.container) {
            throw new Error('WordCountSlider: container is required');
        }
        this.config = ConfigManager.getInstance();
        this.urlManager = URLManager.getInstance();
        this.translations = getTranslations();
        this._onChange = null;
        
        // Listen for URL changes
        window.addEventListener('urlchange', (event) => {
            this.setValue(event.detail.wordCount, false);
        });
        
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
        
        labelContainer.appendChild(label);
        labelContainer.appendChild(valueDisplay);

        // Create slider input
        const slider = document.createElement('input');
        slider.type = 'range';
        slider.className = 'slider-input';
        slider.id = 'wordCountSlider';
        slider.min = this.config.get('data.minWords');
        slider.max = this.config.get('data.maxWords');
        
        // Get initial value from URL or config
        const initialState = this.urlManager.getInitialState();
        slider.value = initialState.wordCount;
        valueDisplay.textContent = initialState.wordCount;
        
        // Set initial progress
        this.updateSliderProgress(slider);
        
        slider.setAttribute('aria-label', this.translations.numberOfWords);
        slider.setAttribute('aria-valuemin', slider.min);
        slider.setAttribute('aria-valuemax', slider.max);
        slider.setAttribute('aria-valuenow', slider.value);

        // Add event listener
        slider.addEventListener('input', (e) => {
            const value = e.target.value;
            valueDisplay.textContent = value;
            slider.setAttribute('aria-valuenow', value);
            
            // Update progress
            this.updateSliderProgress(e.target);
            
            // Get current country value before updating URL
            const currentState = this.urlManager.getInitialState();
            
            // Update URL while preserving country
            this.urlManager.updateURL(currentState.country, value);
            
            if (this._onChange) {
                this._onChange();
            }
        });

        sliderContainer.appendChild(labelContainer);
        sliderContainer.appendChild(slider);
        this.container.appendChild(sliderContainer);
    }

    updateSliderProgress(slider) {
        const min = parseInt(slider.min);
        const max = parseInt(slider.max);
        const val = parseInt(slider.value);
        const percentage = ((val - min) * 100) / (max - min);
        slider.style.setProperty('--slider-progress', `${percentage}%`);
    }

    getValue() {
        return parseInt(document.getElementById('wordCountSlider').value);
    }

    setValue(value, updateURL = true) {
        const slider = document.getElementById('wordCountSlider');
        const oldValue = slider.value;
        
        // Only proceed if value has changed
        if (oldValue !== value.toString()) {
            slider.value = value;
            slider.setAttribute('aria-valuenow', value);
            
            // Update progress
            this.updateSliderProgress(slider);
            
            // Update URL if requested
            if (updateURL) {
                const currentState = this.urlManager.getInitialState();
                this.urlManager.updateURL(currentState.country, value);
            }
            
            // Trigger input event to update display
            const event = new Event('input');
            slider.dispatchEvent(event);
        }
    }

    set onChange(handler) {
        this._onChange = handler;
    }
} 