import { ConfigManager } from '../config/ConfigManager.js';

export class ColorManager {
    static get config() {
        return ConfigManager.getInstance().getColorConfig();
    }

    static getWordCloudScheme() {
        try {
            const scheme = [];
            const style = getComputedStyle(document.documentElement);
            
            // Get base colors from CSS variables
            for (let i = 1; i <= 10; i++) {
                const color = style.getPropertyValue(`--wordcloud-scheme-${i}`).trim();
                if (!color) {
                    throw new Error(`Missing color scheme variable: --wordcloud-scheme-${i}`);
                }
                scheme.push(color);
            }

            return scheme;
        } catch (error) {
            console.error('Failed to load color scheme:', error);
            // Fallback to a basic color scheme
            return [
                style.getPropertyValue('--color-primary').trim() || '#4a90e2',
                style.getPropertyValue('--color-primary-dark').trim() || '#357abd'
            ];
        }
    }

    static getColorForWord(word, index, totalWords) {
        const scheme = this.getWordCloudScheme();
        const { colorAssignment } = this.config;

        try {
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
            console.error('Error assigning color:', error);
            return scheme[0];
        }
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
        
        // Return white for dark backgrounds, black for light backgrounds
        return luminance > 0.5 ? '#333333' : '#ffffff';
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
            return color;
        }
    }

    static setupColorTransitions(elements, { duration = 200, property = 'color' } = {}) {
        elements.forEach(element => {
            element.style.transition = `${property} ${duration}ms var(--transition-timing, cubic-bezier(0.4, 0, 0.2, 1))`;
        });
    }
} 