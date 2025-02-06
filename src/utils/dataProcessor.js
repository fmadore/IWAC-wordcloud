/**
 * Cleans a word by removing apostrophes and trimming whitespace
 * @param {string} word - The word to clean
 * @returns {string} The cleaned word
 */
export function cleanWord(word) {
    return word.replace(/['']/, '').trim();
}

/**
 * Normalizes sizes to a range between 10 and 100
 * @param {number} size - The original size
 * @param {number} minSize - The minimum size in the dataset
 * @param {number} maxSize - The maximum size in the dataset
 * @returns {number} The normalized size
 */
export function normalizeSize(size, minSize, maxSize) {
    return 10 + (size - minSize) * (90) / (maxSize - minSize);
}

/**
 * Processes word data for the combined view
 * @param {Object} data - The raw data object containing words from all countries
 * @returns {Array} Processed array of word objects with combined frequencies
 */
export function processCombinedData(data) {
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

/**
 * Processes and prepares word data for visualization
 * @param {Array} words - Array of word objects
 * @param {number} wordCount - Maximum number of words to include
 * @returns {Array} Processed array of word objects ready for visualization
 */
export function processWords(words, wordCount) {
    // Clean words and remove empty ones
    words = words.map(w => ({...w, text: cleanWord(w.text)}))
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
        size: normalizeSize(w.size, minSize, maxSize)
    }));
} 