import { ConfigManager } from '../config/ConfigManager.js';

export class URLManager {
    static instance = null;

    constructor() {
        if (URLManager.instance) {
            return URLManager.instance;
        }
        
        this.config = ConfigManager.getInstance();
        this.params = new URLSearchParams(window.location.search);
        
        // Initialize URL handling
        window.addEventListener('popstate', () => this.handleURLChange());
        
        URLManager.instance = this;
    }

    static getInstance() {
        if (!URLManager.instance) {
            URLManager.instance = new URLManager();
        }
        return URLManager.instance;
    }

    getInitialState() {
        const country = this.params.get('country') || this.config.get('data.defaultGroup');
        const wordCount = parseInt(this.params.get('words')) || this.config.get('data.defaultWordCount');
        
        // Validate country
        const validCountries = this.config.getCountries().map(c => c.value);
        const validCountry = validCountries.includes(country) ? country : this.config.get('data.defaultGroup');
        
        // Validate word count
        const minWords = this.config.get('data.minWords');
        const maxWords = this.config.get('data.maxWords');
        const validWordCount = Math.min(Math.max(wordCount, minWords), maxWords);
        
        return {
            country: validCountry,
            wordCount: validWordCount
        };
    }

    updateURL(country, wordCount) {
        // Get current state
        const currentState = this.getInitialState();
        
        // Build new URL parameters
        const params = new URLSearchParams();
        
        // Update country if provided, otherwise keep current country if different from default
        const newCountry = country || currentState.country;
        if (newCountry !== this.config.get('data.defaultGroup')) {
            params.set('country', newCountry);
        }
        
        // Update word count if provided, otherwise keep current word count if different from default
        const newWordCount = wordCount || currentState.wordCount;
        if (newWordCount !== this.config.get('data.defaultWordCount')) {
            params.set('words', newWordCount);
        }

        // Update URL without reloading the page
        const newURL = params.toString() 
            ? `${window.location.pathname}?${params.toString()}`
            : window.location.pathname;
        
        window.history.pushState({}, '', newURL);
    }

    handleURLChange() {
        // Re-parse URL parameters
        this.params = new URLSearchParams(window.location.search);
        const newState = this.getInitialState();
        
        // Dispatch custom event with new state
        const event = new CustomEvent('urlchange', { 
            detail: newState
        });
        window.dispatchEvent(event);
    }
} 