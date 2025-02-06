export const config = {
    wordcloud: {
        width: 800,
        height: 600,
        minFontSize: 10,
        maxFontSize: 100,
        padding: 5,
        rotations: [0, 90],  // Possible rotation angles
        rotationProbability: 0.5,  // Probability of rotation
        scale: 2  // PNG export scale
    },
    
    data: {
        minWords: 10,
        maxWords: 150,
        defaultWordCount: 150
    },
    
    countries: [
        { value: 'combined', labelKey: 'allCountries' },
        { value: 'bénin', label: 'Bénin' },
        { value: 'burkina_faso', label: 'Burkina Faso' },
        { value: 'togo', label: 'Togo' }
    ],
    
    paths: {
        dataDir: 'data',
        getDataPath: (country) => 
            `${config.paths.dataDir}/${country === 'combined' ? 'combined' : country}_word_frequencies.json`
    }
}; 