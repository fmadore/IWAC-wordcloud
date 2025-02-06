import { WordCloud } from './components/WordCloud.js';
import { Menu } from './components/Menu.js';
import { config } from './config/settings.js';

document.addEventListener('DOMContentLoaded', () => {
    try {
        // Initialize word cloud
        const wordCloud = new WordCloud('#wordcloud');
        
        // Initialize menu with update callback and configuration
        const menu = new Menu('controls', 
            (country, wordCount) => {
                wordCloud.update(country, wordCount)
                    .catch(error => {
                        console.error('Failed to update word cloud:', error);
                        // Here you could add user-friendly error handling
                    });
            },
            {
                initialCountry: config.data.defaultCountry || 'combined',
                initialWordCount: config.data.defaultWordCount
            }
        );

        // Initial update
        wordCloud.update(menu.getCountry(), menu.getWordCount())
            .catch(error => {
                console.error('Failed to perform initial word cloud update:', error);
            });

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            menu.destroy();
        });
    } catch (error) {
        console.error('Failed to initialize application:', error);
        // Here you could add user-friendly error message display
    }
}); 