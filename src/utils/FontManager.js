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
        const scaledSize = baseSize * (word.size / Math.max(...words.map(w => w.size)));
        return Math.min(Math.max(scaledSize, fontConfig.minSize), this.calculateMaxFontSize(area));
    }

    static applyFontStyles(element, size, weight = 'normal') {
        element
            .style("font-family", CSSVariableManager.get('--font-base'))
            .style("font-size", `${size}px`)
            .style("font-weight", this._getWeightValue(weight));
    }

    static getFontFamily() {
        return CSSVariableManager.get('--font-base');
    }

    static _getWeightValue(weight) {
        const weightMap = {
            'normal': CSSVariableManager.get('--font-weight-normal', '400'),
            'medium': CSSVariableManager.get('--font-weight-medium', '500'),
            'semibold': CSSVariableManager.get('--font-weight-semibold', '600')
        };
        return weightMap[weight] || weightMap.normal;
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