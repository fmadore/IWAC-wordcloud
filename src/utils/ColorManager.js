import { ConfigManager } from '../config/ConfigManager.js';
import { ErrorManager } from './ErrorManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';

export class ColorManager {
    static get config() {
        return ConfigManager.getInstance().getColorConfig();
    }

    static getWordCloudScheme() {
        try {
            return CSSVariableManager.getColorScheme();
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getWordCloudScheme'
            });
            return [
                CSSVariableManager.getColor('--color-primary', '#4a90e2'),
                CSSVariableManager.getColor('--color-primary-dark', '#357abd')
            ];
        }
    }

    static getColorForWord(word, index, totalWords) {
        try {
            const scheme = this.getWordCloudScheme();
            const { colorAssignment } = this.config;

            switch (colorAssignment) {
                case 'frequency':
                    return this.getFrequencyBasedColor(index, totalWords, scheme);
                case 'random':
                    return this.getRandomColor(scheme);
                case 'fixed':
                    return this.getFixedColor(index, scheme);
                default:
                    return scheme[0];
            }
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getColorForWord'
            });
            return this.getFallbackColor();
        }
    }

    static getFallbackColor() {
        return CSSVariableManager.getColor('--color-primary', '#4a90e2');
    }

    static getColorForRank(rank, totalWords) {
        const scheme = this.getWordCloudScheme();
        return this.getFrequencyBasedColor(rank, totalWords, scheme);
    }

    static getFrequencyBasedColor(index, totalWords, scheme) {
        const position = Math.floor((index / totalWords) * scheme.length);
        return scheme[Math.min(position, scheme.length - 1)];
    }

    static getRandomColor(scheme) {
        return scheme[Math.floor(Math.random() * scheme.length)];
    }

    static getFixedColor(index, scheme) {
        return scheme[index % scheme.length];
    }

    static applyColorTransition(element, color, duration = 200) {
        const timing = CSSVariableManager.get('--transition-timing', 'cubic-bezier(0.4, 0, 0.2, 1)');
        element.style.transition = `color ${duration}ms ${timing}`;
        element.style.color = color;
    }

    static getContrastColor(backgroundColor) {
        // Convert hex to RGB
        const hex = backgroundColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Calculate relative luminance
        const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        
        // Return semantic text colors based on luminance
        return luminance > 0.5 
            ? CSSVariableManager.getColor('--color-text-primary', '#333333')
            : CSSVariableManager.getColor('--color-white', '#ffffff');
    }

    static validateColorScheme(scheme) {
        const isValidHex = (color) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
        
        return scheme.every(color => {
            if (!isValidHex(color)) {
                console.warn(`Invalid color in scheme: ${color}`);
                return false;
            }
            return true;
        });
    }

    static getColorWithOpacity(color, opacity) {
        try {
            const hex = color.replace('#', '');
            const r = parseInt(hex.substr(0, 2), 16);
            const g = parseInt(hex.substr(2, 2), 16);
            const b = parseInt(hex.substr(4, 2), 16);
            return `rgba(${r}, ${g}, ${b}, ${opacity})`;
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getColorWithOpacity'
            });
            return CSSVariableManager.get('--color-primary-alpha', `rgba(74, 144, 226, ${opacity})`);
        }
    }

    static setupColorTransitions(elements, { duration = 200, property = 'color' } = {}) {
        const timing = CSSVariableManager.get('--transition-normal', '0.3s ease');
        elements.forEach(element => {
            element.style.transition = `${property} ${duration}ms ${timing}`;
        });
    }

    static getSemanticColor(type) {
        const colorMap = {
            primary: '--color-primary',
            primaryDark: '--color-primary-dark',
            primaryLight: '--color-primary-light',
            text: '--color-text-primary',
            textSecondary: '--color-text-secondary',
            background: '--color-background',
            border: '--color-border',
            shadow: '--color-shadow'
        };

        const colorVar = colorMap[type] || colorMap.primary;
        return CSSVariableManager.getColor(colorVar);
    }
} 