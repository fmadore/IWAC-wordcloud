import { ConfigManager } from '../config/ConfigManager.js';

export class DataProcessor {
    static get config() {
        return ConfigManager.getInstance().getDataConfig();
    }

    static cleanWord(word) {
        try {
            if (typeof word !== 'string') {
                throw new Error('Input word must be a string');
            }

            // Minimal cleaning - just trim whitespace
            return word.trim();
        } catch (error) {
            console.error('Error cleaning word:', error);
            return '';
        }
    }

    static normalizeSize(size, minSize, maxSize) {
        try {
            if (typeof size !== 'number' || typeof minSize !== 'number' || typeof maxSize !== 'number') {
                throw new Error('Size values must be numbers');
            }

            if (minSize >= maxSize) {
                throw new Error('minSize must be less than maxSize');
            }

            if (minSize === maxSize) return 50; // Default middle size if min equals max

            // Ensure size is within bounds
            size = Math.max(minSize, Math.min(maxSize, size));
            
            // Get font size range from config or use defaults
            const { fontSizeRange } = this.config;
            const minFontSize = fontSizeRange?.min || 10;
            const maxFontSize = fontSizeRange?.max || 100;

            return minFontSize + (size - minSize) * (maxFontSize - minFontSize) / (maxSize - minSize);
        } catch (error) {
            console.error('Error normalizing size:', error);
            return 10; // Return minimum size on error
        }
    }

    static processCombinedData(data) {
        try {
            if (!data || typeof data !== 'object') {
                throw new Error('Invalid data format');
            }

            const wordMap = new Map();
            const processedCountries = new Set();

            Object.entries(data).forEach(([countryName, countryWords]) => {
                if (!Array.isArray(countryWords)) {
                    console.warn(`Invalid data format for country: ${countryName}`);
                    return;
                }

                processedCountries.add(countryName);
                
                countryWords.forEach(word => {
                    if (!word || typeof word.text !== 'string' || typeof word.size !== 'number') {
                        console.warn(`Invalid word format in ${countryName}:`, word);
                        return;
                    }

                    const cleanedText = this.cleanWord(word.text);
                    if (!cleanedText) return;

                    if (wordMap.has(cleanedText)) {
                        const existingWord = wordMap.get(cleanedText);
                        existingWord.size += word.size;
                        if (!existingWord.countries.includes(countryName)) {
                            existingWord.countries.push(countryName);
                        }
                    } else {
                        wordMap.set(cleanedText, {
                            text: cleanedText,
                            size: word.size,
                            countries: [countryName]
                        });
                    }
                });
            });

            if (processedCountries.size === 0) {
                throw new Error('No valid country data found');
            }

            return Array.from(wordMap.values());
        } catch (error) {
            console.error('Error processing combined data:', error);
            return [];
        }
    }

    static processWords(words, wordCount) {
        try {
            if (!Array.isArray(words)) {
                throw new Error('Words must be an array');
            }

            if (typeof wordCount !== 'number' || wordCount < 1) {
                throw new Error('Invalid word count');
            }

            // Clean and validate words
            const validWords = words
                .map(w => {
                    if (!w || typeof w.text !== 'string' || typeof w.size !== 'number') {
                        console.warn('Invalid word format:', w);
                        return null;
                    }
                    return {
                        ...w,
                        text: this.cleanWord(w.text)
                    };
                })
                .filter(w => w && w.text.length > 0);

            if (validWords.length === 0) {
                throw new Error('No valid words after cleaning');
            }

            // Sort by size and limit count
            const limitedWords = validWords
                .sort((a, b) => b.size - a.size)
                .slice(0, wordCount);

            // Calculate size range
            const sizes = limitedWords.map(w => w.size);
            const minSize = Math.min(...sizes);
            const maxSize = Math.max(...sizes);

            // Normalize sizes and add metadata
            return limitedWords.map((w, index) => ({
                ...w,
                originalSize: w.size,
                size: this.normalizeSize(w.size, minSize, maxSize),
                rank: index + 1
            }));
        } catch (error) {
            console.error('Error processing words:', error);
            return [];
        }
    }

    static validateWordData(word) {
        return word &&
            typeof word === 'object' &&
            typeof word.text === 'string' &&
            typeof word.size === 'number' &&
            word.size >= 0;
    }
} 