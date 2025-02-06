import { CountrySelector } from './CountrySelector.js';
import { WordCountSlider } from './WordCountSlider.js';
import { SaveButton } from './SaveButton.js';
import { saveAsPNG } from '../utils/saveUtils.js';

export class Menu {
    constructor(containerId, onUpdate) {
        this.container = document.getElementById(containerId);
        this.onUpdate = onUpdate;
        this.init();
    }

    init() {
        // Initialize components
        this.countrySelector = new CountrySelector(this.container.id);
        this.wordCountSlider = new WordCountSlider(this.container.id);
        this.saveButton = new SaveButton(this.container.id);

        // Setup event handlers
        this.countrySelector.onChange = () => this.handleUpdate();
        this.wordCountSlider.onChange = () => this.handleUpdate();
        this.saveButton.onClick = () => this.handleSave();
    }

    handleUpdate() {
        if (this.onUpdate) {
            this.onUpdate(
                this.countrySelector.getValue(),
                this.wordCountSlider.getValue()
            );
        }
    }

    handleSave() {
        const svg = document.querySelector("#wordcloud svg");
        saveAsPNG(svg);
    }

    // Public methods to access component values
    getCountry() {
        return this.countrySelector.getValue();
    }

    getWordCount() {
        return this.wordCountSlider.getValue();
    }

    // Methods to set component values
    setCountry(value) {
        this.countrySelector.setValue(value);
    }

    setWordCount(value) {
        this.wordCountSlider.setValue(value);
    }
} 