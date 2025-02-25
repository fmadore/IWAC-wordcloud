import { WordStyleManager } from '../../utils/WordStyleManager.js';

export class WordCloudLayoutManager {
    constructor({ config }) {
        this.config = config;
        this.layout = null;
        this.setup();
    }

    setup() {
        const dimensions = this.config.get('wordcloud.dimensions');
        const layoutOptions = this.config.getLayoutOptions();
        
        this.layout = d3.layout.cloud()
            .size([dimensions.width, dimensions.height])
            .padding(layoutOptions.padding)
            .rotate(this.getRotation.bind(this))
            .fontSize(d => d.size);
    }

    getRotation() {
        const { rotations, rotationProbability } = this.config.getLayoutOptions();
        return Math.random() < rotationProbability ? 
            rotations[Math.floor(Math.random() * rotations.length)] : 0;
    }

    /**
     * Get enhanced rotation function with more natural variation
     * @returns {number} Rotation angle in degrees
     */
    getEnhancedRotation() {
        const { rotations, rotationProbability } = this.config.getLayoutOptions();
        
        // Use a more sophisticated rotation strategy
        if (Math.random() < rotationProbability) {
            // If rotations array is provided, use it
            if (rotations && rotations.length > 0) {
                return rotations[Math.floor(Math.random() * rotations.length)];
            }
            
            // Otherwise use a natural distribution of angles
            // Favor horizontal (0°) and vertical (90°) with some variation
            const baseAngles = [0, 90, 0, 0, 90, 0, -90, 0];
            const baseAngle = baseAngles[Math.floor(Math.random() * baseAngles.length)];
            
            // Add slight variation (±10°) to make it look more natural
            return baseAngle + (Math.random() * 20 - 10);
        }
        
        // Default to horizontal with slight variation
        return Math.random() * 10 - 5;
    }

    updateDimensions({ width, height }) {
        if (!width || !height) return;
        
        this.config.updateDimensions(width, height);
        
        if (this.layout) {
            this.layout.size([width, height]);
        }
    }

    calculateDimensions(container) {
        const rect = container.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(container);
        
        const paddingX = parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight);
        const paddingY = parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom);
        
        return {
            width: rect.width - paddingX,
            height: rect.height - paddingY
        };
    }

    /**
     * Layout words with standard styling
     * @param {Array} words - Array of word objects
     * @returns {Promise} Promise resolving to laid out words
     */
    async layoutWords(words) {
        if (!words || words.length === 0) return [];
        
        return new Promise((resolve, reject) => {
            try {
                const dimensions = this.config.get('wordcloud.dimensions');
                const area = dimensions.width * dimensions.height;
                
                this.layout
                    .words(words)
                    .fontSize(d => WordStyleManager.calculateWordSize(d.size, words, area))
                    .on("end", resolve)
                    .start();
            } catch (error) {
                console.error('Error in layout:', error);
                reject(error);
            }
        });
    }

    /**
     * Layout words with enhanced styling using fluid typography
     * @param {Array} words - Array of word objects
     * @returns {Promise} Promise resolving to laid out words
     */
    async layoutWordsEnhanced(words) {
        if (!words || words.length === 0) return [];
        
        return new Promise((resolve, reject) => {
            try {
                const dimensions = this.config.get('wordcloud.dimensions');
                const area = dimensions.width * dimensions.height;
                
                // Use enhanced rotation function
                this.layout
                    .rotate(this.getEnhancedRotation.bind(this))
                    .words(words)
                    .fontSize(d => WordStyleManager.calculateWordSize(d.size, words, area))
                    .on("end", resolve)
                    .start();
            } catch (error) {
                console.error('Error in enhanced layout:', error);
                reject(error);
            }
        });
    }
} 