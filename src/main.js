import { WordCloud } from './components/wordcloud/WordCloud.js';
import { Menu } from './components/Menu.js';
import { WordList } from './components/WordList.js';
import { config } from './config/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize word cloud
        const wordCloud = new WordCloud('#wordcloud');
        
        // Initialize word list
        const wordList = new WordList('wordlist');

        // Initialize menu with update callback and configuration
        const menu = new Menu('controls', 
            async (country, wordCount) => {
                try {
                    const words = await wordCloud.update(country, wordCount);
                    wordList.updateWords(words);
                } catch (error) {
                    console.error('Failed to update word cloud:', error);
                    // Here you could add user-friendly error handling
                }
            },
            {
                initialCountry: config.data.defaultCountry || 'combined',
                initialWordCount: config.data.defaultWordCount
            }
        );

        // Initial update
        wordCloud.update(menu.getCountry(), menu.getWordCount())
            .then(words => {
                wordList.updateWords(words);
            })
            .catch(error => {
                console.error('Failed to perform initial word cloud update:', error);
            });

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            menu.destroy();
            wordList.destroy();
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        // Here you could add user-friendly error message display
    }
}); 