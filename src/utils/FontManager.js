import { ConfigManager } from '../config/ConfigManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';
import { ErrorManager } from './ErrorManager.js';

export class FontManager {
    static get config() {
        return ConfigManager.getInstance().getFontConfig();
    }

    static calculateFontSize(word, words, area) {
        const fontConfig = CSSVariableManager.getFontConfig();
        const baseSize = Math.sqrt(area / (words.length * fontConfig.scaleFactor));
        
        // Calculate normalized scale factor between min and max bounds
        const maxWordSize = Math.max(...words.map(w => w.size));
        const normalizedScale = word.size / maxWordSize;
        const boundedScale = fontConfig.scaleMin + 
            (normalizedScale * (fontConfig.scaleMax - fontConfig.scaleMin));
        
        const scaledSize = baseSize * boundedScale;
        return Math.min(Math.max(scaledSize, fontConfig.minSize), this.calculateMaxFontSize(area));
    }

    /**
     * Calculate font size using fluid typography with clamp()
     * @param {Object} word - Word object with size property
     * @param {Array} words - Array of all words
     * @param {number} area - Container area
     * @returns {string} Font size with clamp() function
     */
    static calculateFluidFontSize(word, words, area) {
        try {
            const fontConfig = CSSVariableManager.getFontConfig();
            const baseSize = Math.sqrt(area / (words.length * fontConfig.scaleFactor));
            
            // Calculate normalized scale factor between min and max bounds
            const maxWordSize = Math.max(...words.map(w => w.size));
            const normalizedScale = word.size / maxWordSize;
            const boundedScale = fontConfig.scaleMin + 
                (normalizedScale * (fontConfig.scaleMax - fontConfig.scaleMin));
            
            // Calculate min, preferred, and max sizes for clamp()
            const minSize = fontConfig.minSize;
            const preferredSize = baseSize * boundedScale;
            const maxSize = this.calculateMaxFontSize(area);
            
            // Return clamp() function for fluid typography
            return `clamp(${minSize}px, ${preferredSize}px, ${maxSize}px)`;
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'FontManager',
                method: 'calculateFluidFontSize'
            });
            
            // Fallback to regular font size calculation
            return `${this.calculateFontSize(word, words, area)}px`;
        }
    }

    /**
     * Apply font styles to a word element
     * @param {Object} element - D3 selection of word element
     * @param {number} size - Font size in pixels
     * @param {string} weight - Font weight (normal, medium, semibold, or a specific weight)
     * @param {boolean} useTextShadow - Whether to apply text shadow
     */
    static applyFontStyles(element, size, weight = 'normal', useTextShadow = false) {
        try {
            // Remove any existing font weight classes
            element.classed('font-normal', false)
                  .classed('font-medium', false)
                  .classed('font-semibold', false)
                  .classed('font-light', false);
            
            // Add the appropriate font weight class
            element.classed(`font-${weight}`, true)
                  .style("font-family", CSSVariableManager.get('--font-base'))
                  .style("font-size", typeof size === 'number' ? `${size}px` : size);
            
            // Apply text shadow if requested
            if (useTextShadow) {
                element.style("text-shadow", CSSVariableManager.get('--wordcloud-text-shadow'));
            } else {
                element.style("text-shadow", null);
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'FontManager',
                method: 'applyFontStyles'
            });
        }
    }

    /**
     * Get font weight based on word frequency/rank
     * @param {number} index - Index of the word
     * @param {number} totalWords - Total number of words
     * @returns {string} Font weight name (light, normal, medium, semibold)
     */
    static getFontWeightByFrequency(index, totalWords) {
        try {
            // Calculate normalized position (0 to 1)
            const position = index / totalWords;
            
            if (position < 0.1) {
                return 'semibold';
            } else if (position < 0.3) {
                return 'medium';
            } else if (position < 0.7) {
                return 'normal';
            } else {
                return 'light';
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'FontManager',
                method: 'getFontWeightByFrequency'
            });
            return 'normal'; // Fallback to normal weight
        }
    }

    /**
     * Get numeric font weight value based on word frequency/rank
     * @param {number} index - Index of the word
     * @param {number} totalWords - Total number of words
     * @returns {number} Font weight value (300-600)
     */
    static getNumericFontWeight(index, totalWords) {
        try {
            // Calculate normalized position (0 to 1)
            const position = index / totalWords;
            
            // Interpolate between min and max font weights (300-600)
            const minWeight = 300;
            const maxWeight = 600;
            const weight = Math.round(maxWeight - position * (maxWeight - minWeight));
            
            // Ensure weight is one of the available weights (300, 400, 500, 600)
            const availableWeights = [300, 400, 500, 600];
            return availableWeights.reduce((prev, curr) => 
                Math.abs(curr - weight) < Math.abs(prev - weight) ? curr : prev
            );
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'FontManager',
                method: 'getNumericFontWeight'
            });
            return 400; // Fallback to normal weight
        }
    }

    static getFontFamily() {
        return CSSVariableManager.get('--font-base');
    }

    static getFontSizeLimits() {
        const fontConfig = CSSVariableManager.getFontConfig();
        return {
            minSize: fontConfig.minSize,
            maxSize: fontConfig.maxSize
        };
    }

    static calculateMaxFontSize(containerHeight) {
        return containerHeight / CSSVariableManager.getNumber('--wordcloud-font-scale-factor', 8);
    }

    static scaleFont(size, factor) {
        const { minSize, maxSize } = this.getFontSizeLimits();
        const newSize = size * factor;
        return Math.min(Math.max(newSize, minSize), maxSize);
    }
} 