import { WordCloud } from './components/wordcloud/WordCloud.js';
import { Menu } from './components/Menu.js';
import { WordList } from './components/WordList.js';
import { AppStore } from './store/AppStore.js';
import { ErrorManager } from './utils/ErrorManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const errorManager = ErrorManager.getInstance();
    
    errorManager.wrapSync(() => {
        // Initialize store
        const store = AppStore.getInstance();
        
        // Initialize components
        const wordCloud = new WordCloud('#wordcloud');
        const wordList = new WordList('wordlist');
        const menu = new Menu('controls');

        // Connect word cloud and word list
        wordCloud.setWordList(wordList);

        // Subscribe word list to store updates
        store.subscribe((newState, oldState) => {
            if (newState.currentWords !== oldState.currentWords) {
                wordList.updateWords(newState.currentWords);
            }
        });

        // Initial update
        const initialState = store.getState();
        store.updateWordCloud(
            initialState.selectedCountry,
            initialState.wordCount
        ).catch(error => {
            console.error('Failed to perform initial word cloud update:', error);
        });

        // Cleanup on page unload
        window.addEventListener('unload', () => {
            menu.destroy();
            wordList.destroy();
            wordCloud.cleanup();
        });
    }, { component: 'main', method: 'init' });
}); 