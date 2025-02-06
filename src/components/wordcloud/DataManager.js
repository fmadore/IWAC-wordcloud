import { processWords, processCombinedData } from '../../utils/dataProcessor.js';
import { config } from '../../config/settings.js';

export class WordCloudDataManager {
    constructor() {
        this.currentWords = null;
    }

    async loadData(country, wordCount) {
        const response = await d3.json(config.paths.getDataPath(country));
        return this.processDataResponse(response, country, wordCount);
    }

    processDataResponse(response, country, wordCount) {
        const words = country === 'combined' ? 
            processCombinedData(response) : 
            response;
        return processWords(words, wordCount);
    }

    setCurrentWords(words) {
        this.currentWords = words;
    }

    getCurrentWords() {
        return this.currentWords;
    }
} 