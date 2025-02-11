import { Tooltip } from '../Tooltip.js';
import { StyleManager } from '../../utils/StyleManager.js';
import { AnimationManager } from '../../utils/AnimationManager.js';
import { WordStyleManager } from '../../utils/WordStyleManager.js';
import { ConfigManager } from '../../config/ConfigManager.js';

export class WordCloudRenderer {
    constructor(container) {
        this.container = container;
        this.config = ConfigManager.getInstance();
        this.svg = null;
        this.wordGroup = null;
        this.tooltip = new Tooltip();
    }

    createSVG() {
        this.clear();
        
        const wrapper = document.createElement('div');
        StyleManager.setupWrapper(wrapper);
        this.container.appendChild(wrapper);
        
        this.svg = d3.select(wrapper)
            .append("svg");
            
        StyleManager.setupSVG(this.svg);
        
        const dimensions = this.config.get('wordcloud.dimensions');
        this.svg.attr("viewBox", `0 0 ${dimensions.width} ${dimensions.height}`);

        return this.svg;
    }

    createWordGroup(svg) {
        const dimensions = this.config.get('wordcloud.dimensions');
        this.wordGroup = svg.append("g")
            .attr("transform", `translate(${dimensions.width / 2},${dimensions.height / 2})`);
        return this.wordGroup;
    }

    updateDimensions(width, height) {
        if (!width || !height) return;
        
        this.config.updateDimensions(width, height);

        if (this.svg) {
            this.svg.attr("viewBox", `0 0 ${width} ${height}`);
        }
        
        if (this.wordGroup) {
            this.wordGroup.attr("transform", `translate(${width / 2},${height / 2})`);
        }
    }

    renderWords(wordGroup, words) {
        if (!words || words.length === 0) return;
        
        wordGroup.selectAll("text").remove();
        const wordsWithRank = WordStyleManager.addRankInformation(words);

        const wordElements = wordGroup.selectAll("text")
            .data(wordsWithRank)
            .enter()
            .append("text")
            .attr("data-word", d => d.text);

        WordStyleManager.applyWordStyles(wordElements);
        AnimationManager.setupWordInteractions(wordElements, this.tooltip);

        return wordElements;
    }

    clear() {
        if (this.tooltip) {
            this.tooltip.destroy();
        }
        if (this.container) {
            while (this.container.firstChild) {
                this.container.removeChild(this.container.firstChild);
            }
        }
        this.svg = null;
        this.wordGroup = null;
    }
} 