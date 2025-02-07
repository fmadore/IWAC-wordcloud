import { ConfigManager } from '../config/ConfigManager.js';

export class WordStyleManager {
    static get config() {
        return ConfigManager.getInstance().getFontConfig();
    }

    static applyWordStyles(wordElements) {
        const { family } = this.config;
        wordElements
            .style("font-size", d => `${d.size}px`)
            .style("font-family", family)
            .style("fill", () => this.getRandomColor())
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
            .text(d => d.text);
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
        const { minSize, maxSize, scaleFactor } = this.config;
        const baseSize = Math.sqrt(area / (words.length * scaleFactor));
        const scaledSize = baseSize * (size / Math.max(...words.map(w => w.size)));
        return Math.min(Math.max(scaledSize, minSize), maxSize);
    }
} 