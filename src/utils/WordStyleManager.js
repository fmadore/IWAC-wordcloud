import { ConfigManager } from '../config/ConfigManager.js';
import { FontManager } from './FontManager.js';
import { ColorManager } from './ColorManager.js';
import { CSSVariableManager } from './CSSVariableManager.js';
import { ErrorManager } from './ErrorManager.js';

export class WordStyleManager {
    static get config() {
        return ConfigManager.getInstance().getFontConfig();
    }

    static applyWordStyles(wordElements) {
        try {
            const totalWords = wordElements.size();
            const transitionDuration = CSSVariableManager.getNumber('--transition-normal', 300);
            const opacityNormal = CSSVariableManager.getNumber('--wordcloud-opacity-normal', 1);
            
            wordElements
                .style("fill", (d, i) => ColorManager.getColorForWord(d, i, totalWords))
                .attr("text-anchor", "middle")
                .style("cursor", "pointer")
                .style("opacity", opacityNormal)
                .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                .text(d => d.text)
                .style("transition", `all ${transitionDuration}ms ease`);

            // Apply font styles using FontManager
            wordElements.each(function(d) {
                FontManager.applyFontStyles(d3.select(this), d.size);
            });

            // Add hover effects
            const opacityHover = CSSVariableManager.getNumber('--wordcloud-opacity-hover', 0.8);
            wordElements
                .on("mouseover", function() {
                    d3.select(this)
                        .style("opacity", opacityHover);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .style("opacity", opacityNormal);
                });
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'WordStyleManager',
                method: 'applyWordStyles'
            });
        }
    }

    static addRankInformation(words) {
        return words.map((word, index) => ({
            ...word,
            rank: index + 1
        }));
    }

    static calculateWordSize(size, words, area) {
        return FontManager.calculateFontSize({ size }, words, area);
    }
} 