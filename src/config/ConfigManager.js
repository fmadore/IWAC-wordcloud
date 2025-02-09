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
                    // Primary and fallback fonts
                    family: {
                        primary: 'Inter',
                        fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                    },
                    // Font size configuration
                    size: {
                        min: 10,
                        max: null, // Will be calculated based on height
                        scale: {
                            factor: 5, // Base scaling factor
                            min: 0.8,  // Minimum scale multiplier
                            max: 1.2   // Maximum scale multiplier
                        }
                    },
                    // Font weight options
                    weight: {
                        normal: 400,
                        bold: 600,
                        range: [300, 400, 500, 600]
                    },
                    // Font style options
                    style: {
                        normal: 'normal',
                        emphasis: 'italic'
                    }
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
        this.set('wordcloud.font.size.max', this.calculateMaxFontSize(height));
    }

    getLayoutOptions() {
        const { padding, rotations, rotationProbability } = this.config.wordcloud.layout;
        return { padding, rotations, rotationProbability };
    }

    getFontConfig() {
        const fontConfig = this.config.wordcloud.font;
        return {
            family: `${fontConfig.family.primary}, ${fontConfig.family.fallback}`,
            minSize: fontConfig.size.min,
            maxSize: fontConfig.size.max,
            scaleFactor: fontConfig.size.scale.factor,
            weights: fontConfig.weight,
            styles: fontConfig.style
        };
    }

    getAnimationConfig() {
        return { ...this.config.wordcloud.animation };
    }

    getExportConfig() {
        return { ...this.config.wordcloud.export };
    }
} 