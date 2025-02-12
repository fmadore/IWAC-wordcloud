import { EventBus } from '../events/EventBus.js';
import { ConfigManager } from '../config/ConfigManager.js';
import { WORDCLOUD_EVENTS, DATA_EVENTS, ERROR_EVENTS } from '../events/EventTypes.js';
import { LoggerMiddleware } from '../events/middleware/LoggerMiddleware.js';
import { ValidationMiddleware } from '../events/middleware/ValidationMiddleware.js';

export class AppStore {
    static instance = null;
    
    constructor() {
        if (AppStore.instance) {
            return AppStore.instance;
        }
        
        this.config = ConfigManager.getInstance();
        this.eventBus = EventBus.getInstance();
        
        // Setup event bus middlewares
        this.eventBus
            .use(LoggerMiddleware)
            .use(ValidationMiddleware);
        
        this.state = {
            selectedCountry: this.config.get('data.defaultCountry'),
            wordCount: this.config.get('data.defaultWordCount'),
            currentWords: [],
            dimensions: {
                width: this.config.get('wordcloud.dimensions.width'),
                height: this.config.get('wordcloud.dimensions.height')
            },
            isLoading: false,
            error: null,
            layout: {
                wordListVisible: true
            }
        };
        
        this.listeners = new Set();
        AppStore.instance = this;
    }

    static getInstance() {
        if (!AppStore.instance) {
            AppStore.instance = new AppStore();
        }
        return AppStore.instance;
    }

    getState() {
        return { ...this.state };
    }

    setState(newState) {
        const oldState = { ...this.state };
        this.state = { ...this.state, ...newState };
        this.notifyListeners(oldState);
    }

    subscribe(listener) {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notifyListeners(oldState) {
        this.listeners.forEach(listener => listener(this.state, oldState));
    }

    // Action creators
    async updateWordCloud(country, wordCount) {
        try {
            this.setState({ isLoading: true, error: null });
            
            // Update state immediately for UI responsiveness
            this.setState({
                selectedCountry: country,
                wordCount: wordCount
            });

            // Emit loading event
            await this.eventBus.emit(WORDCLOUD_EVENTS.LOADING, { isLoading: true });
            
            // Emit data load start event
            await this.eventBus.emit(DATA_EVENTS.LOAD_START, { country, wordCount });
            
            // Load and process data
            const dataPath = this.config.get('paths.getDataPath')(country);
            const response = await d3.json(dataPath);
            
            // Emit process start event
            await this.eventBus.emit(DATA_EVENTS.PROCESS_START, { data: response });
            
            const words = this.processWordData(response, country, wordCount);
            
            // Emit process complete event
            await this.eventBus.emit(DATA_EVENTS.PROCESS_COMPLETE, { words });
            
            // Update state with new data
            this.setState({
                currentWords: words,
                isLoading: false
            });

            // Emit success events
            await this.eventBus.emit(DATA_EVENTS.LOAD_COMPLETE, { words });
            await this.eventBus.emit(WORDCLOUD_EVENTS.UPDATE, { words });
            
            return words;
        } catch (error) {
            this.setState({
                error: error.message,
                isLoading: false
            });
            
            // Emit error events
            await this.eventBus.emit(ERROR_EVENTS.GENERAL, { error });
            await this.eventBus.emit(WORDCLOUD_EVENTS.ERROR, { error });
            
            throw error;
        } finally {
            await this.eventBus.emit(WORDCLOUD_EVENTS.LOADING, { isLoading: false });
        }
    }

    updateDimensions(dimensions) {
        this.setState({
            dimensions: {
                ...this.state.dimensions,
                ...dimensions
            }
        });
    }

    toggleWordList() {
        this.setState({
            layout: {
                ...this.state.layout,
                wordListVisible: !this.state.layout.wordListVisible
            }
        });
    }

    // Helper methods
    processWordData(response, country, wordCount) {
        const words = country === 'combined' ? 
            this.processCombinedData(response) : 
            response;
        return this.processWords(words, wordCount);
    }

    processCombinedData(data) {
        const wordMap = new Map();
        Object.entries(data).forEach(([countryName, countryWords]) => {
            countryWords.forEach(word => {
                if (wordMap.has(word.text)) {
                    const existingWord = wordMap.get(word.text);
                    existingWord.size += word.size;
                    existingWord.countries.push(countryName);
                } else {
                    wordMap.set(word.text, {
                        text: word.text,
                        size: word.size,
                        countries: [countryName]
                    });
                }
            });
        });
        return Array.from(wordMap.values());
    }

    processWords(words, wordCount) {
        words = words
            .map(w => ({...w, text: w.text.replace(/['']/, '').trim()}))
            .filter(w => w.text.length > 0)
            .sort((a, b) => b.size - a.size)
            .slice(0, wordCount);

        const minSize = Math.min(...words.map(w => w.size));
        const maxSize = Math.max(...words.map(w => w.size));
        
        return words.map((w, index) => ({
            ...w,
            originalSize: w.size,
            size: this.normalizeSize(w.size, minSize, maxSize),
            rank: index + 1
        }));
    }

    normalizeSize(size, minSize, maxSize) {
        return 10 + (size - minSize) * (90) / (maxSize - minSize);
    }
} 