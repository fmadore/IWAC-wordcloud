import { ConfigManager } from '../config/ConfigManager.js';
import { FontManager } from './FontManager.js';

export class WordStyleManager {
    static get config() {
        return ConfigManager.getInstance().getFontConfig();
    }

    static applyWordStyles(wordElements) {
        wordElements
            .style("fill", () => this.getRandomColor())
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text);

        // Apply font styles using FontManager
        wordElements.each(function(d) {
            FontManager.applyFontStyles(d3.select(this), d.size);
        });
    }

    static addRankInformation(words) {
        return words.map((word, index) => ({
            ...word,
            rank: index + 1
        }));
    }

    static getColorScheme() {
        return d3.schemeCategory10;
    }

    static getRandomColor() {
        const colors = this.getColorScheme();
        return colors[~~(Math.random() * colors.length)];
    }

    static calculateWordSize(size, words, area) {
        return FontManager.calculateFontSize({ size }, words, area);
    }
} 