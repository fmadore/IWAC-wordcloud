export class ConfigManager {
    static instance = null;
    
    constructor() {
        if (ConfigManager.instance) {
            return ConfigManager.instance;
        }
        
        this.config = {
            wordcloud: {
                dimensions: {
                    // These will be updated dynamically based on CSS variables
                    width: null,
                    height: null,
                    minHeight: null,
                    maxWidth: null
                },
                font: {
                    // Primary and fallback fonts from CSS
                    family: {
                        primary: 'Inter',
                        fallback: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif'
                    },
                    // Font size configuration from CSS
                    size: {
                        min: null, // Will be set from CSS
                        max: null, // Will be calculated based on height
                        scale: {
                            factor: null, // From CSS
                            min: null,    // From CSS
                            max: null     // From CSS
                        }
                    },
                    // Font weight options
                    weight: {
                        normal: null, // Will be set from CSS
                        bold: null,   // Will be set from CSS
                        range: [300, 400, 500, 600]
                    },
                    // Font style options
                    style: {
                        normal: 'normal',
                        emphasis: 'italic'
                    }
                },
                layout: {
                    padding: null, // From CSS
                    rotations: [0, 90],
                    rotationProbability: 0.5
                },
                animation: {
                    duration: 200,
                    scaleOnHover: 1.2,
                    transition: {
                        duration: 800,
                        morphing: true,
                        particles: true,
                        physics: true
                    },
                    particles: {
                        count: 10,
                        duration: 600,
                        colors: [] // Will be populated from CSS variables
                    },
                    physics: {
                        gravity: 0.8,
                        bounce: 0.4,
                        initialVelocity: -15
                    }
                },
                export: {
                    scale: 2,
                    format: 'png'
                },
                colors: {
                    colorAssignment: 'frequency', // 'frequency', 'random', or 'fixed'
                    opacity: {
                        normal: 1,
                        hover: 0.8
                    },
                    transition: {
                        duration: 200
                    }
                }
            },
            data: {
                minWords: 10,
                maxWords: 200,
                defaultWordCount: 150,
                defaultGroup: 'combined',
                format: {
                    type: 'json',
                    fields: {
                        text: 'text',
                        value: 'size',
                        group: 'country',
                        metadata: []
                    }
                },
                processing: {
                    normalization: 'linear',
                    filters: [],
                    transformers: []
                }
            },
            paths: {
                dataDir: '/data',
                getDataPath: (group, format = 'json') => {
                    const isGitHubPages = window.location.hostname.includes('github.io');
                    const basePath = isGitHubPages ? '/IWAC-wordcloud' : '';
                    return `${basePath}/data/${group === 'combined' ? 'combined' : group}_word_frequencies.${format}`;
                }
            },
            groups: {
                type: 'country',
                defaultCombined: true,
                combinedLabel: {
                    en: 'All Countries',
                    fr: 'Tous les pays'
                },
                items: [
                    { value: 'combined', labelKey: 'allCountries' },
                    { value: 'bénin', label: 'Bénin' },
                    { value: 'burkina_faso', label: 'Burkina Faso' },
                    { value: 'côte_d\'ivoire', label: 'Côte d\'Ivoire' },
                    { value: 'niger', label: 'Niger' },
                    { value: 'togo', label: 'Togo' }
                ]
            }
        };

        this.initializeFromCSS();
        ConfigManager.instance = this;
    }

    initializeFromCSS() {
        // Get CSS variables
        const style = getComputedStyle(document.documentElement);
        
        // Update dimensions
        this.config.wordcloud.dimensions = {
            width: parseInt(style.getPropertyValue('--wordcloud-width')),
            height: parseInt(style.getPropertyValue('--wordcloud-height')),
            minHeight: parseInt(style.getPropertyValue('--wordcloud-min-height')),
            maxWidth: parseInt(style.getPropertyValue('--wordcloud-max-width'))
        };

        // Update font configuration
        this.config.wordcloud.font.size = {
            min: parseInt(style.getPropertyValue('--wordcloud-font-min-size')),
            max: null, // Still calculated based on height
            scale: {
                factor: parseFloat(style.getPropertyValue('--wordcloud-font-scale-factor')),
                min: parseFloat(style.getPropertyValue('--wordcloud-font-scale-min')),
                max: parseFloat(style.getPropertyValue('--wordcloud-font-scale-max'))
            }
        };

        // Update font weights
        this.config.wordcloud.font.weight = {
            ...this.config.wordcloud.font.weight,
            normal: parseInt(style.getPropertyValue('--font-weight-normal')),
            bold: parseInt(style.getPropertyValue('--font-weight-semibold'))
        };

        // Update animation configuration
        this.config.wordcloud.animation = {
            ...this.config.wordcloud.animation,
            scaleOnHover: parseFloat(style.getPropertyValue('--wordcloud-hover-scale')) || 1.2,
            duration: parseInt(style.getPropertyValue('--transition-normal')) || 200
        };

        // Update particle colors from wordcloud scheme
        this.config.wordcloud.animation.particles.colors = [
            style.getPropertyValue('--wordcloud-scheme-9').trim(),
            style.getPropertyValue('--wordcloud-scheme-10').trim(),
            style.getPropertyValue('--wordcloud-scheme-5').trim(),
            style.getPropertyValue('--wordcloud-scheme-2').trim()
        ].filter(color => color); // Remove any empty values

        // Update layout
        this.config.wordcloud.layout.padding = parseInt(style.getPropertyValue('--wordcloud-padding'));
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
        return [...this.config.groups.items];
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

    getColorConfig() {
        return this.config.wordcloud.colors;
    }
} 