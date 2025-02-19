import { ConfigManager } from '../config/ConfigManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';

/**
 * Handles dynamic color assignments for the word cloud visualization.
 * All static colors are managed through CSS variables in variables.css
 */
export class ColorManager {
    static getWordCloudScheme() {
        return CSSVariableManager.getColorScheme();
    }

    /**
     * Get color for a word based on configuration strategy
     */
    static getColorForWord(word, index, totalWords) {
        const scheme = this.getWordCloudScheme();
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
    }

    /**
     * Get color based on word frequency/rank
     */
    static getFrequencyBasedColor(index, totalWords, scheme) {
        const position = Math.floor((index / totalWords) * scheme.length);
        return scheme[Math.min(position, scheme.length - 1)];
    }

    /**
     * Get contrasting text color (black or white) for a background color
     */
    static getContrastColor(backgroundColor) {
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        return luminance > 0.5 ? '#333333' : '#ffffff';
    }
} 