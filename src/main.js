import { WordCloud } from './components/WordCloud.js';
import { CountrySelector } from './components/CountrySelector.js';
import { getTranslations } from './utils/translations.js';
import { saveAsPNG } from './utils/saveUtils.js';
import { config } from './config/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    const t = getTranslations();
    
    // Initialize UI elements with translations
    document.getElementById('wordCountLabel').textContent = t.numberOfWords;
    document.getElementById('saveButton').textContent = t.saveAsPNG;
    document.getElementById('wordCountValue').textContent = config.data.defaultWordCount;

    // Initialize word cloud
    const wordCloud = new WordCloud('#wordcloud');
    
    // Initialize country selector
    const countrySelector = new CountrySelector('controls', (selectedCountry) => {
        wordCloud.update(selectedCountry, parseInt(document.getElementById('wordCountSlider').value));
    });

    // Event Listeners
    document.getElementById('wordCountSlider').addEventListener('input', function() {
        document.getElementById('wordCountValue').textContent = this.value;
        wordCloud.update(
            countrySelector.getValue(), 
            parseInt(this.value)
        );
    });

    document.getElementById('saveButton').addEventListener('click', () => {
        const svg = document.querySelector("#wordcloud svg");
        saveAsPNG(svg);
    });

    // Initial update
    wordCloud.update('combined', config.data.defaultWordCount);
}); 