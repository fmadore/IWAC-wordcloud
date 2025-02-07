export class ConfigManager {
    static instance = null;
    
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        
        this.config = {
            wordcloud: {
                dimensions: {
                    width: 800,
                    height: 600,
                    minHeight: 400,
                    maxWidth: 1200
                },
                font: {
                    minSize: 10,
                    maxSize: null, // Will be calculated based on height
                    scaleFactor: 5, // Used in base size calculation
                    family: 'Arial, sans-serif'
                },
                layout: {
                    padding: 5,
                    rotations: [0, 90],
                    rotationProbability: 0.5
                },
                animation: {
                    duration: 200,
                    scaleOnHover: 1.2
                },
                export: {
                    scale: 2,
                    format: 'png'
                }
            },
            data: {
                minWords: 10,
                maxWords: 150,
                defaultWordCount: 150,
                defaultCountry: 'combined'
            },
            paths: {
                dataDir: 'data',
                getDataPath: (country) => 
                    `${this.config.paths.dataDir}/${country === 'combined' ? 'combined' : country}_word_frequencies.json`
            },
            countries: [
                { value: 'combined', labelKey: 'allCountries' },
                { value: 'bénin', label: 'Bénin' },
                { value: 'burkina_faso', label: 'Burkina Faso' },
                { value: 'togo', label: 'Togo' }
            ]
        };

        ConfigManager.instance = this;
    }

    static getInstance() {
        if (!ConfigManager.instance) {
            ConfigManager.instance = new ConfigManager();
        }
        return ConfigManager.instance;
    }

    get(path) {
        return path.split('.').reduce((obj, key) => obj?.[key], this.config);
    }

    set(path, value) {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, this.config);
        target[lastKey] = value;
    }

    getWordcloudConfig() {
        return { ...this.config.wordcloud };
    }

    getDataConfig() {
        return { ...this.config.data };
    }

    getCountries() {
        return [...this.config.countries];
    }

    calculateMaxFontSize(height) {
        return height / 8;
    }

    updateDimensions(width, height) {
        this.set('wordcloud.dimensions.width', width);
        this.set('wordcloud.dimensions.height', height);
        this.set('wordcloud.font.maxSize', this.calculateMaxFontSize(height));
    }

    getLayoutOptions() {
        const { padding, rotations, rotationProbability } = this.config.wordcloud.layout;
        return { padding, rotations, rotationProbability };
    }

    getFontConfig() {
        return { ...this.config.wordcloud.font };
    }

    getAnimationConfig() {
        return { ...this.config.wordcloud.animation };
    }

    getExportConfig() {
        return { ...this.config.wordcloud.export };
    }
} 