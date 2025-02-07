import { DataProcessor } from '../../utils/dataProcessor.js';
import { ConfigManager } from '../../config/ConfigManager.js';

export class WordCloudDataManager {
    constructor() {
        this.config = ConfigManager.getInstance();
        this.currentWords = null;
    }

    async loadData(country, wordCount) {
        const dataPath = this.config.get('paths.getDataPath')(country);
        const response = await d3.json(dataPath);
        return this.processDataResponse(response, country, wordCount);
    }

    processDataResponse(response, country, wordCount) {
        const words = country === 'combined' ? 
            DataProcessor.processCombinedData(response) : 
            response;
        return DataProcessor.processWords(words, wordCount);
    }

    setCurrentWords(words) {
        this.currentWords = words;
    }

    getCurrentWords() {
        return this.currentWords;
    }

    getDefaultWordCount() {
        return this.config.get('data.defaultWordCount');
    }

    getWordCountLimits() {
        return {
            min: this.config.get('data.minWords'),
            max: this.config.get('data.maxWords')
        };
    }

    getDefaultCountry() {
        return this.config.get('data.defaultCountry');
    }

    getAvailableCountries() {
        return this.config.getCountries();
    }
} 