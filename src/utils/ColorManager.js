import { ConfigManager } from '../config/ConfigManager.js';
import { ErrorManager } from './ErrorManager.js';

export class ColorManager {
    static get config() {
        return ConfigManager.getInstance().getColorConfig();
    }

    static getWordCloudScheme() {
        try {
            const scheme = [];
            const style = getComputedStyle(document.documentElement);
            
            // Get wordcloud specific colors
            for (let i = 1; i <= 10; i++) {
                const color = style.getPropertyValue(`--wordcloud-scheme-${i}`).trim();
                if (!color) {
                    continue;
                }
                scheme.push(color);
            }

            // If no wordcloud specific colors found, use semantic color scale
            if (scheme.length === 0) {
                const semanticColors = [
                    '--color-primary',
                    '--color-primary-dark',
                    '--color-primary-light',
                    '--color-gray-600',
                    '--color-gray-500',
                    '--color-gray-400'
                ];

                for (const colorVar of semanticColors) {
                    const color = style.getPropertyValue(colorVar).trim();
                    if (color) {
                        scheme.push(color);
                    }
                }
            }

            // Ensure we have at least two colors
            if (scheme.length < 2) {
                throw new Error('Insufficient colors in scheme');
            }

            return scheme;
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'ColorManager',
                method: 'getWordCloudScheme'
            });
            
            // Return fallback colors from CSS variables
            const style = getComputedStyle(document.documentElement);
            return [
                style.getPropertyValue('--color-primary').trim() || '#4a90e2',
                style.getPropertyValue('--color-primary-dark').trim() || '#357abd'
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
        const style = getComputedStyle(document.documentElement);
        return style.getPropertyValue('--color-primary').trim() || '#4a90e2';
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
        element.style.transition = `color ${duration}ms var(--transition-timing, cubic-bezier(0.4, 0, 0.2, 1))`;
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
        const style = getComputedStyle(document.documentElement);
        return luminance > 0.5 
            ? style.getPropertyValue('--color-text-primary').trim() || '#333333'
            : style.getPropertyValue('--color-white').trim() || '#ffffff';
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
            console.error('Error creating color with opacity:', error);
            const style = getComputedStyle(document.documentElement);
            return style.getPropertyValue('--color-primary-alpha').trim() || `rgba(74, 144, 226, ${opacity})`;
        }
    }

    static setupColorTransitions(elements, { duration = 200, property = 'color' } = {}) {
        const style = getComputedStyle(document.documentElement);
        const timing = style.getPropertyValue('--transition-normal').trim() || '0.3s ease';
        
        elements.forEach(element => {
            element.style.transition = `${property} ${duration}ms ${timing}`;
        });
    }

    static getSemanticColor(type) {
        const style = getComputedStyle(document.documentElement);
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
        return style.getPropertyValue(colorVar).trim();
    }
} 