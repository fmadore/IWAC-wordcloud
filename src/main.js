import { WordCloud } from './components/WordCloud.js';
import { CountrySelector } from './components/CountrySelector.js';
import { WordCountSlider } from './components/WordCountSlider.js';
import { getTranslations } from './utils/translations.js';
import { saveAsPNG } from './utils/saveUtils.js';
import { config } from './config/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    const t = getTranslations();
    
    // Initialize save button text
    document.getElementById('saveButton').textContent = t.saveAsPNG;

    // Initialize word cloud
    const wordCloud = new WordCloud('#wordcloud');
    
    // Initialize components
    const countrySelector = new CountrySelector('controls');
    const wordCountSlider = new WordCountSlider('controls');

    // Setup update function
    const updateWordCloud = () => {
        wordCloud.update(
            countrySelector.getValue(),
            wordCountSlider.getValue()
        );
    };

    // Add event listeners
    countrySelector.onChange = updateWordCloud;
    wordCountSlider.onChange = updateWordCloud;

    document.getElementById('saveButton').addEventListener('click', () => {
        const svg = document.querySelector("#wordcloud svg");
        saveAsPNG(svg);
    });

    // Initial update
    updateWordCloud();
}); 