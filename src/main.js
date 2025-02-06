import { WordCloud } from './components/WordCloud.js';
import { Menu } from './components/Menu.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize word cloud
    const wordCloud = new WordCloud('#wordcloud');
    
    // Initialize menu with update callback
    const menu = new Menu('controls', (country, wordCount) => {
        wordCloud.update(country, wordCount);
    });

    // Initial update
    wordCloud.update(menu.getCountry(), menu.getWordCount());
}); 