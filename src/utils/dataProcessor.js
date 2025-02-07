export class DataProcessor {
    static cleanWord(word) {
        return word.replace(/['']/, '').trim();
    }

    static normalizeSize(size, minSize, maxSize) {
        return 10 + (size - minSize) * (90) / (maxSize - minSize);
    }

    static processCombinedData(data) {
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

    static processWords(words, wordCount) {
        // Clean words and remove empty ones
        words = words.map(w => ({...w, text: this.cleanWord(w.text)}))
                     .filter(w => w.text.length > 0);

        // Limit the number of words based on the count
        words = words.sort((a, b) => b.size - a.size)
                     .slice(0, wordCount);

        // Normalize sizes
        const minSize = Math.min(...words.map(w => w.size));
        const maxSize = Math.max(...words.map(w => w.size));
        return words.map(w => ({
            ...w,
            originalSize: w.size,
            size: this.normalizeSize(w.size, minSize, maxSize)
        }));
    }
} 