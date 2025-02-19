import { Tooltip } from '../Tooltip.js';
import { ElementClassManager } from '../../utils/ElementClassManager.js';
import { AnimationManager } from '../../utils/AnimationManager.js';
import { WordStyleManager } from '../../utils/WordStyleManager.js';
import { WORDCLOUD_EVENTS, ANIMATION_EVENTS } from '../../events/EventTypes.js';

export class WordCloudRenderer {
    constructor(container, { config, eventBus }) {
        this.container = container;
        this.config = config;
        this.eventBus = eventBus;
        this.svg = null;
        this.wordGroup = null;
        this.tooltip = new Tooltip({ config });
        this.wordList = null;
        this.setupEventHandlers();
    }

    setupEventHandlers() {
        // Listen for animation events
        this.eventBus.on(ANIMATION_EVENTS.TRANSITION_START, async ({ type, word }) => {
            if (type === 'hover') {
                await AnimationManager.wordEnter(word.element, word.size);
            }
        });

        this.eventBus.on(ANIMATION_EVENTS.TRANSITION_COMPLETE, ({ words }) => {
            // Handle any post-transition cleanup or additional animations
        });
    }

    setWordList(wordList) {
        this.wordList = wordList;
    }

    createSVG() {
        this.clear();
        
        const wrapper = document.createElement('div');
        wrapper.style.width = '100%';
        wrapper.style.height = '100%';
        ElementClassManager.setupWrapper(wrapper);
        this.container.appendChild(wrapper);
        
        this.svg = d3.select(wrapper)
            .append("svg")
            .attr("width", "100%")
            .attr("height", "100%");
            
        ElementClassManager.setupSVG(this.svg);
        
        // Get dimensions from CSS variables
        const style = getComputedStyle(document.documentElement);
        const minHeight = parseInt(style.getPropertyValue('--wordcloud-min-height')) || 400;
        const maxWidth = parseInt(style.getPropertyValue('--wordcloud-max-width')) || 1200;
        
        // Get current dimensions and ensure they are valid
        const dimensions = this.config.get('wordcloud.dimensions');
        const width = Math.min(maxWidth, Math.max(100, dimensions.width || 800));
        const height = Math.max(minHeight, dimensions.height || 600);
        
        this.svg.attr("viewBox", `0 0 ${width} ${height}`);

        return this.svg;
    }

    createWordGroup(svg) {
        // Get dimensions from CSS variables
        const style = getComputedStyle(document.documentElement);
        const minHeight = parseInt(style.getPropertyValue('--wordcloud-min-height')) || 400;
        const maxWidth = parseInt(style.getPropertyValue('--wordcloud-max-width')) || 1200;
        
        // Get current dimensions and ensure they are valid
        const dimensions = this.config.get('wordcloud.dimensions');
        const width = Math.min(maxWidth, Math.max(100, dimensions.width || 800));
        const height = Math.max(minHeight, dimensions.height || 600);
        
        this.wordGroup = svg.append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);
        return this.wordGroup;
    }

    updateDimensions(width, height) {
        // Get dimensions from CSS variables
        const style = getComputedStyle(document.documentElement);
        const minHeight = parseInt(style.getPropertyValue('--wordcloud-min-height')) || 400;
        const maxWidth = parseInt(style.getPropertyValue('--wordcloud-max-width')) || 1200;
        
        // Ensure dimensions respect CSS constraints
        if (!width || !height) {
            const dimensions = this.config.get('wordcloud.dimensions');
            width = Math.min(maxWidth, Math.max(100, dimensions.width || 800));
            height = Math.max(minHeight, dimensions.height || 600);
        } else {
            width = Math.min(maxWidth, Math.max(100, width));
            height = Math.max(minHeight, height);
        }
        
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
            .attr("data-word", d => d.text)
            .attr("text-anchor", "middle")
            .attr("transform", d => `translate(${[d.x, d.y]})rotate(${d.rotate || 0})`);

        WordStyleManager.applyWordStyles(wordElements);
        this.setupWordInteractions(wordElements);

        return wordElements;
    }

    setupWordInteractions(wordElements) {
        wordElements
            .on("mouseover", (event, d) => {
                this.tooltip.show(event, d);
                this.eventBus.emit(WORDCLOUD_EVENTS.WORD_HOVER, { 
                    word: { ...d, element: event.target },
                    event
                });
                AnimationManager.wordEnter(event.target, d.size);
            })
            .on("mouseout", (event, d) => {
                this.tooltip.hide();
                if (this.wordList) {
                    this.wordList.clearHighlight();
                }
                AnimationManager.wordExit(event.target, d.size);
            })
            .on("click", (event, d) => {
                this.eventBus.emit(WORDCLOUD_EVENTS.WORD_CLICK, { 
                    word: { ...d, element: event.target },
                    event
                });
            });
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