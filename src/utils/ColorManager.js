import { ConfigManager } from '../config/ConfigManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';
import { ErrorManager } from './ErrorManager.js';

/**
 * Handles dynamic color assignments for the word cloud visualization.
 * All static colors are managed through CSS variables in variables.css
 */
export class ColorManager {
    /**
     * Get the color scheme for the word cloud
     * @returns {string[]} Array of colors from CSS variables
     */
    static getWordCloudScheme() {
        return CSSVariableManager.getColorScheme();
    }

    /**
     * Get color for a word based on configuration strategy
     * @param {string} word - The word to get color for
     * @param {number} index - Index of the word in the list
     * @param {number} totalWords - Total number of words
     * @returns {string} Color value from the scheme
     */
    static getColorForWord(word, index, totalWords) {
        try {
            const scheme = this.getWordCloudScheme();
            if (!scheme || scheme.length === 0) {
                ErrorManager.getInstance().handleError(new Error('No color scheme available'), {
                    component: 'ColorManager',
                    method: 'getColorForWord'
                });
                return CSSVariableManager.getColor('--color-fallback-default');
            }

            const { colorAssignment } = ConfigManager.getInstance().getColorConfig();

            switch (colorAssignment) {
                case 'frequency':
                    return this.getFrequencyBasedColor(index, totalWords, scheme);
                case 'gradient':
                    return this.getGradientColor(index, totalWords);
                case 'semantic':
                    return this.getSemanticColor(index, totalWords);
                case 'random':
                    return scheme[Math.floor(Math.random() * scheme.length)];
                case 'fixed':
                    return scheme[index % scheme.length];
                default:
                    return scheme[0];
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getColorForWord'
            });
            return CSSVariableManager.getColor('--color-fallback-default');
        }
    }

    /**
     * Get color based on word frequency/rank
     * @param {number} index - Index of the word
     * @param {number} totalWords - Total number of words
     * @param {string[]} scheme - Color scheme array
     * @returns {string} Color from the scheme based on frequency
     */
    static getFrequencyBasedColor(index, totalWords, scheme) {
        try {
            if (!scheme || scheme.length === 0) {
                throw new Error('Invalid color scheme');
            }
            const position = Math.floor((index / totalWords) * scheme.length);
            return scheme[Math.min(position, scheme.length - 1)];
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getFrequencyBasedColor'
            });
            return scheme?.[0] || CSSVariableManager.getColor('--color-fallback-default');
        }
    }

    /**
     * Get color from a gradient based on word frequency/rank
     * @param {number} index - Index of the word
     * @param {number} totalWords - Total number of words
     * @returns {string} Color from the gradient based on frequency
     */
    static getGradientColor(index, totalWords) {
        try {
            // Get gradient colors from CSS variables
            const startColor = CSSVariableManager.getColor('--wordcloud-gradient-start');
            const midColor = CSSVariableManager.getColor('--wordcloud-gradient-mid');
            const endColor = CSSVariableManager.getColor('--wordcloud-gradient-end');
            
            // Calculate normalized position (0 to 1)
            const position = index / (totalWords - 1);
            
            // Determine which segment of the gradient to use
            if (position < 0.5) {
                // Interpolate between start and mid color
                return this.interpolateColor(
                    startColor, 
                    midColor, 
                    position * 2 // Scale to 0-1 range for this segment
                );
            } else {
                // Interpolate between mid and end color
                return this.interpolateColor(
                    midColor,
                    endColor,
                    (position - 0.5) * 2 // Scale to 0-1 range for this segment
                );
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getGradientColor'
            });
            return CSSVariableManager.getColor('--color-fallback-default');
        }
    }

    /**
     * Get semantic color based on word frequency/rank
     * @param {number} index - Index of the word
     * @param {number} totalWords - Total number of words
     * @returns {string} Semantic color based on frequency
     */
    static getSemanticColor(index, totalWords) {
        try {
            // Calculate which frequency group this word belongs to
            const normalizedPosition = index / totalWords;
            
            if (normalizedPosition < 0.1) {
                return CSSVariableManager.getColor('--wordcloud-color-highest');
            } else if (normalizedPosition < 0.3) {
                return CSSVariableManager.getColor('--wordcloud-color-high');
            } else if (normalizedPosition < 0.6) {
                return CSSVariableManager.getColor('--wordcloud-color-medium');
            } else if (normalizedPosition < 0.8) {
                return CSSVariableManager.getColor('--wordcloud-color-low');
            } else {
                return CSSVariableManager.getColor('--wordcloud-color-lowest');
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getSemanticColor'
            });
            return CSSVariableManager.getColor('--color-fallback-default');
        }
    }

    /**
     * Interpolate between two colors
     * @param {string} color1 - Start color in hex format
     * @param {string} color2 - End color in hex format
     * @param {number} factor - Interpolation factor (0-1)
     * @returns {string} Interpolated color in hex format
     */
    static interpolateColor(color1, color2, factor) {
        try {
            // Convert hex to RGB
            const c1 = this.hexToRgb(color1);
            const c2 = this.hexToRgb(color2);
            
            if (!c1 || !c2) {
                throw new Error('Invalid color format for interpolation');
            }
            
            // Interpolate each RGB component
            const r = Math.round(c1.r + factor * (c2.r - c1.r));
            const g = Math.round(c1.g + factor * (c2.g - c1.g));
            const b = Math.round(c1.b + factor * (c2.b - c1.b));
            
            // Convert back to hex
            return this.rgbToHex(r, g, b);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'interpolateColor'
            });
            return color1; // Fallback to first color
        }
    }

    /**
     * Convert hex color to RGB object
     * @param {string} hex - Color in hex format
     * @returns {Object|null} RGB object or null if invalid
     */
    static hexToRgb(hex) {
        try {
            // Remove # if present
            hex = hex.replace(/^#/, '');
            
            // Parse hex values
            const bigint = parseInt(hex, 16);
            const r = (bigint >> 16) & 255;
            const g = (bigint >> 8) & 255;
            const b = bigint & 255;
            
            return { r, g, b };
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'hexToRgb',
                color: hex
            });
            return null;
        }
    }

    /**
     * Convert RGB values to hex color
     * @param {number} r - Red component (0-255)
     * @param {number} g - Green component (0-255)
     * @param {number} b - Blue component (0-255)
     * @returns {string} Color in hex format
     */
    static rgbToHex(r, g, b) {
        try {
            return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'rgbToHex'
            });
            return '#000000'; // Fallback to black
        }
    }

    /**
     * Get contrasting text color (dark or light) for a background color
     * @param {string} backgroundColor - Background color in hex format
     * @returns {string} Contrasting color from CSS variables
     */
    static getContrastColor(backgroundColor) {
        try {
            const hex = backgroundColor.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            
            if (isNaN(r) || isNaN(g) || isNaN(b)) {
                throw new Error('Invalid background color format');
            }

            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            const threshold = parseFloat(CSSVariableManager.get('--color-luminance-threshold', '0.5'));
            
            return luminance > threshold 
                ? CSSVariableManager.getColor('--color-contrast-dark')
                : CSSVariableManager.getColor('--color-contrast-light');
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getContrastColor',
                color: backgroundColor
            });
            return CSSVariableManager.getColor('--color-contrast-dark');
        }
    }
}