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