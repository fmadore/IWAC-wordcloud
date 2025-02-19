import { ErrorManager } from './ErrorManager.js';

export class CSSVariableManager {
    static get(name, fallback = '') {
        try {
            const value = getComputedStyle(document.documentElement)
                .getPropertyValue(name)
                .trim();
            return value || fallback;
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'CSSVariableManager',
                method: 'get',
                variable: name
            });
            return fallback;
        }
    }

    static getNumber(name, fallback = 0) {
        try {
            const value = this.get(name);
            const number = parseInt(value);
            return isNaN(number) ? fallback : number;
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'CSSVariableManager',
                method: 'getNumber',
                variable: name
            });
            return fallback;
        }
    }

    static getColor(name, fallback = '#000000') {
        return this.get(name, fallback);
    }

    static getDimensions() {
        return {
            width: this.getNumber('--wordcloud-width'),
            height: this.getNumber('--wordcloud-height'),
            minHeight: this.getNumber('--wordcloud-min-height'),
            maxWidth: this.getNumber('--wordcloud-max-width'),
            padding: this.getNumber('--wordcloud-padding')
        };
    }

    static getFontConfig() {
        return {
            minSize: this.getNumber('--wordcloud-font-min-size'),
            scaleFactor: this.getNumber('--wordcloud-font-scale-factor'),
            scaleMin: this.getNumber('--wordcloud-font-scale-min'),
            scaleMax: this.getNumber('--wordcloud-font-scale-max'),
            family: this.get('--font-base', 'system-ui, sans-serif')
        };
    }

    static getColorScheme() {
        const scheme = [];
        
        // Try wordcloud specific colors first
        for (let i = 1; i <= 10; i++) {
            const color = this.getColor(`--wordcloud-scheme-${i}`);
            if (color) scheme.push(color);
        }

        // Fallback to semantic colors if needed
        if (scheme.length === 0) {
            const semanticColors = [
                '--color-primary',
                '--color-primary-dark',
                '--color-primary-light',
                '--color-gray-600',
                '--color-gray-500',
                '--color-gray-400'
            ];
            
            semanticColors.forEach(color => {
                const value = this.getColor(color);
                if (value) scheme.push(value);
            });
        }

        // Ensure minimum of two colors
        if (scheme.length < 2) {
            return [
                this.getColor('--color-primary', '#4a90e2'),
                this.getColor('--color-primary-dark', '#357abd')
            ];
        }

        return scheme;
    }
} 