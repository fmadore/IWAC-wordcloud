import { WordCloud } from './components/WordCloud.js';
import { getTranslations } from './utils/translations.js';
import { saveAsPNG } from './utils/saveUtils.js';
import { config } from './config/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    const t = getTranslations();
    
    // Initialize UI elements with translations
    document.querySelector('#countrySelector option[value="combined"]').textContent = t.allCountries;
    document.getElementById('wordCountLabel').textContent = t.numberOfWords;
    document.getElementById('saveButton').textContent = t.saveAsPNG;
    document.getElementById('countrySelectorLabel').textContent = t.selectCountry;
    document.getElementById('wordCountValue').textContent = config.data.defaultWordCount;

    // Initialize word cloud
    const wordCloud = new WordCloud('#wordcloud');
    wordCloud.update('combined', config.data.defaultWordCount);

    // Event Listeners
    document.getElementById('countrySelector').addEventListener('change', function() {
        wordCloud.update(this.value, parseInt(document.getElementById('wordCountSlider').value));
    });

    document.getElementById('wordCountSlider').addEventListener('input', function() {
        document.getElementById('wordCountValue').textContent = this.value;
        wordCloud.update(
            document.getElementById('countrySelector').value, 
            parseInt(this.value)
        );
    });

    document.getElementById('saveButton').addEventListener('click', () => {
        const svg = document.querySelector("#wordcloud svg");
        saveAsPNG(svg);
    });
}); 