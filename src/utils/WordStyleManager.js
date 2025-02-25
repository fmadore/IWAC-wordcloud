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
            const useTextShadow = true; // Enable text shadow for better legibility
            
            wordElements
                .style("fill", (d, i) => ColorManager.getColorForWord(d, i, totalWords))
                .attr("text-anchor", "middle")
                .style("cursor", "pointer")
                .style("opacity", opacityNormal)
                .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                .text(d => d.text)
                .style("transition", `all ${transitionDuration}ms ease`);

            // Apply enhanced font styles using FontManager
            wordElements.each(function(d, i) {
                // Get font weight based on word frequency/rank
                const fontWeight = FontManager.getFontWeightByFrequency(i, totalWords);
                
                // Apply font styles with text shadow
                FontManager.applyFontStyles(
                    d3.select(this), 
                    d.size, 
                    fontWeight,
                    useTextShadow
                );
            });

            // Enhanced hover effects
            const opacityHover = CSSVariableManager.getNumber('--wordcloud-opacity-hover', 0.8);
            const hoverScale = CSSVariableManager.getNumber('--wordcloud-hover-scale', 1.2);
            const hoverTextShadow = CSSVariableManager.get('--wordcloud-text-shadow-hover');
            
            wordElements
                .on("mouseover", function() {
                    d3.select(this)
                        .style("opacity", opacityHover)
                        .style("text-shadow", hoverTextShadow)
                        .style("transform", `scale(${hoverScale})`);
                })
                .on("mouseout", function(d, i) {
                    d3.select(this)
                        .style("opacity", opacityNormal)
                        .style("text-shadow", CSSVariableManager.get('--wordcloud-text-shadow'))
                        .style("transform", "scale(1)");
                });
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'WordStyleManager',
                method: 'applyWordStyles'
            });
        }
    }

    /**
     * Apply enhanced word styles with gradient coloring and variable font weights
     * @param {Object} wordElements - D3 selection of word elements
     */
    static applyEnhancedWordStyles(wordElements) {
        try {
            const totalWords = wordElements.size();
            const transitionDuration = CSSVariableManager.getNumber('--transition-normal', 300);
            const opacityNormal = CSSVariableManager.getNumber('--wordcloud-opacity-normal', 1);
            const useTextShadow = true;
            
            wordElements
                .style("fill", (d, i) => ColorManager.getGradientColor(i, totalWords))
                .attr("text-anchor", "middle")
                .style("cursor", "pointer")
                .style("opacity", opacityNormal)
                .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate})`)
                .text(d => d.text)
                .style("transition", `all ${transitionDuration}ms ease`);

            // Apply enhanced font styles with variable weights
            wordElements.each(function(d, i) {
                // Get numeric font weight (300-600) based on frequency
                const fontWeight = FontManager.getNumericFontWeight(i, totalWords);
                
                d3.select(this)
                    .style("font-family", FontManager.getFontFamily())
                    .style("font-weight", fontWeight)
                    .style("font-size", typeof d.size === 'number' ? `${d.size}px` : d.size)
                    .style("text-shadow", CSSVariableManager.get('--wordcloud-text-shadow'));
            });

            // Enhanced hover effects with scale and shadow
            const opacityHover = CSSVariableManager.getNumber('--wordcloud-opacity-hover', 0.8);
            const hoverScale = CSSVariableManager.getNumber('--wordcloud-hover-scale', 1.2);
            const hoverTextShadow = CSSVariableManager.get('--wordcloud-text-shadow-hover');
            
            wordElements
                .on("mouseover", function() {
                    d3.select(this)
                        .style("opacity", opacityHover)
                        .style("text-shadow", hoverTextShadow)
                        .style("transform", `scale(${hoverScale})`)
                        .style("z-index", 10);
                })
                .on("mouseout", function() {
                    d3.select(this)
                        .style("opacity", opacityNormal)
                        .style("text-shadow", CSSVariableManager.get('--wordcloud-text-shadow'))
                        .style("transform", "scale(1)")
                        .style("z-index", 1);
                });
        } catch (error) {
            ErrorManager.getInstance().handleError(error, {
                component: 'WordStyleManager',
                method: 'applyEnhancedWordStyles'
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

    /**
     * Calculate word size using fluid typography with clamp()
     * @param {number} size - Word size/frequency value
     * @param {Array} words - Array of all words
     * @param {number} area - Container area
     * @returns {string} Font size with clamp() function
     */
    static calculateFluidWordSize(size, words, area) {
        return FontManager.calculateFluidFontSize({ size }, words, area);
    }
} 