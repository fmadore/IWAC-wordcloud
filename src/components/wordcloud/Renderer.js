import { Tooltip } from '../Tooltip.js';
import { StyleManager } from '../../utils/StyleManager.js';
import { AnimationManager } from '../../utils/AnimationManager.js';
import { WordStyleManager } from '../../utils/WordStyleManager.js';

export class WordCloudRenderer {
    constructor(container, options) {
        this.container = container;
        this.options = options;
        this.svg = null;
        this.wordGroup = null;
        this.tooltip = new Tooltip();
    }

    createSVG() {
        this.clear();
        
        // Create wrapper div for better control
        const wrapper = document.createElement('div');
        StyleManager.setupWrapper(wrapper);
        this.container.appendChild(wrapper);
        
        this.svg = d3.select(wrapper)
            .append("svg");
            
        StyleManager.setupSVG(this.svg);
        this.svg.attr("viewBox", `0 0 ${this.options.width} ${this.options.height}`);

        return this.svg;
    }

    createWordGroup(svg) {
        this.wordGroup = svg.append("g")
            .attr("transform", `translate(${this.options.width / 2},${this.options.height / 2})`);
        return this.wordGroup;
    }

    updateDimensions(width, height) {
        if (!width || !height) return;
        
        this.options.width = width;
        this.options.height = height;

        if (this.svg) {
            this.svg.attr("viewBox", `0 0 ${width} ${height}`);
        }
        
        if (this.wordGroup) {
            this.wordGroup.attr("transform", `translate(${width / 2},${height / 2})`);
        }
    }

    renderWords(wordGroup, words) {
        if (!words || words.length === 0) return;
        
        // Remove existing words
        wordGroup.selectAll("text").remove();
        const wordsWithRank = WordStyleManager.addRankInformation(words);

        const wordElements = wordGroup.selectAll("text")
            .data(wordsWithRank)
            .enter()
            .append("text");

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